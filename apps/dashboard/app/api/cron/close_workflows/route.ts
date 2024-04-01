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

  const workflows = await prisma.workflow.findMany({
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

  if (!workflows.length) {
    return responses.successResponse({ message: "No workflows to close" });
  }

  const mutationResp = await prisma.workflow.updateMany({
    where: {
      id: {
        in: workflows.map((workflow) => workflow.id),
      },
    },
    data: {
      status: "completed",
    },
  });

  return responses.successResponse({
    message: `Closed ${mutationResp.count} workflow(s)`,
  });
}
