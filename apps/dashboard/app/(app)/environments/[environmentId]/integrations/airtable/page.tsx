import AirtableWrapper from "@/app/(app)/environments/[environmentId]/integrations/airtable/components/AirtableWrapper";

import { getAirtableTables } from "@typeflowai/lib/airtable/service";
import { AIRTABLE_CLIENT_ID, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrations } from "@typeflowai/lib/integration/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";
import GoBackButton from "@typeflowai/ui/GoBackButton";

export default async function Airtable({ params }) {
  const enabled = !!AIRTABLE_CLIENT_ID;
  const [workflows, integrations, environment] = await Promise.all([
    getWorkflows(params.environmentId),
    getIntegrations(params.environmentId),
    getEnvironment(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }

  const airtableIntegration: TIntegrationAirtable | undefined = integrations?.find(
    (integration): integration is TIntegrationAirtable => integration.type === "airtable"
  );

  let airtableArray: TIntegrationItem[] = [];
  if (airtableIntegration && airtableIntegration.config.key) {
    airtableArray = await getAirtableTables(params.environmentId);
  }

  return (
    <>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <div className="h-[75vh] w-full">
        <AirtableWrapper
          enabled={enabled}
          airtableIntegration={airtableIntegration}
          airtableArray={airtableArray}
          environmentId={environment.id}
          workflows={workflows}
          environment={environment}
          webAppUrl={WEBAPP_URL}
        />
      </div>
    </>
  );
}
