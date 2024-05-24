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
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationGoogleSheets } from "@typeflowai/types/integration/googleSheet";
import { GoBackButton } from "@typeflowai/ui/GoBackButton";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

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
  const product = await getProductByEnvironmentId(params.environmentId);
  if (!product) {
    throw new Error("Product not found");
  }

  const googleSheetIntegration: TIntegrationGoogleSheets | undefined = integrations?.find(
    (integration): integration is TIntegrationGoogleSheets => integration.type === "googleSheets"
  );
  let spreadSheetArray: TIntegrationItem[] = [];
  if (googleSheetIntegration && googleSheetIntegration.config.key) {
    spreadSheetArray = await getSpreadSheets(params.environmentId);
  }
  return (
    <PageContentWrapper>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <PageHeader pageTitle="Google Sheets Integration" />
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
    </PageContentWrapper>
  );
}
