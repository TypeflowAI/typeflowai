"use client";

// import { useState } from "react";
// import { LocalizedEditor } from "@typeflowai/ee/multiLanguage/components/LocalizedEditor";
import { TWorkflow, TWorkflowCTAQuestion } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { RadioGroup, RadioGroupItem } from "@typeflowai/ui/RadioGroup";

interface CTAQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowCTAQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowCTAQuestion>) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  isInvalid: boolean;
}

export const CTAQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  lastQuestion,
  isPromptVisible,
  isInvalid,
  localWorkflow,
  selectedLanguageCode,
  setSelectedLanguageCode,
}: CTAQuestionFormProps): JSX.Element => {
  // const [firstRender, setFirstRender] = useState(true);

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

      <div className="mt-3">
        <Label htmlFor="subheader">Description</Label>
        <div className="mt-2">
          {/* <LocalizedEditor
            id="subheader"
            value={question.html}
            localWorkflow={localWorkflow}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
            firstRender={firstRender}
            setFirstRender={setFirstRender}
            questionIdx={questionIdx}
          /> */}
        </div>
      </div>

      <RadioGroup
        className="mt-3 flex"
        defaultValue="internal"
        value={question.buttonExternal ? "external" : "internal"}
        onValueChange={(e) => updateQuestion(questionIdx, { buttonExternal: e === "external" })}>
        <div className="flex items-center space-x-2 rounded-lg border border-slate-200 p-3">
          <RadioGroupItem value="internal" id="internal" className="bg-slate-50" />
          <Label htmlFor="internal" className="cursor-pointer">
            Button to continue in workflow
          </Label>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-slate-200 p-3">
          <RadioGroupItem value="external" id="external" className="bg-slate-50" />
          <Label htmlFor="external" className="cursor-pointer">
            Button to link to external URL
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-2 flex justify-between gap-8">
        <div className="flex w-full space-x-2">
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

          {questionIdx !== 0 && (
            <QuestionFormInput
              id="backButtonLabel"
              value={question.backButtonLabel}
              localWorkflow={localWorkflow}
              questionIdx={questionIdx}
              maxLength={48}
              placeholder={"Back"}
              isInvalid={isInvalid}
              updateQuestion={updateQuestion}
              selectedLanguageCode={selectedLanguageCode}
              setSelectedLanguageCode={setSelectedLanguageCode}
            />
          )}
        </div>
      </div>

      {question.buttonExternal && (
        <div className="mt-3 flex-1">
          <Label htmlFor="buttonLabel">Button URL</Label>
          <div className="mt-2">
            <Input
              id="buttonUrl"
              name="buttonUrl"
              value={question.buttonUrl}
              placeholder="https://website.com"
              onChange={(e) => updateQuestion(questionIdx, { buttonUrl: e.target.value })}
            />
          </div>
        </div>
      )}

      {!question.required && (
        <div className="mt-3 flex-1">
          <Label htmlFor="buttonLabel">Skip Button Label</Label>
          <div className="mt-2">
            <QuestionFormInput
              id="dismissButtonLabel"
              value={question.dismissButtonLabel}
              localWorkflow={localWorkflow}
              questionIdx={questionIdx}
              placeholder={"skip"}
              isInvalid={isInvalid}
              updateQuestion={updateQuestion}
              selectedLanguageCode={selectedLanguageCode}
              setSelectedLanguageCode={setSelectedLanguageCode}
            />
          </div>
        </div>
      )}
    </form>
  );
};
