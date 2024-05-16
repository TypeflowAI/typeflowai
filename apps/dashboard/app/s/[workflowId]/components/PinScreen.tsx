"use client";

import { validateWorkflowPinAction } from "@/app/s/[workflowId]/actions";
import LegalFooter from "@/app/s/[workflowId]/components/LegalFooter";
import LinkWorkflow from "@/app/s/[workflowId]/components/LinkWorkflow";
import { MediaBackground } from "@/app/s/[workflowId]/components/MediaBackground";
import { TWorkflowPinValidationResponseError } from "@/app/s/[workflowId]/types";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TProduct } from "@typeflowai/types/product";
import { TResponse } from "@typeflowai/types/responses";
import { TWorkflow } from "@typeflowai/types/workflows";
import { OTPInput } from "@typeflowai/ui/OTPInput";

interface LinkWorkflowPinScreenProps {
  workflowId: string;
  product: TProduct;
  userId?: string;
  emailVerificationStatus?: string;
  singleUseId?: string;
  singleUseResponse?: TResponse;
  webAppUrl: string;
  IMPRINT_URL?: string;
  PRIVACY_URL?: string;
  IS_TYPEFLOWAI_CLOUD: boolean;
  verifiedEmail?: string;
  languageCode: string;
}

const LinkWorkflowPinScreen: NextPage<LinkWorkflowPinScreenProps> = (props) => {
  const {
    workflowId,
    product,
    webAppUrl,
    emailVerificationStatus,
    userId,
    singleUseId,
    singleUseResponse,
    IMPRINT_URL,
    PRIVACY_URL,
    IS_TYPEFLOWAI_CLOUD,
    verifiedEmail,
    languageCode,
  } = props;

  const [localPinEntry, setLocalPinEntry] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<TWorkflowPinValidationResponseError>();
  const [workflow, setWorkflow] = useState<TWorkflow>();

  const _validateWorkflowPinAsync = useCallback(async (workflowId: string, pin: string) => {
    const response = await validateWorkflowPinAction(workflowId, pin);
    if (response.error) {
      setError(response.error);
    } else if (response.workflow) {
      setWorkflow(response.workflow);
    }
    setLoading(false);
  }, []);

  const resetState = useCallback(() => {
    setError(undefined);
    setLoading(false);
    setLocalPinEntry("");
  }, []);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => resetState(), 2 * 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [error, resetState]);

  useEffect(() => {
    const validPinRegex = /^\d{4}$/;
    const isValidPin = validPinRegex.test(localPinEntry);

    if (isValidPin) {
      // Show loading and check against the server
      setLoading(true);
      _validateWorkflowPinAsync(workflowId, localPinEntry);
      return;
    }

    setError(undefined);
    setLoading(false);
  }, [_validateWorkflowPinAsync, localPinEntry, workflowId]);

  if (!workflow) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="my-4 font-semibold">
            <h4>This workflow is protected. Enter the PIN below</h4>
          </div>
          <OTPInput
            disabled={Boolean(error) || loading}
            value={localPinEntry}
            onChange={(value) => setLocalPinEntry(value)}
            valueLength={4}
            inputBoxClassName={cn({ "border-red-400": Boolean(error) })}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MediaBackground workflow={workflow} product={product}>
        <LinkWorkflow
          workflow={workflow}
          product={product}
          userId={userId}
          emailVerificationStatus={emailVerificationStatus}
          singleUseId={singleUseId}
          singleUseResponse={singleUseResponse}
          webAppUrl={webAppUrl}
          verifiedEmail={verifiedEmail}
          languageCode={languageCode}
        />
      </MediaBackground>
      <LegalFooter
        IMPRINT_URL={IMPRINT_URL}
        PRIVACY_URL={PRIVACY_URL}
        IS_TYPEFLOWAI_CLOUD={IS_TYPEFLOWAI_CLOUD}
        workflowUrl={webAppUrl + "/s/" + workflow.id}
      />
    </div>
  );
};

export default LinkWorkflowPinScreen;
