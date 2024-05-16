import {
  CalendarDaysIcon,
  HomeIcon,
  ListIcon,
  MessageSquareTextIcon,
  PhoneIcon,
  PresentationIcon,
  Rows3Icon,
  StarIcon,
} from "lucide-react";
import { RefObject, useEffect, useMemo, useState } from "react";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { replaceRecallInfoWithUnderline } from "@typeflowai/lib/utils/recall";
import { TWorkflow, TWorkflowQuestion } from "@typeflowai/types/workflows";

const questionIconMapping = {
  openText: MessageSquareTextIcon,
  multipleChoiceSingle: Rows3Icon,
  multipleChoiceMulti: ListIcon,
  rating: StarIcon,
  nps: PresentationIcon,
  date: CalendarDaysIcon,
  cal: PhoneIcon,
  address: HomeIcon,
};

interface RecallQuestionSelectProps {
  localWorkflow: TWorkflow;
  questionId: string;
  addRecallQuestion: (question: TWorkflowQuestion) => void;
  setShowQuestionSelect: (show: boolean) => void;
  showQuestionSelect: boolean;
  inputRef: RefObject<HTMLInputElement>;
  recallQuestions: TWorkflowQuestion[];
  selectedLanguageCode: string;
}

export default function RecallQuestionSelect({
  localWorkflow,
  questionId,
  addRecallQuestion,
  setShowQuestionSelect,
  showQuestionSelect,
  inputRef,
  recallQuestions,
  selectedLanguageCode,
}: RecallQuestionSelectProps) {
  const [focusedQuestionIdx, setFocusedQuestionIdx] = useState(0); // New state for managing focus
  const isNotAllowedQuestionType = (question: TWorkflowQuestion) => {
    return (
      question.type === "fileUpload" ||
      question.type === "cta" ||
      question.type === "consent" ||
      question.type === "pictureSelection" ||
      question.type === "cal" ||
      question.type === "matrix"
    );
  };

  const recallQuestionIds = useMemo(() => {
    return recallQuestions.map((recallQuestion) => recallQuestion.id);
  }, [recallQuestions]);

  // function to remove some specific type of questions (fileUpload, imageSelect etc) from the list of questions to recall from and few other checks
  const filteredRecallQuestions = useMemo(() => {
    const idx =
      questionId === "end"
        ? localWorkflow.questions.length
        : localWorkflow.questions.findIndex((recallQuestion) => recallQuestion.id === questionId);
    const filteredQuestions = localWorkflow.questions.filter((question, index) => {
      const notAllowed = isNotAllowedQuestionType(question);
      return (
        !recallQuestionIds.includes(question.id) && !notAllowed && question.id !== questionId && idx > index
      );
    });
    return filteredQuestions;
  }, [localWorkflow.questions, questionId, recallQuestionIds]);

  // function to modify headline (recallInfo to corresponding headline)
  const getRecallHeadline = (question: TWorkflowQuestion): TWorkflowQuestion => {
    let questionTemp = structuredClone(question);
    questionTemp = replaceRecallInfoWithUnderline(questionTemp, selectedLanguageCode);
    return questionTemp;
  };

  // function to handle key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showQuestionSelect) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setFocusedQuestionIdx((prevIdx) => (prevIdx + 1) % filteredRecallQuestions.length);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setFocusedQuestionIdx((prevIdx) =>
            prevIdx === 0 ? filteredRecallQuestions.length - 1 : prevIdx - 1
          );
        } else if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          const selectedQuestion = filteredRecallQuestions[focusedQuestionIdx];
          setShowQuestionSelect(false);
          if (!selectedQuestion) return;
          addRecallQuestion(selectedQuestion);
        }
      }
    };

    const inputElement = inputRef.current;
    inputElement?.addEventListener("keydown", handleKeyPress);

    return () => {
      inputElement?.removeEventListener("keydown", handleKeyPress);
    };
  }, [showQuestionSelect, localWorkflow.questions, focusedQuestionIdx]);

  return (
    <div className="absolute z-30 mt-1 flex max-w-[85%] flex-col overflow-y-auto rounded-md border border-slate-300 bg-slate-50 p-3  text-xs ">
      {filteredRecallQuestions.length === 0 ? (
        <p className="font-medium text-slate-900">There is no information to recall yet 🤷</p>
      ) : (
        <p className="mb-2 font-medium">Recall Information from...</p>
      )}
      <div>
        {filteredRecallQuestions.map((q, idx) => {
          const isFocused = idx === focusedQuestionIdx;
          const IconComponent = questionIconMapping[q.type as keyof typeof questionIconMapping];
          return (
            <div
              key={q.id}
              className={`flex max-w-full cursor-pointer items-center rounded-md px-3 py-2 ${
                isFocused ? "bg-slate-200" : "hover:bg-slate-200 "
              }`}
              onClick={() => {
                addRecallQuestion(q);
                setShowQuestionSelect(false);
              }}>
              <div>{IconComponent && <IconComponent className="mr-2 w-4" />}</div>
              <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {getLocalizedValue(getRecallHeadline(q).headline, selectedLanguageCode)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
