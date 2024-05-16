import SlackWrapper from "@/app/(app)/environments/[environmentId]/integrations/slack/components/SlackWrapper";

import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getIntegrationByType } from "@typeflowai/lib/integration/service";
import { getSlackChannels } from "@typeflowai/lib/slack/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationSlack } from "@typeflowai/types/integration/slack";
import GoBackButton from "@typeflowai/ui/GoBackButton";

export default async function Slack({ params }) {
  const isEnabled = !!(SLACK_CLIENT_ID && SLACK_CLIENT_SECRET);

  const [workflows, slackIntegration, environment] = await Promise.all([
    getWorkflows(params.environmentId),
    getIntegrationByType(params.environmentId, "slack"),
    getEnvironment(params.environmentId),
  ]);

  if (!environment) {
    throw new Error("Environment not found");
  }

  let channelsArray: TIntegrationItem[] = [];
  if (slackIntegration && slackIntegration.config.key) {
    channelsArray = await getSlackChannels(params.environmentId);
  }

  return (
    <>
      <GoBackButton url={`/environments/${params.environmentId}/integrations`} />
      <div className="h-[75vh] w-full">
        <SlackWrapper
          isEnabled={isEnabled}
          environment={environment}
          channelsArray={channelsArray}
          workflows={workflows}
          slackIntegration={slackIntegration as TIntegrationSlack}
          webAppUrl={WEBAPP_URL}
        />
      </div>
    </>
  );
}
