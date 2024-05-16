import { responses } from "@/app/lib/api/response";
import { headers } from "next/headers";

import { prisma } from "@typeflowai/database";
import { CRON_SECRET } from "@typeflowai/lib/constants";

export async function POST() {
  const headersList = headers();
  const apiKey = headersList.get("x-api-key");

  if (!apiKey || apiKey !== CRON_SECRET) {
    return responses.notAuthenticatedResponse();
  }

  // close workflows that are in progress and have a closeOnDate in the past
  const workflowsToClose = await prisma.workflow.findMany({
    where: {
      status: "inProgress",
      closeOnDate: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (workflowsToClose.length) {
    await prisma.workflow.updateMany({
      where: {
        id: {
          in: workflowsToClose.map((workflow) => workflow.id),
        },
      },
      data: {
        status: "completed",
      },
    });
  }

  // run workflows that are scheduled and have a runOnDate in the past
  const scheduledWorkflows = await prisma.workflow.findMany({
    where: {
      status: "scheduled",
      runOnDate: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (scheduledWorkflows.length) {
    await prisma.workflow.updateMany({
      where: {
        id: {
          in: scheduledWorkflows.map((workflow) => workflow.id),
        },
      },
      data: {
        status: "inProgress",
      },
    });
  }

  return responses.successResponse({
    message: `Updated ${workflowsToClose.length} workflows to completed and ${scheduledWorkflows.length} workflows to inProgress.`,
  });
}
