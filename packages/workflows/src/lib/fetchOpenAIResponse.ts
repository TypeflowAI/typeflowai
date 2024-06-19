import { TypeflowAIAPI } from "@typeflowai/api";
import { TOpenAIResponse } from "@typeflowai/types/openai";
import { TResponseData, TResponseTtc } from "@typeflowai/types/responses";
import { TWorkflowPrompt } from "@typeflowai/types/workflows";
import { processPromptMessage } from "./parsePrompt";
import { getUpdatedTtc } from "./ttc";

interface FetchOpenAIResponseProps {
  prompt: TWorkflowPrompt;
  webAppUrl: string;
  environmentId: string;
  workflowResponses: TResponseData;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  isVisible: boolean;
  isStreaming: boolean;
  setTextBuffer?: (update: (prevBuffer: string) => string) => void;
  setIsLoading?: (isLoading: boolean) => void;
  setIsAILimitReached?: (isLimitReached: boolean) => void;
  setIsOpenAIIssue?: (isIssue: boolean) => void;
  setOpenAIResponse?: (response: string) => void;
  setDisplayResponse?: (response: string) => void;
}

export const fetchOpenAIResponse = async ({
  prompt,
  webAppUrl,
  environmentId,
  workflowResponses,
  ttc,
  setTtc,
  onSubmit,
  isVisible,
  isStreaming,
  setTextBuffer,
  setIsLoading,
  setIsAILimitReached,
  setIsOpenAIIssue,
  setOpenAIResponse,
  setDisplayResponse,
}: FetchOpenAIResponseProps) => {
  if (!prompt.message) return;

  const promptMessage = processPromptMessage(prompt.message, prompt.attributes, workflowResponses);

  const requestData = {
    messages: [
      {
        role: "system",
        content: promptMessage,
      },
    ],
    model: prompt.engine,
    stream: isStreaming,
  };

  const typeflowaiAPI = new TypeflowAIAPI({
    apiHost: webAppUrl,
    environmentId: environmentId,
  });

  let isFirstChunkProcessed = false;

  try {
    console.log("Sending message to OpenAI API");
    console.log("isStreaming: ", isStreaming);
    if (isStreaming) {
      const response = await typeflowaiAPI.client.openai.sendStreamingMessage(requestData);
      if (response.ok) {
        const decoder = new TextDecoder();
        if (response.body) {
          const reader = response.body.getReader();

          reader.read().then(function processText({ done, value }) {
            if (done) {
              if (setIsLoading) setIsLoading(false);
              return;
            }
            const chunk = decoder.decode(value, { stream: true });

            if (!isFirstChunkProcessed) {
              try {
                const data = JSON.parse(chunk);
                if (data.limitReached) {
                  if (setIsAILimitReached) setIsAILimitReached(true);
                  if (setIsLoading) setIsLoading(false);
                  return;
                }
              } catch (e) {}
              isFirstChunkProcessed = true;
            }
            if (setTextBuffer) setTextBuffer((prevBuffer) => prevBuffer + chunk);
            reader.read().then(processText);
          });
        } else {
          console.error("Error: Body response is not a ReadableStream.");
        }
      } else {
        console.error("Error in API response");
      }
    } else {
      const response = await typeflowaiAPI.client.openai.sendMessage(requestData);
      if (response.ok) {
        const data = response.data as TOpenAIResponse;
        if ("limitReached" in data && data.limitReached) {
          console.log("Error: Limit reached");
          if (setIsAILimitReached) setIsAILimitReached(true);
          if (setIsLoading) setIsLoading(false);
          return;
        }
        const openAIResponse = response.data as TOpenAIResponse;
        if (openAIResponse.choices && openAIResponse.choices.length > 0) {
          const responseContent = openAIResponse.choices[0].message.content;
          if (isVisible) {
            if (setOpenAIResponse) setOpenAIResponse(responseContent);
            if (setDisplayResponse) setDisplayResponse(responseContent);
          } else {
            const updatedTtcObj = getUpdatedTtc(ttc, prompt.id, performance.now());
            setTtc(updatedTtcObj);
            const newResponseData = { ...workflowResponses, [prompt.id]: responseContent };
            onSubmit(newResponseData, updatedTtcObj);
          }
        } else {
          console.error("No choices available in the response");
        }
      } else {
        console.error("Error in API response:", response.error);
      }
    }
  } catch (error) {
    if (setIsOpenAIIssue) setIsOpenAIIssue(true);
    console.log("Error calling OpenAI API:", error);
    console.error("Error calling OpenAI API:", error);
  } finally {
    if (!isFirstChunkProcessed && setIsLoading) {
      setIsLoading(false);
    }
  }
};
