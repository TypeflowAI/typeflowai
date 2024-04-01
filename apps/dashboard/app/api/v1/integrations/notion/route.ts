import { responses } from "@/app/lib/api/response";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import {
  NOTION_AUTH_URL,
  NOTION_OAUTH_CLIENT_ID,
  NOTION_OAUTH_CLIENT_SECRET,
  NOTION_REDIRECT_URI,
} from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";

export async function GET(req: NextRequest) {
  const environmentId = req.headers.get("environmentId");

  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!environmentId) {
    return responses.badRequestResponse("environmentId is missing");
  }

  if (!session) {
    return responses.notAuthenticatedResponse();
  }

  const canUserAccessEnvironment = await hasUserEnvironmentAccess(session?.user.id, environmentId);
  if (!canUserAccessEnvironment) {
    return responses.unauthorizedResponse();
  }

  const client_id = NOTION_OAUTH_CLIENT_ID;
  const client_secret = NOTION_OAUTH_CLIENT_SECRET;
  const auth_url = NOTION_AUTH_URL;
  const redirect_uri = NOTION_REDIRECT_URI;
  if (!client_id) return responses.internalServerErrorResponse("Notion client id is missing");
  if (!redirect_uri) return responses.internalServerErrorResponse("Notion redirect url is missing");
  if (!client_secret) return responses.internalServerErrorResponse("Notion client secret is missing");
  if (!auth_url) return responses.internalServerErrorResponse("Notion auth url is missing");

  return responses.successResponse({ authUrl: `${auth_url}&state=${environmentId}` });
}
