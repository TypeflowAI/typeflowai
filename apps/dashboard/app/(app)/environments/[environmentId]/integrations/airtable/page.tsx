import { AirtableWrapper } from "@/app/(app)/environments/[environmentId]/integrations/airtable/components/AirtableWrapper";

import { getAirtableTables } from "@typeflowai/lib/airtable/service";
import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { AIRTABLE_CLIENT_ID, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";
import { GoBackButton } from "@typeflowai/ui/GoBackButton";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

const Page = async ({ params }) => {
  const isEnabled = !!AIRTABLE_CLIENT_ID;
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

  const airtableIntegration: TIntegrationAirtable | undefined = integrations?.find(
    (integration): integration is TIntegrationAirtable => integration.type === "airtable"
  );

  let airtableArray: TIntegrationItem[] = [];
  if (airtableIntegration && airtableIntegration.config.key) {
    airtableArray = await getAirtableTables(params.environmentId);
  }

  return (
    <PageContentWrapper>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <PageHeader pageTitle="Airtable Integration" />
      <div className="h-[75vh] w-full">
        <AirtableWrapper
          isEnabled={isEnabled}
          airtableIntegration={airtableIntegration}
          airtableArray={airtableArray}
          environmentId={environment.id}
          workflows={workflows}
          environment={environment}
          webAppUrl={WEBAPP_URL}
          attributeClasses={attributeClasses}
        />
      </div>
    </PageContentWrapper>
  );
};

export default Page;
