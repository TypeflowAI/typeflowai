import { responses } from "@/app/lib/api/response";
import { headers } from "next/headers";

import { default as webhookHandler } from "@typeflowai/ee/billing/api/stripe-webhook";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature") as string;

  const { status, message } = await webhookHandler(body, signature);

  if (status != 200) {
    return responses.badRequestResponse(message?.toString() || "Something went wrong");
  }
  return responses.successResponse({ message }, true);
}
