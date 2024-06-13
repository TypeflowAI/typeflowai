"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getSpreadsheetNameById } from "@typeflowai/lib/googleSheet/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TIntegrationGoogleSheets } from "@typeflowai/types/integration/googleSheet";

export async function getSpreadsheetNameByIdAction(
  googleSheetIntegration: TIntegrationGoogleSheets,
  environmentId: string,
  spreadsheetId: string
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getSpreadsheetNameById(googleSheetIntegration, spreadsheetId);
}
