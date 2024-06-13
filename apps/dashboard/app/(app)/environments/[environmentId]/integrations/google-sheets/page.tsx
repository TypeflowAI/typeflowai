import { GoogleSheetWrapper } from "@/app/(app)/environments/[environmentId]/integrations/google-sheets/components/GoogleSheetWrapper";

import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import {
  GOOGLE_SHEETS_CLIENT_ID,
  GOOGLE_SHEETS_CLIENT_SECRET,
  GOOGLE_SHEETS_REDIRECT_URL,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationGoogleSheets } from "@typeflowai/types/integration/googleSheet";
import { GoBackButton } from "@typeflowai/ui/GoBackButton";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

const Page = async ({ params }) => {
  const isEnabled = !!(GOOGLE_SHEETS_CLIENT_ID && GOOGLE_SHEETS_CLIENT_SECRET && GOOGLE_SHEETS_REDIRECT_URL);
  const [workflows, integrations, environment, attributeClasses] = await Promise.all([
    getWorkflows(params.environmentId),
    getIntegrations(params.environmentId),
    getEnvironment(params.environmentId),
    getAttributeClasses(params.environmentId),
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

  return (
    <PageContentWrapper>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <PageHeader pageTitle="Google Sheets Integration" />
      <div className="h-[75vh] w-full">
        <GoogleSheetWrapper
          isEnabled={isEnabled}
          environment={environment}
          workflows={workflows}
          googleSheetIntegration={googleSheetIntegration}
          webAppUrl={WEBAPP_URL}
          attributeClasses={attributeClasses}
        />
      </div>
    </PageContentWrapper>
  );
};

export default Page;
