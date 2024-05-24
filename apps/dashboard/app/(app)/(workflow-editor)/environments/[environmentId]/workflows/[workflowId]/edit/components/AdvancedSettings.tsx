import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";

import LogicEditor from "./LogicEditor";
import UpdateQuestionId from "./UpdateQuestionId";

interface AdvancedSettingsProps {
  question: TWorkflowQuestion;
  questionIdx: number;
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
}

export const AdvancedSettings = ({
  question,
  questionIdx,
  localWorkflow,
  setLocalWorkflow,
  updateQuestion,
}: AdvancedSettingsProps) => {
  return (
    <div>
      <div className="mb-4">
        <LogicEditor
          question={question}
          updateQuestion={updateQuestion}
          localWorkflow={localWorkflow}
          questionIdx={questionIdx}
        />
      </div>

      <UpdateQuestionId
        question={question}
        questionIdx={questionIdx}
        localWorkflow={localWorkflow}
        setLocalWorkflow={setLocalWorkflow}
        updateQuestion={updateQuestion}
      />
    </div>
  );
};
