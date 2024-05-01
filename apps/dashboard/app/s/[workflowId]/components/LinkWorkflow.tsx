"use client";

import VerifyEmail from "@/app/s/[workflowId]/components/VerifyEmail";
import WorkflowLinkUsed from "@/app/s/[workflowId]/components/WorkflowLinkUsed";
import { getPrefillResponseData } from "@/app/s/[workflowId]/lib/prefilling";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TypeflowAIAPI } from "@typeflowai/api";
import { ResponseQueue } from "@typeflowai/lib/responseQueue";
import { WorkflowState } from "@typeflowai/lib/workflowState";
import { TProduct } from "@typeflowai/types/product";
import { TResponse, TResponseData, TResponseUpdate } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow } from "@typeflowai/types/workflows";
import ContentWrapper from "@typeflowai/ui/ContentWrapper";
import { WorkflowInline } from "@typeflowai/ui/Workflow";

interface LinkWorkflowProps {
  workflow: TWorkflow;
  product: TProduct;
  userId?: string;
  emailVerificationStatus?: string;
  prefillAnswer?: string;
  singleUseId?: string;
  singleUseResponse?: TResponse;
  webAppUrl: string;
  responseCount?: number;
}

export default function LinkWorkflow({
  workflow,
  product,
  userId,
  emailVerificationStatus,
  prefillAnswer,
  singleUseId,
  singleUseResponse,
  webAppUrl,
  responseCount,
}: LinkWorkflowProps) {
  const responseId = singleUseResponse?.id;
  const searchParams = useSearchParams();
  const isPreview = searchParams?.get("preview") === "true";
  const sourceParam = searchParams?.get("source");
  // pass in the responseId if the workflow is a single use workflow, ensures workflow state is updated with the responseId
  const [workflowState, setWorkflowState] = useState(
    new WorkflowState(workflow.id, singleUseId, responseId, userId)
  );
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id
  );
  const prefillResponseData: TResponseData | undefined = prefillAnswer
    ? getPrefillResponseData(workflow.questions[0], workflow, prefillAnswer)
    : undefined;

  const brandColor = workflow.productOverwrites?.brandColor || product.brandColor;

  const responseQueue = useMemo(
    () =>
      new ResponseQueue(
        {
          apiHost: webAppUrl,
          environmentId: workflow.environmentId,
          retryAttempts: 2,
          onResponseSendingFailed: (response) => {
            alert(`Failed to send response: ${JSON.stringify(response, null, 2)}`);
          },
          setWorkflowState: setWorkflowState,
        },
        workflowState
      ),
    [webAppUrl, workflow.environmentId, workflowState]
  );
  const [autoFocus, setAutofocus] = useState(false);
  const hasFinishedSingleUseResponse = useMemo(() => {
    if (singleUseResponse && singleUseResponse.finished) {
      return true;
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Not in an iframe, enable autofocus on input fields.
  useEffect(() => {
    if (window.self === window.top) {
      setAutofocus(true);
    }
  }, []);

  const hiddenFieldsRecord = useMemo<Record<string, string | number | string[]> | null>(() => {
    const fieldsRecord: Record<string, string | number | string[]> = {};
    let fieldsSet = false;

    workflow.hiddenFields?.fieldIds?.forEach((field) => {
      const answer = searchParams?.get(field);
      if (answer) {
        fieldsRecord[field] = answer;
        fieldsSet = true;
      }
    });

    // Only return the record if at least one field was set.
    return fieldsSet ? fieldsRecord : null;
  }, [searchParams, workflow.hiddenFields?.fieldIds]);

  useEffect(() => {
    responseQueue.updateWorkflowState(workflowState);
  }, [responseQueue, workflowState]);

  if (!workflowState.isResponseFinished() && hasFinishedSingleUseResponse) {
    return <WorkflowLinkUsed singleUseMessage={workflow.singleUse} />;
  }
  if (workflow.verifyEmail && emailVerificationStatus !== "verified") {
    if (emailVerificationStatus === "fishy") {
      return <VerifyEmail workflow={workflow} isErrorComponent={true} />;
    }
    //emailVerificationStatus === "not-verified"
    return <VerifyEmail workflow={workflow} />;
  }

  return (
    <>
      <ContentWrapper className="h-full w-full p-0 md:max-w-xl">
        {isPreview && (
          <div className="fixed left-0 top-0 flex w-full items-center justify-between bg-slate-600 p-2 px-4 text-center text-sm text-white shadow-sm">
            <div />
            Workflow Preview 👀
            <button
              className="flex items-center rounded-full bg-slate-500 px-3 py-1 hover:bg-slate-400"
              onClick={() =>
                setActiveQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id)
              }>
              Restart <ArrowPathIcon className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
        <WorkflowInline
          workflow={workflow}
          webAppUrl={webAppUrl}
          brandColor={brandColor}
          isBrandingEnabled={product.linkWorkflowBranding}
          onDisplay={async () => {
            if (!isPreview) {
              const api = new TypeflowAIAPI({
                apiHost: webAppUrl,
                environmentId: workflow.environmentId,
              });
              const res = await api.client.display.create({
                workflowId: workflow.id,
              });
              if (!res.ok) {
                throw new Error("Could not create display");
              }
              const { id } = res.data;

              const newWorkflowState = workflowState.copy();
              newWorkflowState.updateDisplayId(id);
              setWorkflowState(newWorkflowState);
            }
          }}
          onResponse={(responseUpdate: TResponseUpdate) => {
            !isPreview &&
              responseQueue.add({
                data: {
                  ...responseUpdate.data,
                  ...hiddenFieldsRecord,
                },
                ttc: responseUpdate.ttc,
                finished: responseUpdate.finished,
                meta: {
                  url: window.location.href,
                  source: sourceParam || "",
                },
              });
          }}
          onFileUpload={async (file: File, params: TUploadFileConfig) => {
            const api = new TypeflowAIAPI({
              apiHost: webAppUrl,
              environmentId: workflow.environmentId,
            });

            try {
              const uploadedUrl = await api.client.storage.uploadFile(file, params);
              return uploadedUrl;
            } catch (err) {
              console.error(err);
              return "";
            }
          }}
          onActiveQuestionChange={(questionId) => setActiveQuestionId(questionId)}
          activeQuestionId={activeQuestionId}
          autoFocus={autoFocus}
          prefillResponseData={prefillResponseData}
          responseCount={responseCount}
        />
      </ContentWrapper>
    </>
  );
}
