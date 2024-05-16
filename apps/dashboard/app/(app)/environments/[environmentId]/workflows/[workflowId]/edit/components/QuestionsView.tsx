"use client";

import HiddenFieldsCard from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/HiddenFieldsCard";
import {
  isCardValid,
  validateQuestion,
  validateWorkflowQuestionsInBatch,
} from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/lib/validation";
import { createId } from "@paralleldrive/cuid2";
import { useEffect, useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import toast from "react-hot-toast";

// import { MultiLanguageCard } from "@typeflowai/ee/multiLanguage/components/MultiLanguageCard";
import { extractLanguageCodes, getLocalizedValue, translateQuestion } from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { checkForEmptyFallBackValue, extractRecallInfo } from "@typeflowai/lib/utils/recall";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";
import { capturePosthogEvent } from "@typeflowai/ui/PostHogClient";

import AddQuestionButton from "./AddQuestionButton";
import EditThankYouCard from "./EditThankYouCard";
import EditWelcomeCard from "./EditWelcomeCard";
import PromptCard from "./PromptCard";
import QuestionCard from "./QuestionCard";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface QuestionsViewProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  product: TProduct;
  invalidQuestions: string[] | null;
  setInvalidQuestions: (invalidQuestions: string[] | null) => void;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  isMultiLanguageAllowed?: boolean;
  isTypeflowAICloud: boolean;
  isEngineLimited: boolean;
}

export const QuestionsView = ({
  activeQuestionId,
  setActiveQuestionId,
  localWorkflow,
  setLocalWorkflow,
  product,
  invalidQuestions,
  setInvalidQuestions,
  setSelectedLanguageCode,
  selectedLanguageCode,
  // isMultiLanguageAllowed,
  // isTypeflowAICloud,
  isEngineLimited,
}: QuestionsViewProps) => {
  const internalQuestionIdMap = useMemo(() => {
    return localWorkflow.questions.reduce((acc, question) => {
      acc[question.id] = createId();
      return acc;
    }, {});
  }, [localWorkflow.questions]);
  const workflowLanguages = localWorkflow.languages;
  const [backButtonLabel, setbackButtonLabel] = useState(null);
  const handleQuestionLogicChange = (
    workflow: TWorkflow,
    compareId: string,
    updatedId: string
  ): TWorkflow => {
    workflow.questions.forEach((question) => {
      if (question.headline[selectedLanguageCode].includes(`recall:${compareId}`)) {
        question.headline[selectedLanguageCode] = question.headline[selectedLanguageCode].replaceAll(
          `recall:${compareId}`,
          `recall:${updatedId}`
        );
      }
      if (!question.logic) return;
      question.logic.forEach((rule) => {
        if (rule.destination === compareId) {
          rule.destination = updatedId;
        }
      });
    });
    return workflow;
  };

  // function to validate individual questions
  const validateWorkflowQuestion = (question: TWorkflowQuestion) => {
    // prevent this function to execute further if user hasnt still tried to save the workflow
    if (invalidQuestions === null) {
      return;
    }
    const isFirstQuestion = question.id === localWorkflow.questions[0].id;
    let temp = structuredClone(invalidQuestions);
    if (validateQuestion(question, workflowLanguages, isFirstQuestion)) {
      temp = invalidQuestions.filter((id) => id !== question.id);
      setInvalidQuestions(temp);
    } else if (!invalidQuestions.includes(question.id)) {
      temp.push(question.id);
      setInvalidQuestions(temp);
    }
  };

  const updateQuestion = (questionIdx: number, updatedAttributes: any) => {
    let updatedWorkflow = { ...localWorkflow };
    if ("id" in updatedAttributes) {
      // if the workflow whose id is to be changed is linked to logic of any other workflow then changing it
      const initialQuestionId = updatedWorkflow.questions[questionIdx].id;
      updatedWorkflow = handleQuestionLogicChange(updatedWorkflow, initialQuestionId, updatedAttributes.id);
      if (invalidQuestions?.includes(initialQuestionId)) {
        setInvalidQuestions(
          invalidQuestions.map((id) => (id === initialQuestionId ? updatedAttributes.id : id))
        );
      }

      // relink the question to internal Id
      internalQuestionIdMap[updatedAttributes.id] =
        internalQuestionIdMap[localWorkflow.questions[questionIdx].id];
      delete internalQuestionIdMap[localWorkflow.questions[questionIdx].id];
      setActiveQuestionId(updatedAttributes.id);
    }
    updatedWorkflow.questions[questionIdx] = {
      ...updatedWorkflow.questions[questionIdx],
      ...updatedAttributes,
    };

    if ("backButtonLabel" in updatedAttributes) {
      updatedWorkflow.questions.forEach((question) => {
        question.backButtonLabel = updatedAttributes.backButtonLabel;
      });
      setbackButtonLabel(updatedAttributes.backButtonLabel);
    }
    setLocalWorkflow(updatedWorkflow);
    validateWorkflowQuestion(updatedWorkflow.questions[questionIdx]);
  };

  const deleteQuestionMentionFromPrompt = (questionId) => {
    const promptMessage = localWorkflow.prompt.message;
    if (!promptMessage || !promptMessage.includes(`data-id="${questionId}"`)) return;

    const updatedMessage = promptMessage.replace(
      new RegExp(`<span data-type="mention" class="mention" data-id="${questionId}">[^<]*</span>`, "g"),
      ""
    );
    localWorkflow.prompt.message = updatedMessage;
  };

  const deleteQuestion = (questionIdx: number) => {
    const questionId = localWorkflow.questions[questionIdx].id;
    const activeQuestionIdTemp = activeQuestionId ?? localWorkflow.questions[0].id;
    let updatedWorkflow: TWorkflow = { ...localWorkflow };

    // check if we are recalling from this question
    updatedWorkflow.questions.forEach((question) => {
      if (question.headline[selectedLanguageCode].includes(`recall:${questionId}`)) {
        const recallInfo = extractRecallInfo(getLocalizedValue(question.headline, selectedLanguageCode));
        if (recallInfo) {
          question.headline[selectedLanguageCode] = question.headline[selectedLanguageCode].replace(
            recallInfo,
            ""
          );
        }
      }
    });
    updatedWorkflow.questions.splice(questionIdx, 1);
    updatedWorkflow = handleQuestionLogicChange(updatedWorkflow, questionId, "end");

    deleteQuestionMentionFromPrompt(questionId);

    setLocalWorkflow(updatedWorkflow);
    delete internalQuestionIdMap[questionId];
    if (questionId === activeQuestionIdTemp) {
      if (questionIdx <= localWorkflow.questions.length && localWorkflow.questions.length > 0) {
        setActiveQuestionId(localWorkflow.questions[questionIdx % localWorkflow.questions.length].id);
      } else if (localWorkflow.thankYouCard.enabled) {
        setActiveQuestionId("end");
      }
    }
    toast.success("Question deleted.");
  };

  const duplicateQuestion = (questionIdx: number) => {
    const questionToDuplicate = structuredClone(localWorkflow.questions[questionIdx]);

    const newQuestionId = createId();

    // create a copy of the question with a new id
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: newQuestionId,
    };

    // insert the new question right after the original one
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.questions.splice(questionIdx + 1, 0, duplicatedQuestion);

    setLocalWorkflow(updatedWorkflow);
    setActiveQuestionId(newQuestionId);
    internalQuestionIdMap[newQuestionId] = createId();

    toast.success("Question duplicated.");
  };

  const addQuestion = (question: any) => {
    const updatedWorkflow = { ...localWorkflow };
    if (backButtonLabel) {
      question.backButtonLabel = backButtonLabel;
    }
    const languageSymbols = extractLanguageCodes(localWorkflow.languages);
    const translatedQuestion = translateQuestion(question, languageSymbols);
    updatedWorkflow.questions.push({ ...translatedQuestion, isDraft: true });

    capturePosthogEvent("QuestionAdded2Workflow", {
      type: capitalizeFirstLetter(question.type),
      workflowId: updatedWorkflow.id,
    });

    setLocalWorkflow(updatedWorkflow);
    setActiveQuestionId(question.id);
    internalQuestionIdMap[question.id] = createId();
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newQuestions = Array.from(localWorkflow.questions);
    const [reorderedQuestion] = newQuestions.splice(result.source.index, 1);
    newQuestions.splice(result.destination.index, 0, reorderedQuestion);
    const updatedWorkflow = { ...localWorkflow, questions: newQuestions };
    setLocalWorkflow(updatedWorkflow);
  };

  const moveQuestion = (questionIndex: number, up: boolean) => {
    const newQuestions = Array.from(localWorkflow.questions);
    const [reorderedQuestion] = newQuestions.splice(questionIndex, 1);
    const destinationIndex = up ? questionIndex - 1 : questionIndex + 1;
    newQuestions.splice(destinationIndex, 0, reorderedQuestion);
    const updatedWorkflow = { ...localWorkflow, questions: newQuestions };
    setLocalWorkflow(updatedWorkflow);
  };

  useEffect(() => {
    if (invalidQuestions === null) return;

    const updateInvalidQuestions = (card, cardId, currentInvalidQuestions) => {
      if (card.enabled && !isCardValid(card, cardId, workflowLanguages)) {
        return currentInvalidQuestions.includes(cardId)
          ? currentInvalidQuestions
          : [...currentInvalidQuestions, cardId];
      }
      return currentInvalidQuestions.filter((id) => id !== cardId);
    };

    const updatedQuestionsStart = updateInvalidQuestions(
      localWorkflow.welcomeCard,
      "start",
      invalidQuestions
    );
    const updatedQuestionsEnd = updateInvalidQuestions(
      localWorkflow.thankYouCard,
      "end",
      updatedQuestionsStart
    );

    setInvalidQuestions(updatedQuestionsEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWorkflow.welcomeCard, localWorkflow.thankYouCard]);

  //useEffect to validate workflow when changes are made to languages
  useEffect(() => {
    if (!invalidQuestions) return;
    let updatedInvalidQuestions: string[] = invalidQuestions;
    // Validate each question
    localWorkflow.questions.forEach((question, index) => {
      updatedInvalidQuestions = validateWorkflowQuestionsInBatch(
        question,
        updatedInvalidQuestions,
        workflowLanguages,
        index === 0
      );
    });

    // Check welcome card
    if (
      localWorkflow.welcomeCard.enabled &&
      !isCardValid(localWorkflow.welcomeCard, "start", workflowLanguages)
    ) {
      if (!updatedInvalidQuestions.includes("start")) {
        updatedInvalidQuestions.push("start");
      }
    } else {
      updatedInvalidQuestions = updatedInvalidQuestions.filter((questionId) => questionId !== "start");
    }

    // Check thank you card
    if (
      localWorkflow.thankYouCard.enabled &&
      !isCardValid(localWorkflow.thankYouCard, "end", workflowLanguages)
    ) {
      if (!updatedInvalidQuestions.includes("end")) {
        updatedInvalidQuestions.push("end");
      }
    } else {
      updatedInvalidQuestions = updatedInvalidQuestions.filter((questionId) => questionId !== "end");
    }

    if (JSON.stringify(updatedInvalidQuestions) !== JSON.stringify(invalidQuestions)) {
      setInvalidQuestions(updatedInvalidQuestions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWorkflow.languages, localWorkflow.questions]);

  useEffect(() => {
    const questionWithEmptyFallback = checkForEmptyFallBackValue(localWorkflow, selectedLanguageCode);
    if (questionWithEmptyFallback) {
      setActiveQuestionId(questionWithEmptyFallback.id);
      if (activeQuestionId === questionWithEmptyFallback.id) {
        toast.error("Fallback missing");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionId, setActiveQuestionId]);

  const isPromptVisible = () => {
    return localWorkflow.prompt.enabled && localWorkflow.prompt.isVisible;
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="mt-16 px-5 py-4">
      <div className="mb-5 flex flex-col gap-5">
        <EditWelcomeCard
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          setActiveQuestionId={setActiveQuestionId}
          activeQuestionId={activeQuestionId}
          isInvalid={invalidQuestions ? invalidQuestions.includes("start") : false}
          setSelectedLanguageCode={setSelectedLanguageCode}
          selectedLanguageCode={selectedLanguageCode}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mb-5 grid grid-cols-1 gap-5 ">
          <StrictModeDroppable droppableId="questionsList">
            {(provided) => (
              <div className="grid w-full gap-5" ref={provided.innerRef} {...provided.droppableProps}>
                {localWorkflow.questions.map((question, questionIdx) => (
                  // display a question form
                  <QuestionCard
                    key={internalQuestionIdMap[question.id]}
                    localWorkflow={localWorkflow}
                    setLocalWorkflow={setLocalWorkflow}
                    product={product}
                    questionIdx={questionIdx}
                    moveQuestion={moveQuestion}
                    updateQuestion={updateQuestion}
                    duplicateQuestion={duplicateQuestion}
                    selectedLanguageCode={selectedLanguageCode}
                    setSelectedLanguageCode={setSelectedLanguageCode}
                    deleteQuestion={deleteQuestion}
                    activeQuestionId={activeQuestionId}
                    setActiveQuestionId={setActiveQuestionId}
                    lastQuestion={questionIdx === localWorkflow.questions.length - 1}
                    isPromptVisible={isPromptVisible()}
                    isInvalid={invalidQuestions ? invalidQuestions.includes(question.id) : false}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </div>
      </DragDropContext>
      <AddQuestionButton addQuestion={addQuestion} product={product} />
      <div className="mt-5 flex flex-col gap-5">
        <PromptCard
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          prompt={localWorkflow.prompt}
          activeQuestionId={activeQuestionId}
          setActiveQuestionId={setActiveQuestionId}
          isEngineLimited={isEngineLimited}
        />
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <EditThankYouCard
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          setActiveQuestionId={setActiveQuestionId}
          activeQuestionId={activeQuestionId}
          isInvalid={invalidQuestions ? invalidQuestions.includes("end") : false}
          setSelectedLanguageCode={setSelectedLanguageCode}
          selectedLanguageCode={selectedLanguageCode}
        />

        {localWorkflow.type === "link" ? (
          <HiddenFieldsCard
            localWorkflow={localWorkflow}
            setLocalWorkflow={setLocalWorkflow}
            setActiveQuestionId={setActiveQuestionId}
            activeQuestionId={activeQuestionId}
          />
        ) : null}

        {/* <MultiLanguageCard
          localWorkflow={localWorkflow}
          product={product}
          setLocalWorkflow={setLocalWorkflow}
          setActiveQuestionId={setActiveQuestionId}
          activeQuestionId={activeQuestionId}
          isMultiLanguageAllowed={isMultiLanguageAllowed}
          isTypeflowAICloud={isTypeflowAICloud}
          setSelectedLanguageCode={setSelectedLanguageCode}
        /> */}
      </div>
    </div>
  );
};
