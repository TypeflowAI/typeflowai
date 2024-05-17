"use client";

import { VerifyEmail } from "@/app/s/[workflowId]/components/VerifyEmail";
import WorkflowLinkUsed from "@/app/s/[workflowId]/components/WorkflowLinkUsed";
import { getPrefillValue } from "@/app/s/[workflowId]/lib/prefilling";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TypeflowAIAPI } from "@typeflowai/api";
import { ResponseQueue } from "@typeflowai/lib/responseQueue";
import { WorkflowState } from "@typeflowai/lib/workflowState";
import { TProduct } from "@typeflowai/types/product";
import { TResponse, TResponseUpdate } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ClientLogo } from "@typeflowai/ui/ClientLogo";
import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";
import { ResetProgressButton } from "@typeflowai/ui/ResetProgressButton";
import { WorkflowInline } from "@typeflowai/ui/Workflow";

let setIsError = (_: boolean) => {};
let setIsResponseSendingFinished = (_: boolean) => {};
let setQuestionId = (_: string) => {};

interface LinkWorkflowProps {
  workflow: TWorkflow;
  product: TProduct;
  userId?: string;
  emailVerificationStatus?: string;
  singleUseId?: string;
  singleUseResponse?: TResponse;
  webAppUrl: string;
  responseCount?: number;
  verifiedEmail?: string;
  languageCode: string;
}

export default function LinkWorkflow({
  workflow,
  product,
  userId,
  emailVerificationStatus,
  singleUseId,
  singleUseResponse,
  webAppUrl,
  responseCount,
  verifiedEmail,
  languageCode,
}: LinkWorkflowProps) {
  const responseId = singleUseResponse?.id;
  const searchParams = useSearchParams();
  const isPreview = searchParams?.get("preview") === "true";
  const sourceParam = searchParams?.get("source");
  const suId = searchParams?.get("suId");
  const defaultLanguageCode = workflow.languages?.find((workflowLanguage) => {
    return workflowLanguage.default === true;
  })?.language.code;

  const startAt = searchParams?.get("startAt");
  const isStartAtValid = useMemo(() => {
    if (!startAt) return false;
    if (workflow?.welcomeCard.enabled && startAt === "start") return true;

    const isValid = workflow?.questions.some((question) => question.id === startAt);

    // To remove startAt query param from URL if it is not valid:
    if (!isValid && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("startAt");
      window.history.replaceState({}, "", url.toString());
    }

    return isValid;
  }, [workflow, startAt]);

  // pass in the responseId if the workflow is a single use workflow, ensures workflow state is updated with the responseId
  let workflowState = useMemo(() => {
    return new WorkflowState(workflow.id, singleUseId, responseId, userId);
  }, [workflow.id, singleUseId, responseId, userId]);

  const prefillValue = getPrefillValue(workflow, searchParams, languageCode);

  const responseQueue = useMemo(
    () =>
      new ResponseQueue(
        {
          apiHost: webAppUrl,
          environmentId: workflow.environmentId,
          retryAttempts: 2,
          onResponseSendingFailed: () => {
            setIsError(true);
          },
          onResponseSendingFinished: () => {
            // when response of current question is processed successfully
            setIsResponseSendingFinished(true);
          },
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
    // For safari on mobile devices, scroll is a bit off due to dynamic height of address bar, so on inital load, we scroll to the bottom
    // window.scrollTo({
    //   top: document.body.scrollHeight,
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getVerifiedEmail = useMemo<Record<string, string> | null>(() => {
    if (workflow.verifyEmail && verifiedEmail) {
      return { verifiedEmail: verifiedEmail };
    } else {
      return null;
    }
  }, [workflow.verifyEmail, verifiedEmail]);

  useEffect(() => {
    responseQueue.updateWorkflowState(workflowState);
  }, [responseQueue, workflowState]);

  if (!workflowState.isResponseFinished() && hasFinishedSingleUseResponse) {
    return <WorkflowLinkUsed singleUseMessage={workflow.singleUse} />;
  }

  if (workflow.verifyEmail && emailVerificationStatus !== "verified") {
    if (emailVerificationStatus === "fishy") {
      return (
        <VerifyEmail
          workflow={workflow}
          isErrorComponent={true}
          languageCode={languageCode}
          styling={product.styling}
        />
      );
    }
    //emailVerificationStatus === "not-verified"
    return (
      <VerifyEmail
        singleUseId={suId ?? ""}
        workflow={workflow}
        languageCode={languageCode}
        styling={product.styling}
      />
    );
  }

  const determineStyling = () => {
    // allow style overwrite is disabled from the product
    if (!product.styling.allowStyleOverwrite) {
      return product.styling;
    }

    // allow style overwrite is enabled from the product
    if (product.styling.allowStyleOverwrite) {
      // workflow style overwrite is disabled
      if (!workflow.styling?.overwriteThemeStyling) {
        return product.styling;
      }

      // workflow style overwrite is enabled
      return workflow.styling;
    }

    return product.styling;
  };

  return (
    <div className="flex max-h-dvh min-h-dvh items-end justify-center overflow-clip md:items-center">
      {!determineStyling().isLogoHidden && product.logo?.url && <ClientLogo product={product} />}
      <ContentWrapper className="w-full p-0 md:max-w-md">
        {isPreview && (
          <div className="fixed left-0 top-0 flex w-full items-center justify-between bg-slate-600 p-2 px-4 text-center text-sm text-white shadow-sm">
            <div />
            Workflow Preview 👀
            <ResetProgressButton
              onClick={() =>
                setQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id)
              }
            />
          </div>
        )}
        <WorkflowInline
          workflow={workflow}
          webAppUrl={webAppUrl}
          styling={determineStyling()}
          languageCode={languageCode}
          isBrandingEnabled={product.linkWorkflowBranding}
          getSetIsError={(f: (value: boolean) => void) => {
            setIsError = f;
          }}
          getSetIsResponseSendingFinished={
            !isPreview
              ? (f: (value: boolean) => void) => {
                  setIsResponseSendingFinished = f;
                }
              : undefined
          }
          onRetry={() => {
            setIsError(false);
            responseQueue.processQueue();
          }}
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

              workflowState.updateDisplayId(id);
              responseQueue.updateWorkflowState(workflowState);
            }
          }}
          onResponse={(responseUpdate: TResponseUpdate) => {
            !isPreview &&
              responseQueue.add({
                data: {
                  ...responseUpdate.data,
                  ...hiddenFieldsRecord,
                  ...getVerifiedEmail,
                },
                ttc: responseUpdate.ttc,
                finished: responseUpdate.finished,
                language:
                  languageCode === "default" && defaultLanguageCode ? defaultLanguageCode : languageCode,
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

            const uploadedUrl = await api.client.storage.uploadFile(file, params);
            return uploadedUrl;
          }}
          autoFocus={autoFocus}
          prefillResponseData={prefillValue}
          responseCount={responseCount}
          getSetQuestionId={(f: (value: string) => void) => {
            setQuestionId = f;
          }}
          startAtQuestionId={startAt && isStartAtValid ? startAt : undefined}
        />
      </ContentWrapper>
    </div>
  );
}
