"use client";

import QuestionFormInput from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/QuestionFormInput";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  HashtagIcon,
  LinkIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

import {
  TWorkflow,
  TWorkflowOpenTextQuestion,
  TWorkflowOpenTextQuestionInputType,
} from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { OptionsSwitcher } from "@typeflowai/ui/QuestionTypeSelector";

const questionTypes = [
  { value: "text", label: "Text", icon: <ChatBubbleBottomCenterTextIcon /> },
  { value: "email", label: "Email", icon: <EnvelopeIcon /> },
  { value: "url", label: "URL", icon: <LinkIcon /> },
  { value: "number", label: "Number", icon: <HashtagIcon /> },
  { value: "phone", label: "Phone", icon: <PhoneIcon /> },
];

interface OpenQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowOpenTextQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  isInValid: boolean;
}

export default function OpenQuestionForm({
  question,
  questionIdx,
  updateQuestion,
  isInValid,
  localWorkflow,
}: OpenQuestionFormProps): JSX.Element {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const defaultPlaceholder = getPlaceholderByInputType(question.inputType ?? "text");

  const handleInputChange = (inputType: TWorkflowOpenTextQuestionInputType) => {
    const updatedAttributes = {
      inputType: inputType,
      placeholder: getPlaceholderByInputType(inputType),
      longAnswer: inputType === "text" ? question.longAnswer : false,
    };
    updateQuestion(questionIdx, updatedAttributes);
  };

  const environmentId = localWorkflow.environmentId;

  return (
    <form>
      <QuestionFormInput
        environmentId={environmentId}
        isInValid={isInValid}
        question={question}
        questionIdx={questionIdx}
        updateQuestion={updateQuestion}
      />

      <div className="mt-3">
        {showSubheader && (
          <>
            <Label htmlFor="subheader">Description</Label>
            <div className="mt-2 inline-flex w-full items-center">
              <Input
                id="subheader"
                name="subheader"
                value={question.subheader}
                onChange={(e) => updateQuestion(questionIdx, { subheader: e.target.value })}
              />
              <TrashIcon
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                onClick={() => {
                  setShowSubheader(false);
                  updateQuestion(questionIdx, { subheader: "" });
                }}
              />
            </div>
          </>
        )}
        {!showSubheader && (
          <Button size="sm" variant="minimal" type="button" onClick={() => setShowSubheader(true)}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>

      <div className="mt-3">
        <Label htmlFor="placeholder">Placeholder</Label>
        <div className="mt-2">
          <Input
            id="placeholder"
            name="placeholder"
            value={question.placeholder ?? defaultPlaceholder}
            onChange={(e) => updateQuestion(questionIdx, { placeholder: e.target.value })}
          />
        </div>
      </div>

      {/* Add a dropdown to select the question type */}
      <div className="mt-3">
        <Label htmlFor="questionType">Input Type</Label>
        <div className="mt-2 flex items-center">
          <OptionsSwitcher
            options={questionTypes}
            currentOption={question.inputType}
            handleTypeChange={handleInputChange} // Use the merged function
          />
        </div>
      </div>
    </form>
  );
}

function getPlaceholderByInputType(inputType: TWorkflowOpenTextQuestionInputType) {
  switch (inputType) {
    case "email":
      return "example@email.com";
    case "url":
      return "http://...";
    case "number":
      return "42";
    case "phone":
      return "+1 123 456 789";
    default:
      return "Type your answer here...";
  }
}
