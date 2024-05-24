"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import { createI18nString, extractLanguageCodes } from "@typeflowai/lib/i18n/utils";
import { TWorkflow, TWorkflowNPSQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";

interface NPSQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowNPSQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowNPSQuestion>) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  isInvalid: boolean;
}

export const NPSQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  lastQuestion,
  isPromptVisible,
  isInvalid,
  localWorkflow,
  selectedLanguageCode,
  setSelectedLanguageCode,
}: NPSQuestionFormProps): JSX.Element => {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
  const workflowLanguageCodes = extractLanguageCodes(localWorkflow.languages);
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
      />

      <div>
        {showSubheader && (
          <div className="mt-2 inline-flex w-full items-center">
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
            {" "}
            <PlusIcon className="mr-1 h-4 w-4" />
            Add Description
          </Button>
        )}
      </div>

      <div className="mt-3 flex justify-between space-x-2">
        <div className="w-full">
          <QuestionFormInput
            id="lowerLabel"
            value={question.lowerLabel}
            localWorkflow={localWorkflow}
            questionIdx={questionIdx}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
          />
        </div>
        <div className="w-full">
          <QuestionFormInput
            id="upperLabel"
            value={question.upperLabel}
            localWorkflow={localWorkflow}
            questionIdx={questionIdx}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
          />
        </div>
      </div>

      {!question.required && (
        <div className="mt-3">
          <QuestionFormInput
            id="buttonLabel"
            value={question.buttonLabel}
            localWorkflow={localWorkflow}
            questionIdx={questionIdx}
            maxLength={48}
            placeholder={lastQuestion ? (isPromptVisible ? "Next" : "Finish") : "Next"}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
          />
        </div>
      )}
    </form>
  );
};
