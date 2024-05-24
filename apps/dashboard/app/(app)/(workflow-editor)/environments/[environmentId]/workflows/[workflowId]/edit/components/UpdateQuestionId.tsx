"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

import { validateId } from "../lib/validation";

interface UpdateQuestionIdProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  question: TWorkflowQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
}

export default function UpdateQuestionId({
  localWorkflow,
  setLocalWorkflow,
  question,
  questionIdx,
  updateQuestion,
}: UpdateQuestionIdProps) {
  const [currentValue, setCurrentValue] = useState(question.id);
  const [prevValue, setPrevValue] = useState(question.id);
  const [isInputInvalid, setIsInputInvalid] = useState(
    currentValue.trim() === "" || currentValue.includes(" ")
  );

  const saveAction = () => {
    // return early if the input value was not changed
    if (currentValue === prevValue) {
      return;
    }

    const questionIds = localWorkflow.questions.map((q) => q.id);
    const hiddenFieldIds = localWorkflow.hiddenFields.fieldIds ?? [];
    if (validateId("Question", currentValue, questionIds, hiddenFieldIds)) {
      setIsInputInvalid(false);
      updatePromptMessageId(prevValue, currentValue);
      toast.success("Question ID updated.");
      updateQuestion(questionIdx, { id: currentValue });
      setPrevValue(currentValue); // after successful update, set current value as previous value
    } else {
      setCurrentValue(prevValue);
    }
  };

  const updatePromptMessageId = (oldId, newId) => {
    const promptMessage = localWorkflow.prompt.message;
    if (!promptMessage || !promptMessage.includes(`data-id="${oldId}"`)) return;

    const updatedMessage = promptMessage.replace(new RegExp(`data-id="${oldId}"`, "g"), `data-id="${newId}"`);
    localWorkflow.prompt.message = updatedMessage;
    setLocalWorkflow({ ...localWorkflow });
  };

  const isButtonDisabled = () => {
    if (currentValue === question.id || currentValue.trim() === "") return true;
    else return false;
  };

  return (
    <div>
      <Label htmlFor="questionId">Question ID</Label>
      <div className="mt-2 inline-flex w-full space-x-2">
        <Input
          id="questionId"
          name="questionId"
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
          }}
          disabled={localWorkflow.status !== "draft" && !question.isDraft}
          className={`h-10 ${isInputInvalid ? "border-red-300 focus:border-red-300" : ""}`}
        />
        <Button variant="darkCTA" size="sm" onClick={saveAction} disabled={isButtonDisabled()}>
          Save
        </Button>
      </div>
    </div>
  );
}
