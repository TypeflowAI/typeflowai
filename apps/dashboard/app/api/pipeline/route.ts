import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { headers } from "next/headers";

import { prisma } from "@typeflowai/database";
import { sendResponseFinishedEmail } from "@typeflowai/email";
import { INTERNAL_SECRET } from "@typeflowai/lib/constants";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { convertDatesInObject } from "@typeflowai/lib/time";
import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { ZPipelineInput } from "@typeflowai/types/pipelines";
import { TUserNotificationSettings } from "@typeflowai/types/user";

import { handleIntegrations } from "./lib/handleIntegrations";

export async function POST(request: Request) {
  // check authentication with x-api-key header and CRON_SECRET env variable
  if (headers().get("x-api-key") !== INTERNAL_SECRET) {
    return responses.notAuthenticatedResponse();
  }
  const jsonInput = await request.json();

  convertDatesInObject(jsonInput);

  const inputValidation = ZPipelineInput.safeParse(jsonInput);

  if (!inputValidation.success) {
    console.error(inputValidation.error);
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  const { environmentId, workflowId, event, response } = inputValidation.data;
  const product = await getProductByEnvironmentId(environmentId);
  if (!product) return;

  // get all webhooks of this environment where event in triggers
  const webhooks = await prisma.webhook.findMany({
    where: {
      environmentId,
      triggers: {
        has: event,
      },
      OR: [
        {
          workflowIds: {
            has: workflowId,
          },
        },
        {
          workflowIds: {
            isEmpty: true,
          },
        },
      ],
    },
  });

  // send request to all webhooks
  await Promise.all(
    webhooks.map(async (webhook) => {
      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          webhookId: webhook.id,
          event,
          data: response,
        }),
      });
    })
  );

  if (event === "responseFinished") {
    // check for email notifications
    // get all users that have a membership of this environment's team
    const users = await prisma.user.findMany({
      where: {
        memberships: {
          some: {
            team: {
              products: {
                some: {
                  environments: {
                    some: {
                      id: environmentId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const [integrations, workflowData] = await Promise.all([
      getIntegrations(environmentId),
      getWorkflow(workflowId),
    ]);
    const workflow = workflowData ? checkForRecallInHeadline(workflowData, "default") : undefined;

    if (integrations.length > 0 && workflow) {
      handleIntegrations(integrations, inputValidation.data, workflow);
    }
    // filter all users that have email notifications enabled for this workflow
    const usersWithNotifications = users.filter((user) => {
      const notificationSettings: TUserNotificationSettings | null = user.notificationSettings;
      if (notificationSettings?.alert && notificationSettings.alert[workflowId]) {
        return true;
      }
      return false;
    });

    // Exclude current response
    const responseCount = await getResponseCountByWorkflowId(workflowId);

    if (usersWithNotifications.length > 0) {
      if (!workflow) {
        console.error(`Pipeline: Workflow with id ${workflowId} not found`);
        return new Response("Workflow not found", {
          status: 404,
        });
      }
      // send email to all users
      await Promise.all(
        usersWithNotifications.map(async (user) => {
          await sendResponseFinishedEmail(user.email, environmentId, workflow, response, responseCount);
        })
      );
    }
    const updateWorkflowStatus = async (workflowId: string) => {
      // Get the workflow instance by workflowId
      const workflow = await getWorkflow(workflowId);

      if (workflow?.autoComplete) {
        // Get the number of responses to a workflow
        const responseCount = await prisma.response.count({
          where: {
            workflowId: workflowId,
          },
        });
        if (responseCount === workflow.autoComplete) {
          const updatedWorkflow = { ...workflow };
          updatedWorkflow.status = "completed";
          await updateWorkflow(updatedWorkflow);
        }
      }
    };

    await updateWorkflowStatus(workflowId);
  }

  return Response.json({ data: {} });
}
