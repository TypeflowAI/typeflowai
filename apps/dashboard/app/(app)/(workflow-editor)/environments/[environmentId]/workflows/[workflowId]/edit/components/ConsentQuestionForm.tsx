"use client";

// import { useState } from "react";
// import { LocalizedEditor } from "@typeflowai/ee/multiLanguage/components/LocalizedEditor";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TWorkflow, TWorkflowConsentQuestion } from "@typeflowai/types/workflows";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";

interface ConsentQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowConsentQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowConsentQuestion>) => void;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  isInvalid: boolean;
  attributeClasses: TAttributeClass[];
}

export const ConsentQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  isInvalid,
  localWorkflow,
  selectedLanguageCode,
  setSelectedLanguageCode,
  attributeClasses,
}: ConsentQuestionFormProps): JSX.Element => {
  // const [firstRender, setFirstRender] = useState(true);

  return (
    <form>
      <QuestionFormInput
        id="headline"
        value={question.headline}
        label={"Question*"}
        localWorkflow={localWorkflow}
        questionIdx={questionIdx}
        isInvalid={isInvalid}
        updateQuestion={updateQuestion}
        selectedLanguageCode={selectedLanguageCode}
        setSelectedLanguageCode={setSelectedLanguageCode}
        attributeClasses={attributeClasses}
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

      <QuestionFormInput
        id="label"
        label="Checkbox Label*"
        placeholder="I agree to the terms and conditions"
        value={question.label}
        localWorkflow={localWorkflow}
        questionIdx={questionIdx}
        isInvalid={isInvalid}
        updateQuestion={updateQuestion}
        selectedLanguageCode={selectedLanguageCode}
        setSelectedLanguageCode={setSelectedLanguageCode}
        attributeClasses={attributeClasses}
      />
    </form>
  );
};
