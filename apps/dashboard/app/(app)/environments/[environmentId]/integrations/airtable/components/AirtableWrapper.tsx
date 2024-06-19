"use client";

import { ManageIntegration } from "@/app/(app)/environments/[environmentId]/integrations/airtable/components/ManageIntegration";
import { authorize } from "@/app/(app)/environments/[environmentId]/integrations/airtable/lib/airtable";
import airtableLogo from "@/images/airtableLogo.svg";
import { useState } from "react";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ConnectIntegration } from "@typeflowai/ui/ConnectIntegration";

interface AirtableWrapperProps {
  environmentId: string;
  airtableArray: TIntegrationItem[];
  airtableIntegration?: TIntegrationAirtable;
  workflows: TWorkflow[];
  environment: TEnvironment;
  isEnabled: boolean;
  webAppUrl: string;
  attributeClasses: TAttributeClass[];
}

export const AirtableWrapper = ({
  environmentId,
  airtableArray,
  airtableIntegration,
  workflows,
  environment,
  isEnabled,
  webAppUrl,
  attributeClasses,
}: AirtableWrapperProps) => {
  const [isConnected, setIsConnected] = useState(
    airtableIntegration ? airtableIntegration.config?.key : false
  );

  const handleAirtableAuthorization = async () => {
    authorize(environmentId, webAppUrl).then((url: string) => {
      if (url) {
        window.location.replace(url);
      }
    });
  };

  return isConnected && airtableIntegration ? (
    <ManageIntegration
      airtableArray={airtableArray}
      environmentId={environmentId}
      environment={environment}
      airtableIntegration={airtableIntegration}
      setIsConnected={setIsConnected}
      workflows={workflows}
      attributeClasses={attributeClasses}
    />
  ) : (
    <ConnectIntegration
      isEnabled={isEnabled}
      integrationType={"airtable"}
      handleAuthorization={handleAirtableAuthorization}
      integrationLogoSrc={airtableLogo}
    />
  );
};
