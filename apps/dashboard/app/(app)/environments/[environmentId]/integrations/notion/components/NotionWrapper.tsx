"use client";

import AddIntegrationModal from "@/app/(app)/environments/[environmentId]/integrations/notion/components/AddIntegrationModal";
import Connect from "@/app/(app)/environments/[environmentId]/integrations/notion/components/Connect";
import Home from "@/app/(app)/environments/[environmentId]/integrations/notion/components/Home";
import { useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import {
  TIntegrationNotion,
  TIntegrationNotionConfigData,
  TIntegrationNotionDatabase,
} from "@typeflowai/types/integration/notion";
import { TWorkflow } from "@typeflowai/types/workflows";

interface NotionWrapperProps {
  notionIntegration: TIntegrationNotion | undefined;
  enabled: boolean;
  environment: TEnvironment;
  webAppUrl: string;
  workflows: TWorkflow[];
  databasesArray: TIntegrationNotionDatabase[];
}

export default function NotionWrapper({
  notionIntegration,
  enabled,
  environment,
  webAppUrl,
  workflows,
  databasesArray,
}: NotionWrapperProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(
    notionIntegration ? notionIntegration.config.key?.bot_id : false
  );
  const [selectedIntegration, setSelectedIntegration] = useState<
    (TIntegrationNotionConfigData & { index: number }) | null
  >(null);

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
          />
          <Home
            environment={environment}
            notionIntegration={notionIntegration}
            setOpenAddIntegrationModal={setModalOpen}
            setIsConnected={setIsConnected}
            setSelectedIntegration={setSelectedIntegration}
          />
        </>
      ) : (
        <Connect enabled={enabled} environmentId={environment.id} webAppUrl={webAppUrl} />
      )}
    </>
  );
}
