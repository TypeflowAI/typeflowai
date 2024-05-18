import ActivatePromptCard from "@/components/general/ActivatePromptCard";
import { ProgressBar } from "@/components/general/ProgressBar";
import PromptResponse from "@/components/general/PromptResponse";
import { QuestionConditional } from "@/components/general/QuestionConditional";
import { ResponseErrorComponent } from "@/components/general/ResponseErrorComponent";
import SavingCard from "@/components/general/SavingCard";
import { ThankYouCard } from "@/components/general/ThankYouCard";
import { TypeflowAIBranding } from "@/components/general/TypeflowAIBranding";
import { WelcomeCard } from "@/components/general/WelcomeCard";
import { WorkflowCloseButton } from "@/components/general/WorkflowCloseButton";
import { AutoCloseWrapper } from "@/components/wrappers/AutoCloseWrapper";
import { StackedCardsContainer } from "@/components/wrappers/StackedCardsContainer";
import { evaluateCondition } from "@/lib/logicEvaluator";
import { processPromptMessage } from "@/lib/parsePrompt";
import { getUpdatedTtc } from "@/lib/ttc";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import { TypeflowAIAPI } from "@typeflowai/api";
import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { formatDateWithOrdinal, isValidDateString } from "@typeflowai/lib/utils/datetime";
import { extractFallbackValue, extractId, extractRecallInfo } from "@typeflowai/lib/utils/recall";
import { TOpenAIResponse } from "@typeflowai/types/openai";
import type { TResponseData, TResponseTtc } from "@typeflowai/types/responses";
import { WorkflowBaseProps } from "@typeflowai/types/typeflowAIWorkflows";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

export const Workflow = ({
  workflow,
  webAppUrl,
  styling,
  isBrandingEnabled,
  onDisplay = () => {},
  onResponse = () => {},
  onClose = () => {},
  onFinished = () => {},
  onRetry = () => {},
  isRedirectDisabled = false,
  prefillResponseData,
  languageCode,
  getSetIsError,
  getSetIsResponseSendingFinished,
  getSetQuestionId,
  onFileUpload,
  responseCount,
  isPreview,
  startAtQuestionId,
}: WorkflowBaseProps) => {
  const isInIframe = window.self !== window.top;
  const [questionId, setQuestionId] = useState(
    workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id
  );
  const [showError, setShowError] = useState(false);
  // flag state to store whether response processing has been completed or not, we ignore this check for workflow editor preview and link workflow preview where getSetIsResponseSendingFinished is undefined
  const [isResponseSendingFinished, setIsResponseSendingFinished] = useState(
    getSetIsResponseSendingFinished ? false : true
  );
  const [loadingElement, setLoadingElement] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [responseData, setResponseData] = useState<TResponseData>({});
  const [ttc, setTtc] = useState<TResponseTtc>({});
  const cardArrangement = useMemo(() => {
    if (workflow.type === "link") {
      return styling.cardArrangement?.linkWorkflows ?? "straight";
    } else {
      return styling.cardArrangement?.appWorkflows ?? "straight";
    }
  }, [workflow.type, styling.cardArrangement?.linkWorkflows, styling.cardArrangement?.appWorkflows]);
  const currentQuestionIndex = workflow.questions.findIndex((q) => q.id === questionId);
  const currentQuestion = useMemo(() => {
    if (questionId === "end" && !workflow.thankYouCard.enabled) {
      const newHistory = [...history];
      const prevQuestionId = newHistory.pop();
      return workflow.questions.find((q) => q.id === prevQuestionId);
    } else {
      return workflow.questions.find((q) => q.id === questionId);
    }
  }, [questionId, workflow, history]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const showProgressBar = !styling.hideProgressBar;
  const typeflowaiAPI = new TypeflowAIAPI({
    apiHost: webAppUrl,
    environmentId: workflow.environmentId,
  });

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
      onChange(prefillResponseData);
    }
    if (startAtQuestionId) {
      setQuestionId(startAtQuestionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getSetIsError) {
      getSetIsError((value: boolean) => {
        setShowError(value);
      });
    }
  }, [getSetIsError]);

  useEffect(() => {
    if (getSetQuestionId) {
      getSetQuestionId((value: string) => {
        setQuestionId(value);
      });
    }
  }, [getSetQuestionId]);

  useEffect(() => {
    if (getSetIsResponseSendingFinished) {
      getSetIsResponseSendingFinished((value: boolean) => {
        setIsResponseSendingFinished(value);
      });
    }
  }, [getSetIsResponseSendingFinished]);

  let currIdxTemp = currentQuestionIndex;
  let currQuesTemp = currentQuestion;

  const getNextQuestionId = (data: TResponseData): string => {
    const questions = workflow.questions;
    const responseValue = data[questionId];

    if (questionId === "start") return questions[0]?.id || "end";
    if (questionId === "prompt") {
      return "end";
    }
    if (currIdxTemp === -1) throw new Error("Question not found");
    if (currQuesTemp?.logic && currQuesTemp?.logic.length > 0 && currentQuestion) {
      for (let logic of currQuesTemp.logic) {
        if (!logic.destination) continue;
        // Check if the current question is of type 'multipleChoiceSingle' or 'multipleChoiceMulti'
        if (
          currentQuestion.type === "multipleChoiceSingle" ||
          currentQuestion.type === "multipleChoiceMulti"
        ) {
          let choice;

          // Check if the response is a string (applies to single choice questions)
          // Sonne -> sun
          if (typeof responseValue === "string") {
            // Find the choice in currentQuestion.choices that matches the responseValue after localization
            choice = currentQuestion.choices.find((choice) => {
              return getLocalizedValue(choice.label, languageCode) === responseValue;
            })?.label;

            // If a matching choice is found, get its default localized value
            if (choice) {
              choice = getLocalizedValue(choice, "default");
            }
          }
          // Check if the response is an array (applies to multiple choices questions)
          // ["Sonne","Mond"]->["sun","moon"]
          else if (Array.isArray(responseValue)) {
            // Filter and map the choices in currentQuestion.choices that are included in responseValue after localization
            choice = currentQuestion.choices
              .filter((choice) => {
                return responseValue.includes(getLocalizedValue(choice.label, languageCode));
              })
              .map((choice) => getLocalizedValue(choice.label, "default"));
          }

          // If a choice is determined (either single or multiple), evaluate the logic condition with that choice
          if (choice) {
            if (evaluateCondition(logic, choice)) {
              return logic.destination;
            }
          }
          // If choice is undefined, it implies an "other" option is selected. Evaluate the logic condition for "Other"
          else {
            if (evaluateCondition(logic, "Other")) {
              return logic.destination;
            }
          }
        }
        if (evaluateCondition(logic, responseValue)) {
          return logic.destination;
        }
      }
    }
    // return questions[currIdxTemp + 1]?.id || "end";
    const isLastQuestion = currIdxTemp === questions.length - 1;
    const shouldShowPromptCard = isLastQuestion && workflow.prompt && workflow.prompt.enabled;

    if (shouldShowPromptCard) {
      return "prompt";
    }

    return isLastQuestion ? "end" : questions[currIdxTemp + 1]?.id;
  };

  const isPromptVisible = () => {
    return workflow.prompt.enabled && workflow.prompt.isVisible;
  };

  const onChange = (responseDataUpdate: TResponseData) => {
    const updatedResponseData = { ...responseData, ...responseDataUpdate };
    setResponseData(updatedResponseData);
  };

  const onSubmit = (responseData: TResponseData, ttc: TResponseTtc) => {
    const questionId = Object.keys(responseData)[0];
    setLoadingElement(true);
    const nextQuestionId = getNextQuestionId(responseData);
    const finished = nextQuestionId === "end";
    onResponse({ data: responseData, ttc, finished });
    if (finished) {
      // Post a message to the parent window indicating that the workflow is completed.
      window.parent.postMessage("typeflowAIWorkflowCompleted", "*");
      onFinished();
    }
    setQuestionId(nextQuestionId);
    // add to history
    setHistory([...history, questionId]);
    setLoadingElement(false);
  };

  const replaceRecallInfo = (text: string): string => {
    while (text.includes("recall:")) {
      const recallInfo = extractRecallInfo(text);
      if (recallInfo) {
        const questionId = extractId(recallInfo);
        const fallback = extractFallbackValue(recallInfo).replaceAll("nbsp", " ");
        let value = questionId && responseData[questionId] ? (responseData[questionId] as string) : fallback;

        if (isValidDateString(value)) {
          value = formatDateWithOrdinal(new Date(value));
        }
        if (Array.isArray(value)) {
          value = value.filter((item) => item !== null && item !== undefined && item !== "").join(", ");
        }
        text = text.replace(recallInfo, value);
      }
    }
    return text;
  };

  const parseRecallInformation = (question: TWorkflowQuestion) => {
    const modifiedQuestion = structuredClone(question);
    if (question.headline && question.headline[languageCode]?.includes("recall:")) {
      modifiedQuestion.headline[languageCode] = replaceRecallInfo(
        getLocalizedValue(modifiedQuestion.headline, languageCode)
      );
    }
    if (
      question.subheader &&
      question.subheader[languageCode]?.includes("recall:") &&
      modifiedQuestion.subheader
    ) {
      modifiedQuestion.subheader[languageCode] = replaceRecallInfo(
        getLocalizedValue(modifiedQuestion.subheader, languageCode)
      );
    }
    return modifiedQuestion;
  };

  const onBack = (): void => {
    let prevQuestionId;
    // use history if available
    if (history?.length > 0) {
      const newHistory = [...history];
      prevQuestionId = newHistory.pop();
      setHistory(newHistory);
    } else {
      // otherwise go back to previous question in array
      prevQuestionId = workflow.questions[currIdxTemp - 1]?.id;
    }
    if (!prevQuestionId) throw new Error("Question not found");
    setQuestionId(prevQuestionId);
  };

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

  const getCardContent = (questionIdx: number, offset: number): JSX.Element | undefined => {
    if (showError) {
      return (
        <ResponseErrorComponent
          responseData={responseData}
          questions={workflow.questions}
          onRetry={onRetry}
        />
      );
    }
    const content = () => {
      if (questionIdx === -1) {
        return (
          <WelcomeCard
            headline={workflow.welcomeCard.headline}
            html={workflow.welcomeCard.html}
            fileUrl={workflow.welcomeCard.fileUrl}
            buttonLabel={workflow.welcomeCard.buttonLabel}
            onSubmit={onSubmit}
            workflow={workflow}
            languageCode={languageCode}
            responseCount={responseCount}
            isInIframe={isInIframe}
          />
        );
      } else if (questionId === "prompt") {
        if (!workflow.prompt.enabled) {
          return <ActivatePromptCard headline="Edit and Activate your prompt" />;
        } else if (workflow.prompt.enabled && !workflow.prompt.isVisible) {
          if (!isPreview) {
            fetchOpenAIResponse();
          }
          return <SavingCard headline="Saving your response..." />;
        } else if (workflow.prompt.enabled && workflow.prompt.isVisible) {
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
              currentQuestionId={questionId}
            />
          );
        } else if (questionIdx === workflow.questions.length || questionId === "prompt") {
          return (
            <ThankYouCard
              headline={workflow.thankYouCard.headline}
              subheader={workflow.thankYouCard.subheader}
              isResponseSendingFinished={isResponseSendingFinished}
              buttonLabel={workflow.thankYouCard.buttonLabel}
              buttonLink={workflow.thankYouCard.buttonLink}
              imageUrl={workflow.thankYouCard.imageUrl}
              videoUrl={workflow.thankYouCard.videoUrl}
              redirectUrl={workflow.redirectUrl}
              isRedirectDisabled={isRedirectDisabled}
              languageCode={languageCode}
              replaceRecallInfo={replaceRecallInfo}
              isInIframe={isInIframe}
            />
          );
        } else {
          const question = workflow.questions[questionIdx];
          return (
            question && (
              <QuestionConditional
                workflowId={workflow.id}
                question={parseRecallInformation(question)}
                value={responseData[question.id]}
                onChange={onChange}
                onSubmit={onSubmit}
                onBack={onBack}
                ttc={ttc}
                setTtc={setTtc}
                onFileUpload={onFileUpload}
                isFirstQuestion={
                  history && prefillResponseData
                    ? history[history.length - 1] === workflow.questions[0].id
                    : question.id === workflow?.questions[0]?.id
                }
                isLastQuestion={question.id === workflow.questions[workflow.questions.length - 1].id}
                languageCode={languageCode}
                isInIframe={isInIframe}
                currentQuestionId={questionId}
                isPromptVisible={isPromptVisible()}
              />
            )
          );
        }
        // if (questionId === "start" && workflow.welcomeCard.enabled) {
        //   return (
        //     <WelcomeCard
        //       headline={workflow.welcomeCard.headline}
        //       html={workflow.welcomeCard.html}
        //       fileUrl={workflow.welcomeCard.fileUrl}
        //       buttonLabel={workflow.welcomeCard.buttonLabel}
        //       onSubmit={onSubmit}
        //       workflow={workflow}
        //       languageCode={languageCode}
        //       responseCount={responseCount}
        //       isInIframe={isInIframe}
        //     />
        //   );
        // } else if (questionId === "prompt" && !workflow.prompt.enabled) {
        //   return <ActivatePromptCard headline="Edit and Activate your prompt" />;
        // } else if (questionId === "prompt" && workflow.prompt.enabled && !workflow.prompt.isVisible) {
        //   if (!isPreview) {
        //     fetchOpenAIResponse();
        //   }
        //   return <SavingCard headline="Saving your response..." />;
        // } else if (questionId === "prompt" && workflow.prompt.enabled && workflow.prompt.isVisible) {
        //   return (
        //     <PromptResponse
        //       prompt={workflow.prompt}
        //       webAppUrl={webAppUrl}
        //       environmentId={workflow.environmentId}
        //       workflowResponses={responseData}
        //       onChange={onChange}
        //       onSubmit={onSubmit}
        //       onBack={onBack}
        //       ttc={ttc}
        //       setTtc={setTtc}
        //       isPreview={isPreview}
        //     />
        //   );
        // } else if ((questionId === "end" || questionId === "prompt") && workflow.thankYouCard.enabled) {
        //   return (
        //     <ThankYouCard
        //       headline={workflow.thankYouCard.headline}
        //       subheader={workflow.thankYouCard.subheader}
        //       isResponseSendingFinished={isResponseSendingFinished}
        //       buttonLabel={workflow.thankYouCard.buttonLabel}
        //       buttonLink={workflow.thankYouCard.buttonLink}
        //       imageUrl={workflow.thankYouCard.imageUrl}
        //       videoUrl={workflow.thankYouCard.videoUrl}
        //       redirectUrl={workflow.redirectUrl}
        //       isRedirectDisabled={isRedirectDisabled}
        //       languageCode={languageCode}
        //       replaceRecallInfo={replaceRecallInfo}
        //       isInIframe={isInIframe}
        //     />
        //   );
        // } else {
        //   return (
        //     currentQuestion && (
        //       <QuestionConditional
        //         workflowId={workflow.id}
        //         question={parseRecallInformation(currentQuestion)}
        //         value={responseData[currentQuestion.id]}
        //         onChange={onChange}
        //         onSubmit={onSubmit}
        //         onBack={onBack}
        //         ttc={ttc}
        //         setTtc={setTtc}
        //         onFileUpload={onFileUpload}
        //         isFirstQuestion={currentQuestion.id === workflow?.questions[0]?.id}
        //         isLastQuestion={currentQuestion.id === workflow.questions[workflow.questions.length - 1].id}
        //         languageCode={languageCode}
        //         isInIframe={isInIframe}
        //         isPromptVisible={isPromptVisible()}
        //       />
        //     )
        //   );
      }
    };

    return (
      <AutoCloseWrapper workflow={workflow} onClose={onClose}>
        {offset === 0 && workflow.type !== "link" && <WorkflowCloseButton onClose={onClose} />}
        <div
          className={cn(
            "no-scrollbar md:rounded-custom rounded-t-custom bg-workflow-bg flex h-full w-full flex-col justify-between overflow-hidden transition-all duration-1000 ease-in-out",
            workflow.type === "link" ? "fb-workflow-shadow" : "",
            offset === 0 || cardArrangement === "simple" ? "opacity-100" : "opacity-0"
          )}>
          <div ref={contentRef} className={cn(loadingElement ? "animate-pulse opacity-60" : "", "my-auto")}>
            {content()}
          </div>
          <div className="mx-6 mb-10 mt-2 space-y-3 md:mb-6 md:mt-6">
            {isBrandingEnabled && <TypeflowAIBranding />}
            {showProgressBar && <ProgressBar workflow={workflow} questionId={questionId} />}
          </div>
        </div>
      </AutoCloseWrapper>
    );
  };

  return (
    <StackedCardsContainer
      cardArrangement={cardArrangement}
      currentQuestionId={questionId}
      getCardContent={getCardContent}
      workflow={workflow}
      styling={styling}
      setQuestionId={setQuestionId}
    />
  );
};
