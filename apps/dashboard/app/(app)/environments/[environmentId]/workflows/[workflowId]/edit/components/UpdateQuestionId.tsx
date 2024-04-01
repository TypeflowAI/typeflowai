"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

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
    if (questionIds.includes(currentValue)) {
      setIsInputInvalid(true);
      toast.error("IDs have to be unique per workflow.");
    } else if (currentValue.trim() === "" || currentValue.includes(" ")) {
      setCurrentValue(prevValue);
      updateQuestion(questionIdx, { id: prevValue });
      toast.error("ID should not be empty.");
      return;
    } else if (
      ["userId", "source", "suid", "end", "start", "welcomeCard", "hidden", "prompt"].includes(currentValue)
    ) {
      setCurrentValue(prevValue);
      updateQuestion(questionIdx, { id: prevValue });
      toast.error("Reserved words cannot be used as question ID");
      return;
    } else {
      setIsInputInvalid(false);
      updatePromptMessageId(prevValue, currentValue);
      toast.success("Question ID updated.");
    }

    updateQuestion(questionIdx, { id: currentValue });
    setPrevValue(currentValue); // after successful update, set current value as previous value
  };

  const updatePromptMessageId = (oldId, newId) => {
    const promptMessage = localWorkflow.prompt.message;
    if (!promptMessage || !promptMessage.includes(`data-id="${oldId}"`)) return;

    const updatedMessage = promptMessage.replace(new RegExp(`data-id="${oldId}"`, "g"), `data-id="${newId}"`);
    localWorkflow.prompt.message = updatedMessage;
    setLocalWorkflow({ ...localWorkflow });
  };

  return (
    <div>
      <Label htmlFor="questionId">Question ID</Label>
      <div className="mt-2 inline-flex w-full">
        <Input
          id="questionId"
          name="questionId"
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            localWorkflow.hiddenFields?.fieldIds?.forEach((field) => {
              if (field === e.target.value) {
                setIsInputInvalid(true);
                toast.error("QuestionID can't be equal to hidden fields");
              }
            });
          }}
          onBlur={saveAction}
          disabled={!(localWorkflow.status === "draft" || question.isDraft)}
          className={isInputInvalid ? "border-red-300 focus:border-red-300" : ""}
        />
      </div>
    </div>
  );
}
