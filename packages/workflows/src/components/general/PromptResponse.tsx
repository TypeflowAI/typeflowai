import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { ScrollableContainer } from "@/components/wrappers/ScrollableContainer";
import { fetchOpenAIResponse } from "@/lib/fetchOpenAIResponse";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useCallback, useEffect, useState } from "react";
import { TResponseTtc } from "@typeflowai/types/responses";
import { TResponseData } from "@typeflowai/types/responses";
import { TWorkflowPrompt } from "@typeflowai/types/workflows";
import CopyPromptButton from "../buttons/CopyPromptButton";
import StartOverButton from "../buttons/StartOverButton";
import { LoadingSpinner } from "./LoadingSpinner";
import PromptMarkdownResponse from "./PromptMarkdownResponse";

// Force the page to be dynamic and allow streaming responses up to 180 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 180;

interface PromptResponseProps {
  prompt: TWorkflowPrompt;
  webAppUrl: string;
  environmentId: string;
  workflowResponses: TResponseData;
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  isInIframe: boolean;
  isVisible: boolean;
  isStreaming: boolean;
  currentQuestionId: string;
}

export const PromptResponse = ({
  prompt,
  workflowResponses,
  webAppUrl,
  environmentId,
  onChange,
  onBack,
  onSubmit,
  ttc,
  setTtc,
  isInIframe,
  isVisible,
  isStreaming,
  currentQuestionId,
}: PromptResponseProps) => {
  const [startTime, setStartTime] = useState(performance.now());
  useTtc(prompt.id, ttc, setTtc, startTime, setStartTime, prompt.id === currentQuestionId);
  const [openAIResponse, setOpenAIResponse] = useState("");
  const [displayResponse, setDisplayResponse] = useState("");
  const [textBuffer, setTextBuffer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [restartAIResponse, setRestartAIResponse] = useState(0);
  const [isResponseComplete, setIsResponseComplete] = useState(false);
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copy");
  const [isAILimitReached, setIsAILimitReached] = useState(false);
  const [isOpenAIIssue, setIsOpenAIIssue] = useState(false);

  const fetchResponse = async () => {
    setIsLoading(true);
    await fetchOpenAIResponse({
      prompt,
      webAppUrl,
      environmentId,
      workflowResponses,
      ttc,
      setTtc,
      onSubmit,
      isVisible,
      isStreaming,
      setTextBuffer: (update: (prevBuffer: string) => string) => setTextBuffer(update),
      setIsLoading,
      setIsAILimitReached,
      setIsOpenAIIssue,
      setOpenAIResponse,
      setDisplayResponse,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResponse();
  }, [restartAIResponse]);

  const startOver = () => {
    setOpenAIResponse("");
    setDisplayResponse("");
    setTextBuffer("");
    setRestartAIResponse((prev) => prev + 1);
  };

  useEffect(() => {
    if (textBuffer && textBuffer.length > displayResponse.length) {
      const timeoutId = setTimeout(() => {
        setDisplayResponse(textBuffer.substring(0, displayResponse.length + 1));
      }, 10);

      return () => clearTimeout(timeoutId);
    } else {
      if (displayResponse.length > 0) {
        setIsResponseComplete(true);
        setOpenAIResponse(displayResponse);
        onChange({ [prompt.id]: displayResponse });
      }
    }
  }, [textBuffer, displayResponse]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(displayResponse);
    setCopyButtonLabel("Copied!");
    setTimeout(() => setCopyButtonLabel("Copy"), 2000);
  };

  const promptResponseRef = useCallback(
    (currentElement: HTMLFormElement | null) => {
      if (prompt.id && currentElement && !isInIframe) {
        currentElement.focus();
      }
    },
    [prompt.id, isInIframe]
  );

  return (
    <form
      ref={promptResponseRef}
      key={prompt.id}
      onSubmit={(e) => {
        e.preventDefault();
        const updatedTtcObj = getUpdatedTtc(ttc, prompt.id, performance.now() - startTime);
        setTtc(updatedTtcObj);
        onSubmit({ [prompt.id]: openAIResponse }, updatedTtcObj);
      }}
      className="w-full">
      <ScrollableContainer>
        <div>
          <div className="mb-3 mt-4 flex w-full justify-between">
            {isResponseComplete && (
              <>
                {prompt.description ? (
                  <label
                    htmlFor="openai-response"
                    className="text-heading mb-1.5 block text-base font-semibold leading-6">
                    <div className="flex">{prompt.description}</div>
                  </label>
                ) : (
                  <div></div>
                )}
                <CopyPromptButton
                  title="Copy AI response to clipboard"
                  copyButtonLabel={copyButtonLabel}
                  ariaLabel="Copy AI response to clipboard"
                  onClick={handleCopyClick}
                />
              </>
            )}
          </div>
          <div>
            {/* <div> */}
            {isLoading ? (
              <div className="text-center">
                <div className="my-3 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
                <h1 className="text-brand">Generating response...</h1>
              </div>
            ) : (
              <div className="border-d min-h-10 rounded-md border border shadow-sm">
                <div className="p-2 text-sm font-normal leading-6">
                  {isAILimitReached ? (
                    <p>AI response limit reached. Please upgrade your plan to get more AI responses.</p>
                  ) : isOpenAIIssue ? (
                    <p>There has been a problem calling OpenAI. Review your config.</p>
                  ) : (
                    <PromptMarkdownResponse content={displayResponse} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollableContainer>
      <div className="flex w-full justify-between px-6 py-4">
        <BackButton
          backButtonLabel="Back"
          onClick={() => {
            const updatedttc = getUpdatedTtc(ttc, prompt.id, performance.now() - startTime);
            setTtc(updatedttc);
            onBack();
          }}
        />
        <div className="flex justify-end">
          {isResponseComplete && (
            <StartOverButton
              title="Start over"
              ariaLabel="Start over"
              onClick={() => {
                startOver();
              }}
              label="Start Over"
            />
          )}
          <SubmitButton
            buttonLabel="Finish"
            isLastQuestion={false}
            isPromptVisible={true}
            onClick={() => {}}
          />
        </div>
      </div>
    </form>
  );
};
