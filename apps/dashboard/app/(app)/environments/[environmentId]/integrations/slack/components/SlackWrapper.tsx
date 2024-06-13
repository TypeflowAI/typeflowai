"use client";

import { refreshChannelsAction } from "@/app/(app)/environments/[environmentId]/integrations/slack/actions";
import { AddChannelMappingModal } from "@/app/(app)/environments/[environmentId]/integrations/slack/components/AddChannelMappingModal";
import { ManageIntegration } from "@/app/(app)/environments/[environmentId]/integrations/slack/components/ManageIntegration";
import { authorize } from "@/app/(app)/environments/[environmentId]/integrations/slack/lib/slack";
import slackLogo from "@/images/slacklogo.png";
import { useState } from "react";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationSlack, TIntegrationSlackConfigData } from "@typeflowai/types/integration/slack";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ConnectIntegration } from "@typeflowai/ui/ConnectIntegration";

interface SlackWrapperProps {
  isEnabled: boolean;
  environment: TEnvironment;
  workflows: TWorkflow[];
  channelsArray: TIntegrationItem[];
  slackIntegration?: TIntegrationSlack;
  webAppUrl: string;
  attributeClasses: TAttributeClass[];
}

export const SlackWrapper = ({
  isEnabled,
  environment,
  workflows,
  channelsArray,
  slackIntegration,
  webAppUrl,
  attributeClasses,
}: SlackWrapperProps) => {
  const [isConnected, setIsConnected] = useState(slackIntegration ? slackIntegration.config?.key : false);
  const [slackChannels, setSlackChannels] = useState(channelsArray);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<
    (TIntegrationSlackConfigData & { index: number }) | null
  >(null);

  const refreshChannels = async () => {
    const latestSlackChannels = await refreshChannelsAction(environment.id);
    setSlackChannels(latestSlackChannels);
  };

  const handleSlackAuthorization = async () => {
    authorize(environment.id, webAppUrl).then((url: string) => {
      if (url) {
        window.location.replace(url);
      }
    });
  };

  return isConnected && slackIntegration ? (
    <>
      <AddChannelMappingModal
        environmentId={environment.id}
        workflows={workflows}
        open={isModalOpen}
        setOpen={setModalOpen}
        channels={slackChannels}
        slackIntegration={slackIntegration}
        selectedIntegration={selectedIntegration}
        attributeClasses={attributeClasses}
      />
      <ManageIntegration
        environment={environment}
        slackIntegration={slackIntegration}
        setOpenAddIntegrationModal={setModalOpen}
        setIsConnected={setIsConnected}
        setSelectedIntegration={setSelectedIntegration}
        refreshChannels={refreshChannels}
      />
    </>
  ) : (
    <ConnectIntegration
      isEnabled={isEnabled}
      integrationType={"slack"}
      handleAuthorization={handleSlackAuthorization}
      integrationLogoSrc={slackLogo}
    />
  );
};
