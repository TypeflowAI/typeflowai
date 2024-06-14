import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

import QuestionCard from "./QuestionCard";

interface QuestionsDraggableProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  product: TProduct;
  moveQuestion: (questionIndex: number, up: boolean) => void;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  deleteQuestion: (questionIdx: number) => void;
  duplicateQuestion: (questionIdx: number) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  invalidQuestions: string[] | null;
  internalQuestionIdMap: Record<string, string>;
  isPromptVisible: boolean;
  attributeClasses: TAttributeClass[];
}

export const QuestionsDroppable = ({
  activeQuestionId,
  deleteQuestion,
  duplicateQuestion,
  invalidQuestions,
  localWorkflow,
  setLocalWorkflow,
  moveQuestion,
  product,
  selectedLanguageCode,
  setActiveQuestionId,
  setSelectedLanguageCode,
  updateQuestion,
  internalQuestionIdMap,
  isPromptVisible,
  attributeClasses,
}: QuestionsDraggableProps) => {
  return (
    <div className="group mb-5 grid w-full gap-5">
      <SortableContext items={localWorkflow.questions} strategy={verticalListSortingStrategy}>
        {localWorkflow.questions.map((question, questionIdx) => (
          <QuestionCard
            key={internalQuestionIdMap[question.id]}
            localWorkflow={localWorkflow}
            setLocalWorkflow={setLocalWorkflow}
            product={product}
            question={question}
            questionIdx={questionIdx}
            moveQuestion={moveQuestion}
            updateQuestion={updateQuestion}
            duplicateQuestion={duplicateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
            deleteQuestion={deleteQuestion}
            activeQuestionId={activeQuestionId}
            setActiveQuestionId={setActiveQuestionId}
            lastQuestion={questionIdx === localWorkflow.questions.length - 1}
            isInvalid={invalidQuestions ? invalidQuestions.includes(question.id) : false}
            isPromptVisible={isPromptVisible}
            attributeClasses={attributeClasses}
          />
        ))}
      </SortableContext>
    </div>
  );
};
