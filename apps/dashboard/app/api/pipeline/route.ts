import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@typeflowai/database";
import { INTERNAL_SECRET } from "@typeflowai/lib/constants";
import { sendResponseFinishedEmail } from "@typeflowai/lib/emails/emails";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { convertDatesInObject } from "@typeflowai/lib/time";
import { getWorkflow, updateWorkflow } from "@typeflowai/lib/workflow/service";
import { ZPipelineInput } from "@typeflowai/types/pipelines";
import { TUserNotificationSettings } from "@typeflowai/types/user";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

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

    let workflowData;

    const integrations = await getIntegrations(environmentId);

    if (integrations.length > 0) {
      workflowData = await prisma.workflow.findUnique({
        where: {
          id: workflowId,
        },
        select: {
          id: true,
          name: true,
          questions: true,
        },
      });
      handleIntegrations(integrations, inputValidation.data, workflowData);
    }
    // filter all users that have email notifications enabled for this workflow
    const usersWithNotifications = users.filter((user) => {
      const notificationSettings: TUserNotificationSettings | null = user.notificationSettings;
      if (notificationSettings?.alert && notificationSettings.alert[workflowId]) {
        return true;
      }
      return false;
    });

    if (usersWithNotifications.length > 0) {
      // get workflow
      if (!workflowData) {
        workflowData = await prisma.workflow.findUnique({
          where: {
            id: workflowId,
          },
          select: {
            id: true,
            name: true,
            questions: true,
          },
        });
      }

      if (!workflowData) {
        console.error(`Pipeline: Workflow with id ${workflowId} not found`);
        return new Response("Workflow not found", {
          status: 404,
        });
      }
      // create workflow object
      const workflow = {
        id: workflowData.id,
        name: workflowData.name,
        questions: JSON.parse(JSON.stringify(workflowData.questions)) as TWorkflowQuestion[],
      };
      // send email to all users
      await Promise.all(
        usersWithNotifications.map(async (user) => {
          await sendResponseFinishedEmail(user.email, environmentId, workflow, response);
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

  return NextResponse.json({ data: {} });
}
