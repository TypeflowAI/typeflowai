"use client";

import { useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TIntegrationItem } from "@typeflowai/types/integration";
import { TIntegrationAirtable } from "@typeflowai/types/integration/airtable";
import { TWorkflow } from "@typeflowai/types/workflows";

import Connect from "./Connect";
import Home from "./Home";

interface AirtableWrapperProps {
  environmentId: string;
  airtableArray: TIntegrationItem[];
  airtableIntegration?: TIntegrationAirtable;
  workflows: TWorkflow[];
  environment: TEnvironment;
  enabled: boolean;
  webAppUrl: string;
}

export default function AirtableWrapper({
  environmentId,
  airtableArray,
  airtableIntegration,
  workflows,
  environment,
  enabled,
  webAppUrl,
}: AirtableWrapperProps) {
  const [isConnected, setIsConnected_] = useState(
    airtableIntegration ? airtableIntegration.config?.key : false
  );

  const setIsConnected = (data: boolean) => {
    setIsConnected_(data);
  };

  return isConnected && airtableIntegration ? (
    <Home
      airtableArray={airtableArray}
      environmentId={environmentId}
      environment={environment}
      airtableIntegration={airtableIntegration}
      setIsConnected={setIsConnected}
      workflows={workflows}
    />
  ) : (
    <Connect enabled={enabled} environmentId={environment.id} webAppUrl={webAppUrl} />
  );
}
