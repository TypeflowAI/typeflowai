import ProgressBar from "@/components/general/ProgressBar";
import TypeflowAIBranding from "@/components/general/TypeflowAIBranding";
import { AutoCloseWrapper } from "@/components/wrappers/AutoCloseWrapper";
import { evaluateCondition } from "@/lib/logicEvaluator";
import { processPromptMessage } from "@/lib/parsePrompt";
import { getUpdatedTtc } from "@/lib/ttc";
import { cn } from "@/lib/utils";
import { WorkflowBaseProps } from "@/types/props";
import { useEffect, useRef, useState } from "preact/hooks";

import { TypeflowAIAPI } from "@typeflowai/api";
import { TOpenAIResponse } from "@typeflowai/types/openai";
import type { TResponseData, TResponseTtc } from "@typeflowai/types/responses";

import ActivatePromptCard from "./ActivatePromptCard";
import PromptResponse from "./PromptResponse";
import QuestionConditional from "./QuestionConditional";
import SavingCard from "./SavingCard";
import ThankYouCard from "./ThankYouCard";
import WelcomeCard from "./WelcomeCard";

export function Workflow({
  workflow,
  webAppUrl,
  isBrandingEnabled,
  activeQuestionId,
  onDisplay = () => {},
  onActiveQuestionChange = () => {},
  onResponse = () => {},
  onClose = () => {},
  onFinished = () => {},
  isRedirectDisabled = false,
  prefillResponseData,
  onFileUpload,
  responseCount,
  isPreview,
}: WorkflowBaseProps) {
  const [questionId, setQuestionId] = useState(
    activeQuestionId || (workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id)
  );
  const [loadingElement, setLoadingElement] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [responseData, setResponseData] = useState<TResponseData>({});
  const currentQuestionIndex = workflow.questions.findIndex((q) => q.id === questionId);
  const currentQuestion = workflow.questions[currentQuestionIndex];
  const contentRef = useRef<HTMLDivElement | null>(null);
  const showProgressBar = !workflow.styling?.hideProgressBar;
  const [ttc, setTtc] = useState<TResponseTtc>({});
  const typeflowaiAPI = new TypeflowAIAPI({
    apiHost: webAppUrl,
    environmentId: workflow.environmentId,
  });
  useEffect(() => {
    if (activeQuestionId === "hidden") return;
    if (activeQuestionId === "start" && !workflow.welcomeCard.enabled) {
      setQuestionId(workflow?.questions[0]?.id);
      return;
    }
    setQuestionId(activeQuestionId || (workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id));
  }, [activeQuestionId, workflow.questions, workflow.welcomeCard.enabled]);

  useEffect(() => {
    // scroll to top when question changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [questionId]);

  useEffect(() => {
    // call onDisplay when component is mounted
    onDisplay();
    if (prefillResponseData) {
      onSubmit(prefillResponseData, {}, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let currIdx = currentQuestionIndex;
  let currQues = currentQuestion;
  function getNextQuestionId(data: TResponseData, isFromPrefilling: Boolean = false): string {
    const questions = workflow.questions;
    const responseValue = data[questionId];

    if (questionId === "start") {
      if (!isFromPrefilling) {
        return questions[0]?.id || "end";
      } else {
        currIdx = 0;
        currQues = questions[0];
      }
    }
    if (questionId === "prompt") {
      return "end";
    }
    if (currIdx === -1) throw new Error("Question not found");

    if (currQues?.logic && currQues?.logic.length > 0) {
      for (let logic of currQues.logic) {
        if (!logic.destination) continue;

        if (evaluateCondition(logic, responseValue)) {
          return logic.destination;
        }
      }
    }
    // return questions[currIdx + 1]?.id || "end";
    const isLastQuestion = currIdx === questions.length - 1;
    const shouldShowPromptCard = isLastQuestion && workflow.prompt && workflow.prompt.enabled;

    if (shouldShowPromptCard) {
      return "prompt";
    }

    return isLastQuestion ? "end" : questions[currIdx + 1]?.id;
  }

  const isPromptVisible = () => {
    return workflow.prompt.enabled && workflow.prompt.isVisible;
  };

  const onChange = (responseDataUpdate: TResponseData) => {
    const updatedResponseData = { ...responseData, ...responseDataUpdate };
    setResponseData(updatedResponseData);
  };

  const onSubmit = (responseData: TResponseData, ttc: TResponseTtc, isFromPrefilling: Boolean = false) => {
    const questionId = Object.keys(responseData)[0];
    setLoadingElement(true);
    const nextQuestionId = getNextQuestionId(responseData, isFromPrefilling);
    const finished = nextQuestionId === "end";
    onResponse({ data: responseData, ttc, finished });
    if (finished) {
      onFinished();
    }
    setQuestionId(nextQuestionId);
    // add to history
    setHistory([...history, questionId]);
    setLoadingElement(false);
    onActiveQuestionChange(nextQuestionId);
  };

  const onBack = (): void => {
    let prevQuestionId;
    // use history if available
    if (history?.length > 0) {
      const newHistory = [...history];
      prevQuestionId = newHistory.pop();
      if (prefillResponseData && prevQuestionId === workflow.questions[0].id) return;
      setHistory(newHistory);
    } else {
      // otherwise go back to previous question in array
      prevQuestionId = workflow.questions[currIdx - 1]?.id;
    }
    if (!prevQuestionId) throw new Error("Question not found");
    setQuestionId(prevQuestionId);
    onActiveQuestionChange(prevQuestionId);
  };
  function getCardContent() {
    if (questionId === "start" && workflow.welcomeCard.enabled) {
      return (
        <WelcomeCard
          headline={workflow.welcomeCard.headline}
          html={workflow.welcomeCard.html}
          fileUrl={workflow.welcomeCard.fileUrl}
          buttonLabel={workflow.welcomeCard.buttonLabel}
          onSubmit={onSubmit}
          workflow={workflow}
          responseCount={responseCount}
        />
      );
    } else if (questionId === "prompt" && !workflow.prompt.enabled) {
      return <ActivatePromptCard headline="Edit and Activate your prompt" />;
    } else if (questionId === "prompt" && workflow.prompt.enabled && !workflow.prompt.isVisible) {
      if (!isPreview) {
        fetchOpenAIResponse();
      }
      return <SavingCard headline="Saving your response..." />;
    } else if (questionId === "prompt" && workflow.prompt.enabled && workflow.prompt.isVisible) {
      return (
        <PromptResponse
          prompt={workflow.prompt}
          webAppUrl={webAppUrl}
          environmentId={workflow.environmentId}
          workflowResponses={responseData}
          onChange={onChange}
          onSubmit={onSubmit}
          onBack={onBack}
          ttc={ttc}
          setTtc={setTtc}
          isPreview={isPreview}
        />
      );
    } else if ((questionId === "end" || questionId === "prompt") && workflow.thankYouCard.enabled) {
      return (
        <ThankYouCard
          headline={workflow.thankYouCard.headline}
          subheader={workflow.thankYouCard.subheader}
          redirectUrl={workflow.redirectUrl}
          isRedirectDisabled={isRedirectDisabled}
        />
      );
    } else {
      const currQues = workflow.questions.find((q) => q.id === questionId);
      return (
        currQues && (
          <QuestionConditional
            workflowId={workflow.id}
            question={currQues}
            value={responseData[currQues.id]}
            onChange={onChange}
            onSubmit={onSubmit}
            onBack={onBack}
            ttc={ttc}
            setTtc={setTtc}
            onFileUpload={onFileUpload}
            isFirstQuestion={
              history && prefillResponseData
                ? history[history.length - 1] === workflow.questions[0].id
                : currQues.id === workflow?.questions[0]?.id
            }
            isLastQuestion={currQues.id === workflow.questions[workflow.questions.length - 1].id}
            isPromptVisible={isPromptVisible()}
          />
        )
      );
    }
  }

  const fetchOpenAIResponse = async () => {
    if (!workflow.prompt.message) return;

    const promptMessage = processPromptMessage(
      workflow.prompt.message,
      workflow.prompt.attributes,
      responseData
    );

    const requestData = {
      messages: [
        {
          role: "system",
          content: promptMessage,
        },
      ],
      model: workflow.prompt.engine,
      stream: false,
    };

    try {
      const response = await typeflowaiAPI.client.openai.sendMessage(requestData);
      if (response.ok) {
        const data = response.data as TOpenAIResponse;
        if ("limitReached" in data && data.limitReached) {
          console.log("Error: Limit reached");
          return;
        }
        const openAIResponse = response.data as TOpenAIResponse;
        if (openAIResponse.choices && openAIResponse.choices.length > 0) {
          const responseContent = openAIResponse.choices[0].message.content;
          const updatedTtcObj = getUpdatedTtc(ttc, workflow.prompt.id, performance.now());
          setTtc(updatedTtcObj);
          const newResponseData = { ...responseData, [workflow.prompt.id]: responseContent };
          onSubmit(newResponseData, updatedTtcObj);
        } else {
          console.error("No choices available in the response");
        }
      } else {
        console.error("Error in API response:", response.error);
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  };

  return (
    <>
      <AutoCloseWrapper workflow={workflow} onClose={onClose}>
        <div className="no-scrollbar flex h-full w-full flex-col justify-between rounded-lg bg-[--fb-workflow-background-color] px-6 pb-3 pt-6">
          <div ref={contentRef} className={cn(loadingElement ? "animate-pulse opacity-60" : "", "my-auto")}>
            {workflow.questions.length === 0 &&
            !workflow.welcomeCard.enabled &&
            !workflow.thankYouCard.enabled ? (
              // Handle the case when there are no questions and both welcome and thank you cards are disabled
              <div>No questions available.</div>
            ) : (
              getCardContent()
            )}
          </div>
          <div className="mt-8">
            {isBrandingEnabled && <TypeflowAIBranding />}
            {showProgressBar && (
              <ProgressBar workflow={workflow} questionId={questionId} isPromptVisible={isPromptVisible()} />
            )}
          </div>
        </div>
      </AutoCloseWrapper>
    </>
  );
}
