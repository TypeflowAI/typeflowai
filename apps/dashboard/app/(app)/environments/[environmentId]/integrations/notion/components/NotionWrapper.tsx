"use client";

import { AddIntegrationModal } from "@/app/(app)/environments/[environmentId]/integrations/notion/components/AddIntegrationModal";
import { ManageIntegration } from "@/app/(app)/environments/[environmentId]/integrations/notion/components/ManageIntegration";
import notionLogo from "@/images/notion.png";
import { useState } from "react";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import {
  TIntegrationNotion,
  TIntegrationNotionConfigData,
  TIntegrationNotionDatabase,
} from "@typeflowai/types/integration/notion";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ConnectIntegration } from "@typeflowai/ui/ConnectIntegration";

import { authorize } from "../lib/notion";

interface NotionWrapperProps {
  notionIntegration: TIntegrationNotion | undefined;
  enabled: boolean;
  environment: TEnvironment;
  webAppUrl: string;
  workflows: TWorkflow[];
  databasesArray: TIntegrationNotionDatabase[];
  attributeClasses: TAttributeClass[];
}

export const NotionWrapper = ({
  notionIntegration,
  enabled,
  environment,
  webAppUrl,
  workflows,
  databasesArray,
  attributeClasses,
}: NotionWrapperProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(
    notionIntegration ? notionIntegration.config.key?.bot_id : false
  );
  const [selectedIntegration, setSelectedIntegration] = useState<
    (TIntegrationNotionConfigData & { index: number }) | null
  >(null);

  const handleNotionAuthorization = async () => {
    authorize(environment.id, webAppUrl).then((url: string) => {
      if (url) {
        window.location.replace(url);
      }
    });
  };

  return (
    <>
      {isConnected && notionIntegration ? (
        <>
          <AddIntegrationModal
            environmentId={environment.id}
            workflows={workflows}
            open={isModalOpen}
            setOpen={setModalOpen}
            notionIntegration={notionIntegration}
            databases={databasesArray}
            selectedIntegration={selectedIntegration}
            attributeClasses={attributeClasses}
          />
          <ManageIntegration
            environment={environment}
            notionIntegration={notionIntegration}
            setOpenAddIntegrationModal={setModalOpen}
            setIsConnected={setIsConnected}
            setSelectedIntegration={setSelectedIntegration}
          />
        </>
      ) : (
        <ConnectIntegration
          isEnabled={enabled}
          integrationType={"notion"}
          handleAuthorization={handleNotionAuthorization}
          integrationLogoSrc={notionLogo}
        />
      )}
    </>
  );
};
