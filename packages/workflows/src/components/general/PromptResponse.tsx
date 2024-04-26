import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { processPromptMessage } from "@/lib/parsePrompt";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useEffect, useState } from "react";

import { TypeflowAIAPI } from "@typeflowai/api";
import { TResponseTtc } from "@typeflowai/types/responses";
import { TResponseData } from "@typeflowai/types/responses";
import { TWorkflowPrompt } from "@typeflowai/types/workflows";

import CopyPromptButton from "../buttons/CopyPromptButton";
import StartOverButton from "../buttons/StartOverButton";
import TestPromptButton from "../buttons/TestPromptButton";
import LoadingSpinner from "./LoadingSpinner";
import PromptMarkdownResponse from "./PromptMarkdownResponse";

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
  isPreview?: boolean;
}

export default function PromptResponse({
  prompt,
  workflowResponses,
  webAppUrl,
  environmentId,
  onChange,
  onBack,
  onSubmit,
  ttc,
  setTtc,
  isPreview,
}: PromptResponseProps) {
  const [startTime, setStartTime] = useState(performance.now());
  useTtc(prompt.id, ttc, setTtc, startTime, setStartTime);
  const [openAIResponse, setOpenAIResponse] = useState("");
  const [displayResponse, setDisplayResponse] = useState("");
  const [textBuffer, setTextBuffer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [restartAIResponse, setRestartAIResponse] = useState(0);
  const [isResponseComplete, setIsResponseComplete] = useState(false);
  const [copyButtonLabel, setCopyButtonLabel] = useState("Copy");
  const [isTestPromptClicked, setIsTestPromptClicked] = useState(false);
  const [isAILimitReached, setIsAILimitReached] = useState(false);
  const [isOpenAIIssue, setIsOpenAIIssue] = useState(false);

  const typeflowaiAPI = new TypeflowAIAPI({
    apiHost: webAppUrl,
    environmentId: environmentId,
  });

  const fetchOpenAIResponse = async () => {
    if (!prompt.message || (isPreview && !isTestPromptClicked)) return;
    const existingResponse = workflowResponses[prompt.id];
    if (restartAIResponse > 0 || !existingResponse) {
      setIsOpenAIIssue(false);
      setIsAILimitReached(false);
      setIsLoading(true);

      const promptMessage = processPromptMessage(prompt.message, prompt.attributes, workflowResponses);
      console.log("promptMessage: ", promptMessage);

      const requestData = {
        messages: [
          {
            role: "system",
            content: promptMessage,
          },
        ],
        model: prompt.engine,
        stream: true,
      };

      let isFirstChunkProcessed = false;

      try {
        const response = await typeflowaiAPI.client.openai.sendStreamingMessage(requestData);
        if (response.ok) {
          console.log("API response:", response);
          const decoder = new TextDecoder();
          if (response.body) {
            const reader = response.body.getReader();

            reader.read().then(function processText({ done, value }) {
              if (done) {
                setIsLoading(false);
                return;
              }
              const chunk = decoder.decode(value, { stream: true });

              if (!isFirstChunkProcessed) {
                try {
                  const data = JSON.parse(chunk);
                  if (data.limitReached) {
                    setIsAILimitReached(true);
                    setIsLoading(false);
                    return;
                  }
                } catch (e) {}
                isFirstChunkProcessed = true;
              }
              setTextBuffer((prevBuffer) => prevBuffer + chunk);
              reader.read().then(processText);
            });
          } else {
            console.error("Error: Body response is not a ReadableStream.");
          }
        } else {
          console.error("Error in API response");
        }
      } catch (error) {
        setIsOpenAIIssue(true);
        console.error("Error calling OpenAI API:", error);
      } finally {
        if (!isFirstChunkProcessed) {
          setIsLoading(false);
        }
      }
    } else if (typeof existingResponse === "string") {
      setOpenAIResponse(existingResponse);
      setDisplayResponse(existingResponse);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPreview || isTestPromptClicked) {
      fetchOpenAIResponse();
    }
  }, [restartAIResponse, isPreview, isTestPromptClicked]);

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const updatedTtcObj = getUpdatedTtc(ttc, prompt.id, performance.now() - startTime);
        setTtc(updatedTtcObj);
        onSubmit({ [prompt.id]: openAIResponse }, updatedTtcObj);
      }}
      className="w-full">
      <div className="w-full text-left">
        <div>
          {prompt.description && (
            <label
              htmlFor={prompt.description}
              className="text-heading mb-1.5 block text-base font-semibold leading-6">
              <div className="flex">{prompt.description}</div>
            </label>
          )}
          <div className="mb-3 mt-4 flex w-full justify-between">
            <label
              htmlFor="openai-response"
              className="text-heading mb-1.5 block text-base font-semibold leading-6">
              <div className="flex">AI Response</div>
            </label>
            {isResponseComplete && (
              <CopyPromptButton
                title="Copy AI response to clipboard"
                copyButtonLabel={copyButtonLabel}
                ariaLabel="Copy AI response to clipboard"
                onClick={handleCopyClick}
              />
            )}
          </div>
          <div
            className={`border-d min-h-10 rounded-md border border shadow-sm ${
              isPreview && !isTestPromptClicked ? "p-2" : ""
            }`}>
            {isPreview && !isTestPromptClicked ? (
              <TestPromptButton label="Test Prompt" onClick={() => setIsTestPromptClicked(true)} />
            ) : isLoading ? (
              <div className="flex p-2 text-sm">
                <LoadingSpinner />
                <p className="my-auto">Generating response...</p>
              </div>
            ) : (
              <div className="p-2 text-sm font-normal leading-6">
                {isAILimitReached ? (
                  <p>AI response limit reached. Please upgrade your plan to get more AI responses.</p>
                ) : isOpenAIIssue ? (
                  <p>There has been a problem calling OpenAI. Review your config.</p>
                ) : (
                  <PromptMarkdownResponse content={displayResponse} />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex w-full justify-between">
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
      </div>
    </form>
  );
}
