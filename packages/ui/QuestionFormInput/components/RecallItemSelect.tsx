import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {
  CalendarDaysIcon,
  EyeOffIcon,
  HomeIcon,
  ListIcon,
  MessageSquareTextIcon,
  PhoneIcon,
  PresentationIcon,
  Rows3Icon,
  StarIcon,
  TagIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { replaceRecallInfoWithUnderline } from "@typeflowai/lib/utils/recall";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import {
  TWorkflow,
  TWorkflowHiddenFields,
  TWorkflowQuestion,
  TWorkflowRecallItem,
} from "@typeflowai/types/workflows";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../DropdownMenu";
import { Input } from "../../Input";

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

interface RecallItemSelectProps {
  localWorkflow: TWorkflow;
  questionId: string;
  addRecallItem: (question: TWorkflowRecallItem) => void;
  setShowRecallItemSelect: (show: boolean) => void;
  recallItems: TWorkflowRecallItem[];
  selectedLanguageCode: string;
  hiddenFields: TWorkflowHiddenFields;
  attributeClasses: TAttributeClass[];
}

export const RecallItemSelect = ({
  localWorkflow,
  questionId,
  addRecallItem,
  setShowRecallItemSelect,
  recallItems,
  selectedLanguageCode,
  attributeClasses,
}: RecallItemSelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const isNotAllowedQuestionType = (question: TWorkflowQuestion): boolean => {
    return (
      question.type === "fileUpload" ||
      question.type === "cta" ||
      question.type === "consent" ||
      question.type === "pictureSelection" ||
      question.type === "cal" ||
      question.type === "matrix"
    );
  };

  const recallItemIds = useMemo(() => {
    return recallItems.map((recallItem) => recallItem.id);
  }, [recallItems]);

  const hiddenFieldRecallItems = useMemo(() => {
    if (localWorkflow.type !== "link") return [];
    if (localWorkflow.hiddenFields.fieldIds) {
      return localWorkflow.hiddenFields.fieldIds
        .filter((hiddenFieldId) => {
          return !recallItemIds.includes(hiddenFieldId);
        })
        .map((hiddenFieldId) => ({
          id: hiddenFieldId,
          label: hiddenFieldId,
          type: "hiddenField" as const,
        }));
    }
    return [];
  }, [localWorkflow.hiddenFields]);

  const attributeClassRecallItems = useMemo(() => {
    if (localWorkflow.type !== "app") return [];
    return attributeClasses
      .filter((attributeClass) => !recallItemIds.includes(attributeClass.name.replaceAll(" ", "nbsp")))
      .map((attributeClass) => {
        return {
          id: attributeClass.name.replaceAll(" ", "nbsp"),
          label: attributeClass.name,
          type: "attributeClass" as const,
        };
      });
  }, [attributeClasses]);

  const workflowQuestionRecallItems = useMemo(() => {
    const idx =
      questionId === "end"
        ? localWorkflow.questions.length
        : localWorkflow.questions.findIndex((recallQuestion) => recallQuestion.id === questionId);
    const filteredQuestions = localWorkflow.questions
      .filter((question, index) => {
        const notAllowed = isNotAllowedQuestionType(question);
        return (
          !recallItemIds.includes(question.id) && !notAllowed && question.id !== questionId && idx > index
        );
      })
      .map((question) => {
        return { id: question.id, label: question.headline[selectedLanguageCode], type: "question" as const };
      });

    return filteredQuestions;
  }, [localWorkflow.questions, questionId, recallItemIds]);

  const filteredRecallItems: TWorkflowRecallItem[] = useMemo(() => {
    return [...workflowQuestionRecallItems, ...hiddenFieldRecallItems, ...attributeClassRecallItems].filter(
      (recallItems) => {
        if (searchValue.trim() === "") return true;
        else {
          return recallItems.label.toLowerCase().startsWith(searchValue.toLowerCase());
        }
      }
    );
  }, [workflowQuestionRecallItems, hiddenFieldRecallItems, attributeClassRecallItems, searchValue]);

  // function to modify headline (recallInfo to corresponding headline)
  const getRecallLabel = (label: string): string => {
    return replaceRecallInfoWithUnderline(label);
  };

  const getQuestionIcon = (recallItem: TWorkflowRecallItem) => {
    switch (recallItem.type) {
      case "question":
        const question = localWorkflow.questions.find((question) => question.id === recallItem.id);
        if (question) {
          return questionIconMapping[question?.type as keyof typeof questionIconMapping];
        }
      case "hiddenField":
        return EyeOffIcon;
      case "attributeClass":
        return TagIcon;
    }
  };

  return (
    <>
      <DropdownMenu defaultOpen={true} modal={false}>
        <DropdownMenuTrigger className="z-10 cursor-pointer" asChild>
          <div className="flex h-0 w-full items-center justify-between overflow-hidden" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 bg-slate-50 text-slate-700" align="start" side="bottom">
          <p className="m-2 text-sm font-medium">Recall Information from...</p>
          <Input
            id="recallItemSearchInput"
            placeholder="Search options"
            className="mb-1 w-full bg-white"
            onChange={(e) => setSearchValue(e.target.value)}
            autoFocus={true}
            value={searchValue}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                document.getElementById("recallItem-0")?.focus();
              }
            }}
          />
          <div className="max-h-72 overflow-y-auto overflow-x-hidden">
            {filteredRecallItems.map((recallItem, index) => {
              const IconComponent = getQuestionIcon(recallItem);
              return (
                <DropdownMenuItem
                  id={"recallItem-" + index}
                  key={recallItem.id}
                  title={recallItem.label}
                  onSelect={() => {
                    addRecallItem({ id: recallItem.id, label: recallItem.label, type: recallItem.type });
                    setShowRecallItemSelect(false);
                  }}
                  autoFocus={false}
                  className="flex w-full cursor-pointer rounded-md p-2 focus:bg-slate-200 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" && index === 0) {
                      document.getElementById("recallItemSearchInput")?.focus();
                    } else if (e.key === "ArrowDown" && index === filteredRecallItems.length - 1) {
                      document.getElementById("recallItemSearchInput")?.focus();
                    }
                  }}>
                  <div>{IconComponent && <IconComponent className="mr-2 w-4" />}</div>
                  <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                    {getRecallLabel(recallItem.label)}
                  </div>
                </DropdownMenuItem>
              );
            })}
            {filteredRecallItems.length === 0 && (
              <p className="p-2 text-sm font-medium text-slate-700">No recall items found 🤷</p>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
