// headers -> "Content-Type" should be present and set to a valid MIME type
// body -> should be a valid file object (buffer)
// method -> PUT (to be the same as the signedUrl method)
import { responses } from "@/app/lib/api/response";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@typeflowai/lib/authOptions";
import { UPLOADS_DIR } from "@typeflowai/lib/constants";
import { validateLocalSignedUrl } from "@typeflowai/lib/crypto";
import { env } from "@typeflowai/lib/env.mjs";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { putFileToLocalStorage } from "@typeflowai/lib/storage/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const accessType = "public"; // public files are accessible by anyone
  const headersList = headers();

  const fileType = headersList.get("X-File-Type");
  const encodedFileName = headersList.get("X-File-Name");
  const environmentId = headersList.get("X-Environment-ID");

  const signedSignature = headersList.get("X-Signature");
  const signedUuid = headersList.get("X-UUID");
  const signedTimestamp = headersList.get("X-Timestamp");

  if (!fileType) {
    return responses.badRequestResponse("fileType is required");
  }

  if (!encodedFileName) {
    return responses.badRequestResponse("fileName is required");
  }

  if (!environmentId) {
    return responses.badRequestResponse("environmentId is required");
  }

  if (!signedSignature) {
    return responses.unauthorizedResponse();
  }

  if (!signedUuid) {
    return responses.unauthorizedResponse();
  }

  if (!signedTimestamp) {
    return responses.unauthorizedResponse();
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return responses.notAuthenticatedResponse();
  }

  const isUserAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);

  if (!isUserAuthorized) {
    return responses.unauthorizedResponse();
  }

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    return responses.notFoundResponse("TeamByEnvironmentId", environmentId);
  }

  const fileName = decodeURIComponent(encodedFileName);

  // validate signature

  const validated = validateLocalSignedUrl(
    signedUuid,
    fileName,
    environmentId,
    fileType,
    Number(signedTimestamp),
    signedSignature,
    env.ENCRYPTION_KEY
  );

  if (!validated) {
    return responses.unauthorizedResponse();
  }

  const formData = await req.formData();
  const file = formData.get("file") as unknown as File;

  if (!file) {
    return responses.badRequestResponse("fileBuffer is required");
  }

  try {
    const plan = ["active", "canceled"].includes(team.billing.subscriptionStatus) ? "paid" : "free";
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);

    await putFileToLocalStorage(fileName, fileBuffer, accessType, environmentId, UPLOADS_DIR, false, plan);

    return responses.successResponse({
      message: "File uploaded successfully",
    });
  } catch (err) {
    if (err.name === "FileTooLargeError") {
      return responses.badRequestResponse(err.message);
    }
    return responses.internalServerErrorResponse("File upload failed");
  }
}
