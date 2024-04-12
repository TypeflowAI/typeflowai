"use client";

import HiddenFieldsCard from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/HiddenFieldsCard";
import { createId } from "@paralleldrive/cuid2";
import { useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import toast from "react-hot-toast";

import { TProduct } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";
import { trackEvent } from "@typeflowai/ui/PostHogClient";

import AddQuestionButton from "./AddQuestionButton";
import EditThankYouCard from "./EditThankYouCard";
import EditWelcomeCard from "./EditWelcomeCard";
import GPTPromptCard from "./GPTPromptCard";
import QuestionCard from "./QuestionCard";
import { StrictModeDroppable } from "./StrictModeDroppable";
import { validateQuestion } from "./Validation";

interface QuestionsViewProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  product: TProduct;
  invalidQuestions: String[] | null;
  setInvalidQuestions: (invalidQuestions: String[] | null) => void;
  isEngineLimited: boolean;
}

export default function QuestionsView({
  activeQuestionId,
  setActiveQuestionId,
  localWorkflow,
  setLocalWorkflow,
  product,
  invalidQuestions,
  setInvalidQuestions,
  isEngineLimited,
}: QuestionsViewProps) {
  const internalQuestionIdMap = useMemo(() => {
    return localWorkflow.questions.reduce((acc, question) => {
      acc[question.id] = createId();
      return acc;
    }, {});
  }, []);

  const [backButtonLabel, setbackButtonLabel] = useState(null);

  const handleQuestionLogicChange = (
    workflow: TWorkflow,
    compareId: string,
    updatedId: string
  ): TWorkflow => {
    workflow.questions.forEach((question) => {
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
  const validateWorkflow = (question: TWorkflowQuestion) => {
    // prevent this function to execute further if user hasnt still tried to save the workflow
    if (invalidQuestions === null) {
      return;
    }
    let temp = JSON.parse(JSON.stringify(invalidQuestions));
    if (validateQuestion(question)) {
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
    validateWorkflow(updatedWorkflow.questions[questionIdx]);
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
    const questionToDuplicate = JSON.parse(JSON.stringify(localWorkflow.questions[questionIdx]));

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

    updatedWorkflow.questions.push({ ...question, isDraft: true });

    trackEvent("QuestionAdded2Workflow", {
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

  const isPromptVisible = () => {
    return localWorkflow.prompt.enabled && localWorkflow.prompt.isVisible;
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="mt-12 px-5 py-4">
      <div className="mb-5 flex flex-col gap-5">
        <EditWelcomeCard
          localWorkflow={localWorkflow}
          setLocalWorkflow={setLocalWorkflow}
          setActiveQuestionId={setActiveQuestionId}
          activeQuestionId={activeQuestionId}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="mb-5 grid grid-cols-1 gap-5 ">
          <StrictModeDroppable droppableId="questionsList">
            {(provided) => (
              <div className="grid gap-5" ref={provided.innerRef} {...provided.droppableProps}>
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
                    deleteQuestion={deleteQuestion}
                    activeQuestionId={activeQuestionId}
                    setActiveQuestionId={setActiveQuestionId}
                    lastQuestion={questionIdx === localWorkflow.questions.length - 1}
                    isPromptVisible={isPromptVisible()}
                    isInValid={invalidQuestions ? invalidQuestions.includes(question.id) : false}
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
        <GPTPromptCard
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
        />

        {localWorkflow.type === "link" ? (
          <HiddenFieldsCard
            localWorkflow={localWorkflow}
            setLocalWorkflow={setLocalWorkflow}
            setActiveQuestionId={setActiveQuestionId}
            activeQuestionId={activeQuestionId}
          />
        ) : null}
      </div>
    </div>
  );
}
