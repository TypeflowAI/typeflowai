import NotionWrapper from "@/app/(app)/environments/[environmentId]/integrations/notion/components/NotionWrapper";

import {
  NOTION_AUTH_URL,
  NOTION_OAUTH_CLIENT_ID,
  NOTION_OAUTH_CLIENT_SECRET,
  NOTION_REDIRECT_URI,
  WEBAPP_URL,
} from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrationByType } from "@typeflowai/lib/integration/service";
import { getNotionDatabases } from "@typeflowai/lib/notion/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationNotion, TIntegrationNotionDatabase } from "@typeflowai/types/integration/notion";
import GoBackButton from "@typeflowai/ui/GoBackButton";

export default async function Notion({ params }) {
  const enabled = !!(
    NOTION_OAUTH_CLIENT_ID &&
    NOTION_OAUTH_CLIENT_SECRET &&
    NOTION_AUTH_URL &&
    NOTION_REDIRECT_URI
  );
  const [workflows, notionIntegration, environment] = await Promise.all([
    getWorkflows(params.environmentId),
    getIntegrationByType(params.environmentId, "notion"),
    getEnvironment(params.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }

  let databasesArray: TIntegrationNotionDatabase[] = [];
  if (notionIntegration && (notionIntegration as TIntegrationNotion).config.key?.bot_id) {
    databasesArray = await getNotionDatabases(environment.id);
  }

  return (
    <>
      <GoBackButton url={`${WEBAPP_URL}/environments/${params.environmentId}/integrations`} />
      <NotionWrapper
        enabled={enabled}
        workflows={workflows}
        environment={environment}
        notionIntegration={notionIntegration as TIntegrationNotion}
        webAppUrl={WEBAPP_URL}
        databasesArray={databasesArray}
      />
    </>
  );
}
