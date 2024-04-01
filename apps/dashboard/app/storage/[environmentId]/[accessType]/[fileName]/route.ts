import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { handleDeleteFile } from "@/app/storage/[environmentId]/[accessType]/[fileName]/lib/deleteFile";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { ZStorageRetrievalParams } from "@typeflowai/types/storage";

import getFile from "./lib/getFile";

export async function GET(
  _: NextRequest,
  { params }: { params: { environmentId: string; accessType: string; fileName: string } }
) {
  const paramValidation = ZStorageRetrievalParams.safeParse(params);

  if (!paramValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(paramValidation.error),
      true
    );
  }

  const { environmentId, accessType, fileName: fileNameOG } = params;

  const fileName = decodeURIComponent(fileNameOG);

  if (accessType === "public") {
    return await getFile(environmentId, accessType, fileName);
  }

  // auth and download private file

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

  if (!session || !session.user) {
    return responses.notAuthenticatedResponse();
  }

  const isUserAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);

  if (!isUserAuthorized) {
    return responses.unauthorizedResponse();
  }

  const file = await getFile(environmentId, accessType, fileName);
  return file;
}

export async function DELETE(_: NextRequest, { params }: { params: { fileName: string } }) {
  if (!params.fileName) {
    return responses.badRequestResponse("Fields are missing or incorrectly formatted", {
      fileName: "fileName is required",
    });
  }

  const [environmentId, accessType, file] = params.fileName.split("/");

  const paramValidation = ZStorageRetrievalParams.safeParse({ fileName: file, environmentId, accessType });

  if (!paramValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(paramValidation.error),
      true
    );
  }
  // check if user is authenticated

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

  if (!session || !session.user) {
    return responses.notAuthenticatedResponse();
  }

  // check if the user has access to the environment

  const isUserAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);

  if (!isUserAuthorized) {
    return responses.unauthorizedResponse();
  }

  return await handleDeleteFile(
    paramValidation.data.environmentId,
    paramValidation.data.accessType,
    paramValidation.data.fileName
  );
}
