import QuestionFormInput from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/QuestionFormInput";
import { FaceSmileIcon, HashtagIcon, StarIcon } from "@heroicons/react/24/outline";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { TWorkflow, TWorkflowRatingQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

import Dropdown from "./RatingTypeDropdown";

interface RatingQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowRatingQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  isInValid: boolean;
}

export default function RatingQuestionForm({
  question,
  questionIdx,
  updateQuestion,
  lastQuestion,
  isPromptVisible,
  isInValid,
  localWorkflow,
}: RatingQuestionFormProps) {
  const [showSubheader, setShowSubheader] = useState(!!question.subheader);
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

      <div className="mt-3 flex justify-between gap-8">
        <div className="flex-1">
          <Label htmlFor="subheader">Scale</Label>
          <div className="mt-2">
            <Dropdown
              options={[
                { label: "Number", value: "number", icon: HashtagIcon },
                { label: "Star", value: "star", icon: StarIcon },
                { label: "Smiley", value: "smiley", icon: FaceSmileIcon },
              ]}
              defaultValue={question.scale || "number"}
              onSelect={(option) => updateQuestion(questionIdx, { scale: option.value })}
            />
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="subheader">Range</Label>
          <div className="mt-2">
            <Dropdown
              options={[
                { label: "5 points (recommended)", value: 5 },
                { label: "3 points", value: 3 },
                { label: "4 points", value: 4 },
                { label: "7 points", value: 7 },
                { label: "10 points", value: 10 },
              ]}
              /* disabled={workflow.status !== "draft"} */
              defaultValue={question.range || 5}
              onSelect={(option) => updateQuestion(questionIdx, { range: option.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between gap-8">
        <div className="flex-1">
          <Label htmlFor="lowerLabel">Lower label</Label>
          <div className="mt-2">
            <Input
              id="lowerLabel"
              name="lowerLabel"
              placeholder="Not good"
              value={question.lowerLabel}
              onChange={(e) => updateQuestion(questionIdx, { lowerLabel: e.target.value })}
            />
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="upperLabel">Upper label</Label>
          <div className="mt-2">
            <Input
              id="upperLabel"
              name="upperLabel"
              placeholder="Very satisfied"
              value={question.upperLabel}
              onChange={(e) => updateQuestion(questionIdx, { upperLabel: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        {!question.required && (
          <div className="flex-1">
            <Label htmlFor="buttonLabel">Dismiss Button Label</Label>
            <div className="mt-2">
              <Input
                id="dismissButtonLabel"
                name="dismissButtonLabel"
                value={question.buttonLabel}
                placeholder={lastQuestion ? (isPromptVisible ? "Next" : "Finish") : "Next"}
                onChange={(e) => updateQuestion(questionIdx, { buttonLabel: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
