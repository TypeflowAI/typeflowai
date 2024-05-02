import QuestionFormInput from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/QuestionFormInput";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { TWorkflow, TWorkflowCalQuestion } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

interface CalQuestionFormProps {
  localWorkflow: TWorkflow;
  question: TWorkflowCalQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  isInValid: boolean;
}

export default function CalQuestionForm({
  localWorkflow,
  question,
  questionIdx,
  updateQuestion,
  isInValid,
}: CalQuestionFormProps): JSX.Element {
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
        <div className="mt-3">
          <Label htmlFor="calUserName">Add your Cal.com username or username/event</Label>
          <div className="mt-2">
            <Input
              id="calUserName"
              name="calUserName"
              value={question.calUserName}
              onChange={(e) => updateQuestion(questionIdx, { calUserName: e.target.value })}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
