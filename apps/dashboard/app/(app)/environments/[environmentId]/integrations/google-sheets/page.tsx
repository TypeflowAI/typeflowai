import GoogleSheetWrapper from "@/app/(app)/environments/[environmentId]/integrations/google-sheets/components/GoogleSheetWrapper";

import {
  GOOGLE_SHEETS_CLIENT_ID,
  GOOGLE_SHEETS_CLIENT_SECRET,
  GOOGLE_SHEETS_REDIRECT_URL,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getSpreadSheets } from "@typeflowai/lib/googleSheet/service";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationGoogleSheets } from "@typeflowai/types/integration/googleSheet";
import GoBackButton from "@typeflowai/ui/GoBackButton";

export default async function GoogleSheet({ params }) {
  const enabled = !!(GOOGLE_SHEETS_CLIENT_ID && GOOGLE_SHEETS_CLIENT_SECRET && GOOGLE_SHEETS_REDIRECT_URL);
  const [workflows, integrations, environment] = await Promise.all([
    getWorkflows(params.environmentId),
    getIntegrations(params.environmentId),
    getEnvironment(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }

  const googleSheetIntegration: TIntegrationGoogleSheets | undefined = integrations?.find(
    (integration): integration is TIntegrationGoogleSheets => integration.type === "googleSheets"
  );
  let spreadSheetArray: TIntegrationItem[] = [];
  if (googleSheetIntegration && googleSheetIntegration.config.key) {
    spreadSheetArray = await getSpreadSheets(params.environmentId);
  }
  return (
    <>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <div className="h-[75vh] w-full">
        <GoogleSheetWrapper
          enabled={enabled}
          environment={environment}
          workflows={workflows}
          spreadSheetArray={spreadSheetArray}
          googleSheetIntegration={googleSheetIntegration}
          webAppUrl={WEBAPP_URL}
        />
      </div>
    </>
  );
}
