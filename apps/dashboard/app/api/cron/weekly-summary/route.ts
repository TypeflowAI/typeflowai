import { responses } from "@/app/lib/api/response";
import { headers } from "next/headers";

import { prisma } from "@typeflowai/database";
import { sendNoLiveWorkflowNotificationEmail, sendWeeklySummaryNotificationEmail } from "@typeflowai/email";
import { CRON_SECRET } from "@typeflowai/lib/constants";
import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { convertResponseValue } from "@typeflowai/lib/responses";
import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import {
  TWeeklySummaryEnvironmentData,
  TWeeklySummaryNotificationDataWorkflow,
  TWeeklySummaryNotificationResponse,
  TWeeklySummaryProductData,
  TWeeklySummaryWorkflowResponseData,
} from "@typeflowai/types/weeklySummary";

const BATCH_SIZE = 500;

export async function POST(): Promise<Response> {
  // Check authentication
  if (headers().get("x-api-key") !== CRON_SECRET) {
    return responses.notAuthenticatedResponse();
  }

  const emailSendingPromises: Promise<void>[] = [];

  // Fetch all team IDs
  const teamIds = await getTeamIds();

  // Paginate through teams
  for (let i = 0; i < teamIds.length; i += BATCH_SIZE) {
    const batchedTeamIds = teamIds.slice(i, i + BATCH_SIZE);
    // Fetch products for batched teams asynchronously
    const batchedProductsPromises = batchedTeamIds.map((teamId) => getProductsByTeamId(teamId));

    const batchedProducts = await Promise.all(batchedProductsPromises);
    for (const products of batchedProducts) {
      for (const product of products) {
        const teamMembers = product.team.memberships;
        const teamMembersWithNotificationEnabled = teamMembers.filter(
          (member) =>
            member.user.notificationSettings?.weeklySummary &&
            member.user.notificationSettings.weeklySummary[product.id]
        );

        if (teamMembersWithNotificationEnabled.length === 0) continue;

        const notificationResponse = getNotificationResponse(product.environments[0], product.name);

        if (notificationResponse.insights.numLiveWorkflow === 0) {
          for (const teamMember of teamMembersWithNotificationEnabled) {
            emailSendingPromises.push(
              sendNoLiveWorkflowNotificationEmail(teamMember.user.email, notificationResponse)
            );
          }
          continue;
        }

        for (const teamMember of teamMembersWithNotificationEnabled) {
          emailSendingPromises.push(
            sendWeeklySummaryNotificationEmail(teamMember.user.email, notificationResponse)
          );
        }
      }
    }
  }

  await Promise.all(emailSendingPromises);
  return responses.successResponse({}, true);
}

const getTeamIds = async (): Promise<string[]> => {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
    },
  });
  return teams.map((team) => team.id);
};

const getProductsByTeamId = async (teamId: string): Promise<TWeeklySummaryProductData[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await prisma.product.findMany({
    where: {
      teamId: teamId,
    },
    select: {
      id: true,
      name: true,
      environments: {
        where: {
          type: "production",
        },
        select: {
          id: true,
          workflows: {
            where: {
              NOT: {
                AND: [
                  { status: "completed" },
                  {
                    responses: {
                      none: {
                        createdAt: {
                          gte: sevenDaysAgo,
                        },
                      },
                    },
                  },
                ],
              },
              status: {
                not: "draft",
              },
            },
            select: {
              id: true,
              name: true,
              questions: true,
              status: true,
              responses: {
                where: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
                select: {
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  finished: true,
                  data: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
              displays: {
                where: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      team: {
        select: {
          memberships: {
            select: {
              user: {
                select: {
                  email: true,
                  notificationSettings: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

const getNotificationResponse = (
  environment: TWeeklySummaryEnvironmentData,
  productName: string
): TWeeklySummaryNotificationResponse => {
  const insights = {
    totalCompletedResponses: 0,
    totalDisplays: 0,
    totalResponses: 0,
    completionRate: 0,
    numLiveWorkflow: 0,
  };

  const workflows: TWeeklySummaryNotificationDataWorkflow[] = [];
  // iterate through the workflows and calculate the overall insights
  for (const workflow of environment.workflows) {
    const parsedWorkflow = checkForRecallInHeadline(workflow, "default");
    const workflowData: TWeeklySummaryNotificationDataWorkflow = {
      id: parsedWorkflow.id,
      name: parsedWorkflow.name,
      status: parsedWorkflow.status,
      responseCount: parsedWorkflow.responses.length,
      responses: [],
    };
    // iterate through the responses and calculate the workflow insights
    for (const response of parsedWorkflow.responses) {
      // only take the first 3 responses
      if (workflowData.responses.length >= 3) {
        break;
      }
      const workflowResponses: TWeeklySummaryWorkflowResponseData[] = [];
      for (const question of parsedWorkflow.questions) {
        const headline = question.headline;
        const responseValue = convertResponseValue(response.data[question.id], question);
        const workflowResponse: TWeeklySummaryWorkflowResponseData = {
          headline: getLocalizedValue(headline, "default"),
          responseValue,
          questionType: question.type,
        };
        workflowResponses.push(workflowResponse);
      }
      workflowData.responses = workflowResponses;
    }
    workflows.push(workflowData);
    // calculate the overall insights
    if (workflow.status == "inProgress") {
      insights.numLiveWorkflow += 1;
    }
    insights.totalCompletedResponses += workflow.responses.filter((r) => r.finished).length;
    insights.totalDisplays += workflow.displays.length;
    insights.totalResponses += workflow.responses.length;
    insights.completionRate = Math.round((insights.totalCompletedResponses / insights.totalResponses) * 100);
  }
  // build the notification response needed for the emails
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  return {
    environmentId: environment.id,
    currentDate: new Date(),
    lastWeekDate,
    productName: productName,
    workflows,
    insights,
  };
};
