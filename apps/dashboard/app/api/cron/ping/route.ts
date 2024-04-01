import { responses } from "@/app/lib/api/response";
import packageJson from "@/package.json";
import { headers } from "next/headers";

import { prisma } from "@typeflowai/database";
import { CRON_SECRET } from "@typeflowai/lib/constants";
import { captureTelemetry } from "@typeflowai/lib/telemetry";

export async function POST() {
  const headersList = headers();
  const apiKey = headersList.get("x-api-key");

  if (!apiKey || apiKey !== CRON_SECRET) {
    return responses.notAuthenticatedResponse();
  }

  const [workflowCount, responseCount, userCount] = await Promise.all([
    prisma.workflow.count(),
    prisma.response.count(),
    prisma.user.count(),
  ]);

  captureTelemetry("ping", {
    version: packageJson.version,
    workflowCount,
    responseCount,
    userCount,
  });

  return responses.successResponse({}, true);
}
