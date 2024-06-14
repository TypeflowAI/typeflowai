import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { createI18nString } from "@typeflowai/lib/i18n/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import {
  TI18nString,
  TWorkflow,
  TWorkflowLanguage,
  TWorkflowMultipleChoiceQuestion,
} from "@typeflowai/types/workflows";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";

import { isLabelValidForAllLanguages } from "../lib/validation";

interface ChoiceProps {
  choice: {
    id: string;
    label: Record<string, string>;
  };
  choiceIdx: number;
  questionIdx: number;
  updateChoice: (choiceIdx: number, updatedAttributes: { label: TI18nString }) => void;
  deleteChoice: (choiceIdx: number) => void;
  addChoice: (choiceIdx: number) => void;
  setisInvalidValue: (value: string | null) => void;
  isInvalid: boolean;
  localWorkflow: TWorkflow;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  workflowLanguages: TWorkflowLanguage[];
  findDuplicateLabel: () => string | null;
  question: TWorkflowMultipleChoiceQuestion;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TWorkflowMultipleChoiceQuestion>) => void;
  workflowLanguageCodes: string[];
  attributeClasses: TAttributeClass[];
}

export const SelectQuestionChoice = ({
  addChoice,
  choice,
  choiceIdx,
  deleteChoice,
  isInvalid,
  localWorkflow,
  questionIdx,
  selectedLanguageCode,
  setSelectedLanguageCode,
  setisInvalidValue,
  workflowLanguages,
  updateChoice,
  findDuplicateLabel,
  question,
  workflowLanguageCodes,
  updateQuestion,
  attributeClasses,
}: ChoiceProps) => {
  const isDragDisabled = choice.id === "other";
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: choice.id,
    disabled: isDragDisabled,
  });

  const style = {
    transition: transition ?? "transform 100ms ease",
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div className="flex w-full items-center gap-2" ref={setNodeRef} style={style}>
      {/* drag handle */}
      <div
        className={cn("flex items-center", choice.id === "other" && "invisible")}
        {...listeners}
        {...attributes}>
        <GripVerticalIcon className="mt-3 h-4 w-4 cursor-move text-slate-400" />
      </div>

      <div className="flex w-full space-x-2">
        <QuestionFormInput
          key={choice.id}
          id={`choice-${choiceIdx}`}
          placeholder={choice.id === "other" ? "Other" : `Option ${choiceIdx + 1}`}
          localWorkflow={localWorkflow}
          questionIdx={questionIdx}
          value={choice.label}
          onBlur={() => {
            const duplicateLabel = findDuplicateLabel();
            if (duplicateLabel) {
              toast.error("Duplicate choices");
              setisInvalidValue(duplicateLabel);
            } else {
              setisInvalidValue(null);
            }
          }}
          updateChoice={updateChoice}
          selectedLanguageCode={selectedLanguageCode}
          setSelectedLanguageCode={setSelectedLanguageCode}
          isInvalid={
            isInvalid && !isLabelValidForAllLanguages(question.choices[choiceIdx].label, workflowLanguages)
          }
          className={`${choice.id === "other" ? "border border-dashed" : ""} mt-0`}
          attributeClasses={attributeClasses}
        />
        {choice.id === "other" && (
          <QuestionFormInput
            id="otherOptionPlaceholder"
            localWorkflow={localWorkflow}
            placeholder={"Please specify"}
            questionIdx={questionIdx}
            value={
              question.otherOptionPlaceholder
                ? question.otherOptionPlaceholder
                : createI18nString("Please specify", workflowLanguageCodes)
            }
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
            setSelectedLanguageCode={setSelectedLanguageCode}
            isInvalid={
              isInvalid && !isLabelValidForAllLanguages(question.choices[choiceIdx].label, workflowLanguages)
            }
            className="border border-dashed"
            attributeClasses={attributeClasses}
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        {question.choices && question.choices.length > 2 && (
          <TrashIcon
            className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
            onClick={() => deleteChoice(choiceIdx)}
          />
        )}
        <div className="h-4 w-4">
          {choice.id !== "other" && (
            <PlusIcon
              className="h-full w-full cursor-pointer text-slate-400 hover:text-slate-500"
              onClick={() => addChoice(choiceIdx)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
