"use client";

import {
  HashIcon,
  LinkIcon,
  MailIcon,
  MessageSquareTextIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";

import { createI18nString, extractLanguageCodes } from "@typeflowai/lib/i18n/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import {
  TWorkflow,
  TWorkflowOpenTextQuestion,
  TWorkflowOpenTextQuestionInputType,
} from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { OptionsSwitcher } from "@typeflowai/ui/QuestionTypeSelector";

const questionTypes = [
  { value: "text", label: "Text", icon: <MessageSquareTextIcon className="h-4 w-4" /> },
  { value: "email", label: "Email", icon: <MailIcon className="h-4 w-4" /> },
  { value: "url", label: "URL", icon: <LinkIcon className="h-4 w-4" /> },
  { value: "number", label: "Number", icon: <HashIcon className="h-4 w-4" /> },
  { value: "phone", label: "Phone", icon: <PhoneIcon className="h-4 w-4" /> },
];

interface OpenQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowOpenTextQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowOpenTextQuestion>) => void;
  lastQuestion: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  isInvalid: boolean;
  attributeClasses: TAttributeClass[];
}

export const OpenQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  isInvalid,
  localWorkflow,
  selectedLanguageCode,
  setSelectedLanguageCode,
  attributeClasses,
}: OpenQuestionFormProps): JSX.Element => {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const defaultPlaceholder = getPlaceholderByInputType(question.inputType ?? "text");
  const workflowLanguageCodes = extractLanguageCodes(localWorkflow.languages ?? []);
  const handleInputChange = (inputType: TWorkflowOpenTextQuestionInputType) => {
    const updatedAttributes = {
      inputType: inputType,
      placeholder: createI18nString(getPlaceholderByInputType(inputType), workflowLanguageCodes),
      longAnswer: inputType === "text" ? question.longAnswer : false,
    };
    updateQuestion(questionIdx, updatedAttributes);
  };

  return (
    <form>
      <QuestionFormInput
        id="headline"
        value={question.headline}
        localWorkflow={localWorkflow}
        questionIdx={questionIdx}
        isInvalid={isInvalid}
        updateQuestion={updateQuestion}
        selectedLanguageCode={selectedLanguageCode}
        setSelectedLanguageCode={setSelectedLanguageCode}
        attributeClasses={attributeClasses}
      />

      <div>
        {showSubheader && (
          <div className="inline-flex w-full items-center">
            <div className="w-full">
              <QuestionFormInput
                id="subheader"
                value={question.subheader}
                localWorkflow={localWorkflow}
                questionIdx={questionIdx}
                isInvalid={isInvalid}
                updateQuestion={updateQuestion}
                selectedLanguageCode={selectedLanguageCode}
                setSelectedLanguageCode={setSelectedLanguageCode}
                attributeClasses={attributeClasses}
              />
            </div>

            <TrashIcon
              className="ml-2 mt-10 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
              onClick={() => {
                setShowSubheader(false);
                updateQuestion(questionIdx, { subheader: undefined });
              }}
            />
          </div>
        )}
        {!showSubheader && (
          <Button
            size="sm"
            variant="minimal"
            className="mt-3"
            type="button"
            onClick={() => {
              updateQuestion(questionIdx, {
                subheader: createI18nString("", workflowLanguageCodes),
              });
              setShowSubheader(true);
            }}>
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>
      <div className="mt-2">
        <QuestionFormInput
          id="placeholder"
          value={
            question.placeholder
              ? question.placeholder
              : createI18nString(defaultPlaceholder, workflowLanguageCodes)
          }
          localWorkflow={localWorkflow}
          questionIdx={questionIdx}
          isInvalid={isInvalid}
          updateQuestion={updateQuestion}
          selectedLanguageCode={selectedLanguageCode}
          setSelectedLanguageCode={setSelectedLanguageCode}
          attributeClasses={attributeClasses}
        />
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
};

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
