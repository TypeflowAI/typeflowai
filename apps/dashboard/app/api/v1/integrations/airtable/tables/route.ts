import { responses } from "@/app/lib/api/response";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import * as z from "zod";

import { getTables } from "@typeflowai/lib/airtable/service";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getIntegrationByType } from "@typeflowai/lib/integration/service";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";

export async function GET(req: NextRequest) {
  const url = req.url;
  const environmentId = req.headers.get("environmentId");
  const queryParams = new URLSearchParams(url.split("?")[1]);

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

  const baseId = z.string().safeParse(queryParams.get("baseId"));

  if (!baseId.success) {
    return responses.missingFieldResponse("Base Id is Required");
  }

  if (!session) {
    return responses.notAuthenticatedResponse();
  }

  if (!environmentId) {
    return responses.badRequestResponse("environmentId is missing");
  }

  const canUserAccessEnvironment = await hasUserEnvironmentAccess(session?.user.id, environmentId);
  if (!canUserAccessEnvironment || !environmentId) {
    return responses.unauthorizedResponse();
  }

  const integration = (await getIntegrationByType(environmentId, "airtable")) as TIntegrationAirtable;

  if (!integration) {
    return responses.notFoundResponse("Integration not found", environmentId);
  }

  const tables = await getTables(integration.config.key, baseId.data);
  return responses.successResponse(tables);
}
