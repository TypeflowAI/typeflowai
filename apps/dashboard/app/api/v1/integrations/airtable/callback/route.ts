import { responses } from "@/app/lib/api/response";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { connectAirtable, fetchAirtableAuthToken } from "@typeflowai/lib/airtable/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { AIRTABLE_CLIENT_ID, WEBAPP_URL } from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";

async function getEmail(token: string) {
  const req_ = await fetch("https://api.airtable.com/v0/meta/whoami", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const res_ = await req_.json();

  return z.string().parse(res_?.email);
}

export async function GET(req: NextRequest) {
  const url = req.url;
  const queryParams = new URLSearchParams(url.split("?")[1]); // Split the URL and get the query parameters
  const environmentId = queryParams.get("state"); // Get the value of the 'state' parameter
  const code = queryParams.get("code");

  const session = await getServerSession(authOptions);

  if (!environmentId) {
    return responses.badRequestResponse("Invalid environmentId");
  }

  if (!session) {
    return responses.notAuthenticatedResponse();
  }

  if (code && typeof code !== "string") {
    return responses.badRequestResponse("`code` must be a string");
  }
  const canUserAccessEnvironment = await hasUserEnvironmentAccess(session?.user.id, environmentId);
  if (!canUserAccessEnvironment) {
    return responses.unauthorizedResponse();
  }

  const client_id = AIRTABLE_CLIENT_ID;
  const redirect_uri = WEBAPP_URL + "/api/v1/integrations/airtable/callback";
  const code_verifier = Buffer.from(environmentId + session.user.id + environmentId)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  if (!client_id) return responses.internalServerErrorResponse("Airtable client id is missing");
  if (!redirect_uri) return responses.internalServerErrorResponse("Airtable redirect url is missing");

  const formData = {
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    code_verifier,
  };

  try {
    const key = await fetchAirtableAuthToken(formData);
    if (!key) {
      return responses.notFoundResponse("airtable auth token", key);
    }
    const email = await getEmail(key.access_token);

    await connectAirtable({
      environmentId,
      email,
      key,
    });
    return NextResponse.redirect(`${WEBAPP_URL}/environments/${environmentId}/integrations/airtable`);
  } catch (error) {
    console.error(error);
    responses.internalServerErrorResponse(error);
  }
  responses.badRequestResponse("unknown error occurred");
}
