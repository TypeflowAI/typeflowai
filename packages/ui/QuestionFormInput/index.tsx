"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { ImagePlusIcon } from "lucide-react";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  extractLanguageCodes, // getEnabledLanguages,
  getLocalizedValue,
} from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { useSyncScroll } from "@typeflowai/lib/utils/hooks/useSyncScroll";
import {
  extractId,
  extractRecallInfo,
  findRecallInfoById,
  getFallbackValues,
  getRecallItems,
  headlineToRecall,
  recallToHeadline,
  replaceRecallInfoWithUnderline,
} from "@typeflowai/lib/utils/recall";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import {
  TI18nString,
  TWorkflow,
  TWorkflowChoice,
  TWorkflowQuestion,
  TWorkflowRecallItem,
} from "@typeflowai/types/workflows";
// import { LanguageIndicator } from "../../ee/multi-language/components/language-indicator";
import { createI18nString } from "../../lib/i18n/utils";
import { FileInput } from "../FileInput";
import { Input } from "../Input";
import { Label } from "../Label";
import { FallbackInput } from "./components/FallbackInput";
import { RecallItemSelect } from "./components/RecallItemSelect";
import {
  determineImageUploaderVisibility,
  getCardText,
  getChoiceLabel,
  getIndex,
  getMatrixLabel,
  getPlaceHolderById,
  isValueIncomplete,
} from "./utils";

interface QuestionFormInputProps {
  id: string;
  value: TI18nString | undefined;
  localWorkflow: TWorkflow;
  questionIdx: number;
  updateQuestion?: (questionIdx: number, data: Partial<TWorkflowQuestion>) => void;
  updateWorkflow?: (data: Partial<TWorkflowQuestion>) => void;
  updateChoice?: (choiceIdx: number, data: Partial<TWorkflowChoice>) => void;
  updateMatrixLabel?: (index: number, type: "row" | "column", data: Partial<TWorkflowQuestion>) => void;
  isInvalid: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (languageCode: string) => void;
  label: string;
  maxLength?: number;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
  attributeClasses: TAttributeClass[];
}

export const QuestionFormInput = ({
  id,
  value,
  localWorkflow,
  questionIdx,
  updateQuestion,
  updateWorkflow,
  updateChoice,
  updateMatrixLabel,
  isInvalid,
  label,
  selectedLanguageCode,
  // setSelectedLanguageCode,
  maxLength,
  placeholder,
  onBlur,
  className,
  attributeClasses,
}: QuestionFormInputProps) => {
  const question: TWorkflowQuestion = localWorkflow.questions[questionIdx];
  const isChoice = id.includes("choice");
  const isMatrixLabelRow = id.includes("row");
  const isMatrixLabelColumn = id.includes("column");
  const isThankYouCard = questionIdx === localWorkflow.questions.length;
  const isWelcomeCard = questionIdx === -1;
  const index = getIndex(id, isChoice || isMatrixLabelColumn || isMatrixLabelRow);

  const questionId = useMemo(() => {
    return isWelcomeCard ? "start" : isThankYouCard ? "end" : question.id;
  }, [isWelcomeCard, isThankYouCard, question?.id]);

  // const enabledLanguages = useMemo(
  //   () => getEnabledLanguages(localWorkflow.languages ?? []),
  //   [localWorkflow.languages]
  // );

  const workflowLanguageCodes = useMemo(
    () => extractLanguageCodes(localWorkflow.languages),
    [localWorkflow.languages]
  );
  const isTranslationIncomplete = useMemo(
    () => isValueIncomplete(id, isInvalid, workflowLanguageCodes, value),
    [value, id, isInvalid, workflowLanguageCodes]
  );

  const getElementTextBasedOnType = (): TI18nString => {
    if (isChoice && typeof index === "number") {
      return getChoiceLabel(question, index, workflowLanguageCodes);
    }

    if (isThankYouCard || isWelcomeCard) {
      return getCardText(localWorkflow, id, isThankYouCard, workflowLanguageCodes);
    }

    if ((isMatrixLabelColumn || isMatrixLabelRow) && typeof index === "number") {
      return getMatrixLabel(question, index, workflowLanguageCodes, isMatrixLabelRow ? "row" : "column");
    }

    return (
      (question && (question[id as keyof TWorkflowQuestion] as TI18nString)) ||
      createI18nString("", workflowLanguageCodes)
    );
  };

  const [text, setText] = useState(getElementTextBasedOnType());
  const [renderedText, setRenderedText] = useState<JSX.Element[]>();
  const [showImageUploader, setShowImageUploader] = useState<boolean>(
    determineImageUploaderVisibility(questionIdx, localWorkflow)
  );
  const [showRecallItemSelect, setShowRecallItemSelect] = useState(false);
  const [showFallbackInput, setShowFallbackInput] = useState(false);
  const [recallItems, setRecallItems] = useState<TWorkflowRecallItem[]>(
    getLocalizedValue(text, selectedLanguageCode).includes("#recall:")
      ? getRecallItems(
          getLocalizedValue(text, selectedLanguageCode),
          localWorkflow,
          selectedLanguageCode,
          attributeClasses
        )
      : []
  );
  const [fallbacks, setFallbacks] = useState<{ [type: string]: string }>(
    getLocalizedValue(text, selectedLanguageCode).includes("/fallback:")
      ? getFallbackValues(getLocalizedValue(text, selectedLanguageCode))
      : {}
  );

  const highlightContainerRef = useRef<HTMLInputElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredRecallItems = Array.from(new Set(recallItems.map((q) => q.id))).map((id) => {
    return recallItems.find((q) => q.id === id);
  });

  // Hook to synchronize the horizontal scroll position of highlightContainerRef and inputRef.
  useSyncScroll(highlightContainerRef, inputRef);

  useEffect(() => {
    if (id === "headline" || id === "subheader") {
      checkForRecallSymbol();
    }
    // Generates an array of headlines from recallItems, replacing nested recall questions with '___' .
    const recallItemLabels = recallItems.flatMap((recallItem) => {
      if (!recallItem.label.includes("#recall:")) {
        return [recallItem.label];
      }
      const recallItemLabel = recallItem.label;
      const recallInfo = extractRecallInfo(recallItemLabel);

      if (recallInfo) {
        const recallItemId = extractId(recallInfo);
        const recallQuestion = localWorkflow.questions.find((question) => question.id === recallItemId);

        if (recallQuestion) {
          return [recallItemLabel.replace(recallInfo, `___`)];
        }
      }
      return [];
    });

    // Constructs an array of JSX elements representing segmented parts of text, interspersed with special formatted spans for recall headlines.
    const processInput = (): JSX.Element[] => {
      const parts: JSX.Element[] = [];
      let remainingText = recallToHeadline(
        text,
        localWorkflow,
        false,
        selectedLanguageCode,
        attributeClasses
      )[selectedLanguageCode];
      filterRecallItems(remainingText);
      recallItemLabels.forEach((label) => {
        const index = remainingText.indexOf("@" + label);
        if (index !== -1) {
          if (index > 0) {
            parts.push(
              <span key={parts.length} className="whitespace-pre">
                {remainingText.substring(0, index)}
              </span>
            );
          }
          parts.push(
            <span
              className="z-30 flex h-fit cursor-pointer justify-center whitespace-pre rounded-md bg-slate-100 text-sm text-transparent"
              key={parts.length}>
              {"@" + label}
            </span>
          );
          remainingText = remainingText.substring(index + label.length + 1);
        }
      });
      if (remainingText?.length) {
        parts.push(
          <span className="whitespace-pre" key={parts.length}>
            {remainingText}
          </span>
        );
      }
      return parts;
    };
    setRenderedText(processInput());
  }, [text]);

  useEffect(() => {
    if (fallbackInputRef.current) {
      fallbackInputRef.current.focus();
    }
  }, [showFallbackInput]);

  useEffect(() => {
    setText(getElementTextBasedOnType());
  }, [localWorkflow]);

  const checkForRecallSymbol = () => {
    const pattern = /(^|\s)@(\s|$)/;
    if (pattern.test(getLocalizedValue(text, selectedLanguageCode))) {
      setShowRecallItemSelect(true);
    } else {
      setShowRecallItemSelect(false);
    }
  };

  // Adds a new recall question to the recallItems array, updates fallbacks, modifies the text with recall details.
  const addRecallItem = (recallItem: TWorkflowRecallItem) => {
    if (recallItem.label.trim() === "") {
      toast.error("Cannot add question with empty headline as recall");
      return;
    }
    let recallItemTemp = structuredClone(recallItem);
    recallItemTemp.label = replaceRecallInfoWithUnderline(recallItem.label);
    setRecallItems((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, recallItemTemp];
      return updatedQuestions;
    });
    if (!Object.keys(fallbacks).includes(recallItem.id)) {
      setFallbacks((prevFallbacks) => ({
        ...prevFallbacks,
        [recallItem.id]: "",
      }));
    }
    setShowRecallItemSelect(false);
    let modifiedHeadlineWithId = { ...getElementTextBasedOnType() };
    modifiedHeadlineWithId[selectedLanguageCode] = getLocalizedValue(
      modifiedHeadlineWithId,
      selectedLanguageCode
    ).replace(/(?<=^|\s)@(?=\s|$)/g, `#recall:${recallItem.id}/fallback:# `);
    handleUpdate(getLocalizedValue(modifiedHeadlineWithId, selectedLanguageCode));
    const modifiedHeadlineWithName = recallToHeadline(
      modifiedHeadlineWithId,
      localWorkflow,
      false,
      selectedLanguageCode,
      attributeClasses
    );
    setText(modifiedHeadlineWithName);
    setShowFallbackInput(true);
  };

  // Filters and updates the list of recall questions based on their presence in the given text, also managing related text and fallback states.
  const filterRecallItems = (remainingText: string) => {
    let includedRecallItems: TWorkflowRecallItem[] = [];
    recallItems.forEach((recallItem) => {
      if (remainingText.includes(`@${recallItem.label}`)) {
        includedRecallItems.push(recallItem);
      } else {
        const recallItemToRemove = recallItem.label.slice(0, -1);
        const newText = { ...text };
        newText[selectedLanguageCode] = text[selectedLanguageCode].replace(`@${recallItemToRemove}`, "");
        setText(newText);
        handleUpdate(text[selectedLanguageCode].replace(`@${recallItemToRemove}`, ""));
        let updatedFallback = { ...fallbacks };
        delete updatedFallback[recallItem.id];
        setFallbacks(updatedFallback);
      }
    });
    setRecallItems(includedRecallItems);
  };

  const addFallback = () => {
    let headlineWithFallback = getElementTextBasedOnType();
    filteredRecallItems.forEach((recallQuestion) => {
      if (recallQuestion) {
        const recallInfo = findRecallInfoById(
          getLocalizedValue(headlineWithFallback, selectedLanguageCode),
          recallQuestion!.id
        );
        if (recallInfo) {
          let fallBackValue = fallbacks[recallQuestion.id].trim();
          fallBackValue = fallBackValue.replace(/ /g, "nbsp");
          let updatedFallback = { ...fallbacks };
          updatedFallback[recallQuestion.id] = fallBackValue;
          setFallbacks(updatedFallback);
          headlineWithFallback[selectedLanguageCode] = getLocalizedValue(
            headlineWithFallback,
            selectedLanguageCode
          ).replace(recallInfo, `#recall:${recallQuestion?.id}/fallback:${fallBackValue}#`);
          handleUpdate(getLocalizedValue(headlineWithFallback, selectedLanguageCode));
        }
      }
    });
    setShowFallbackInput(false);
    inputRef.current?.focus();
  };

  // updation of questions, WelcomeCard, ThankYouCard and choices is done in a different manner,
  // questions -> updateQuestion
  // thankYouCard, welcomeCard-> updateWorkflow
  // choice -> updateChoice
  // matrixLabel -> updateMatrixLabel

  const handleUpdate = (updatedText: string) => {
    const translatedText = createUpdatedText(updatedText);

    if (isChoice) {
      updateChoiceDetails(translatedText);
    } else if (isThankYouCard || isWelcomeCard) {
      updateWorkflowDetails(translatedText);
    } else if (isMatrixLabelRow || isMatrixLabelColumn) {
      updateMatrixLabelDetails(translatedText);
    } else {
      updateQuestionDetails(translatedText);
    }
  };

  const createUpdatedText = (updatedText: string): TI18nString => {
    return {
      ...getElementTextBasedOnType(),
      [selectedLanguageCode]: updatedText,
    };
  };

  const updateChoiceDetails = (translatedText: TI18nString) => {
    if (updateChoice && typeof index === "number") {
      updateChoice(index, { label: translatedText });
    }
  };

  const updateWorkflowDetails = (translatedText: TI18nString) => {
    if (updateWorkflow) {
      updateWorkflow({ [id]: translatedText });
    }
  };

  const updateMatrixLabelDetails = (translatedText: TI18nString) => {
    if (updateMatrixLabel && typeof index === "number") {
      updateMatrixLabel(index, isMatrixLabelRow ? "row" : "column", translatedText);
    }
  };

  const updateQuestionDetails = (translatedText: TI18nString) => {
    if (updateQuestion) {
      updateQuestion(questionIdx, { [id]: translatedText });
    }
  };

  const getFileUrl = () => {
    if (isThankYouCard) return localWorkflow.thankYouCard.imageUrl;
    else if (isWelcomeCard) return localWorkflow.welcomeCard.fileUrl;
    else return question.imageUrl;
  };

  const getVideoUrl = () => {
    if (isThankYouCard) return localWorkflow.thankYouCard.videoUrl;
    else if (isWelcomeCard) return localWorkflow.welcomeCard.videoUrl;
    else return question.videoUrl;
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mb-2 mt-3">
          <Label htmlFor={id}>{label}</Label>
        </div>

        <div className="flex flex-col gap-4 bg-white">
          {showImageUploader && id === "headline" && (
            <FileInput
              id="question-image"
              allowedFileExtensions={["png", "jpeg", "jpg"]}
              environmentId={localWorkflow.environmentId}
              onFileUpload={(url: string[] | undefined, fileType: "image" | "video") => {
                if (url) {
                  const update =
                    fileType === "video"
                      ? { videoUrl: url[0], imageUrl: "" }
                      : { imageUrl: url[0], videoUrl: "" };
                  if (isThankYouCard && updateWorkflow) {
                    updateWorkflow(update);
                  } else if (updateQuestion) {
                    updateQuestion(questionIdx, update);
                  }
                }
              }}
              fileUrl={getFileUrl()}
              videoUrl={getVideoUrl()}
              isVideoAllowed={true}
            />
          )}
          <div className="flex items-center space-x-2">
            <div className="group relative w-full ">
              <div className="h-10 w-full "></div>
              <div
                id="wrapper"
                ref={highlightContainerRef}
                className="no-scrollbar absolute top-0 z-0 mt-0.5 flex h-10 w-full overflow-scroll whitespace-nowrap px-3 py-2 text-center text-sm text-transparent ">
                {renderedText}
              </div>
              {getLocalizedValue(getElementTextBasedOnType(), selectedLanguageCode).includes("recall:") && (
                <button
                  className="fixed right-14 hidden items-center rounded-b-lg bg-slate-100 px-2.5 py-1 text-xs hover:bg-slate-200 group-hover:flex"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowFallbackInput(true);
                  }}>
                  Edit Recall
                  <PencilIcon className="ml-2 h-3 w-3" />
                </button>
              )}
              <Input
                key={`${questionId}-${id}-${selectedLanguageCode}`}
                className={`absolute top-0 text-black caret-black ${localWorkflow.languages?.length > 1 ? "pr-24" : ""} ${className}`}
                placeholder={placeholder ? placeholder : getPlaceHolderById(id)}
                id={id}
                name={id}
                aria-label={label}
                autoComplete={showRecallItemSelect ? "off" : "on"}
                value={
                  recallToHeadline(text, localWorkflow, false, selectedLanguageCode, attributeClasses)[
                    selectedLanguageCode
                  ]
                }
                ref={inputRef}
                onBlur={onBlur}
                onChange={(e) => {
                  let translatedText = {
                    ...getElementTextBasedOnType(),
                    [selectedLanguageCode]: e.target.value,
                  };
                  setText(
                    recallToHeadline(
                      translatedText,
                      localWorkflow,
                      false,
                      selectedLanguageCode,
                      attributeClasses
                    )
                  );
                  handleUpdate(headlineToRecall(e.target.value, recallItems, fallbacks));
                }}
                maxLength={maxLength ?? undefined}
                isInvalid={
                  isInvalid &&
                  text[selectedLanguageCode]?.trim() === "" &&
                  localWorkflow.languages?.length > 1 &&
                  isTranslationIncomplete
                }
              />
              {/* {enabledLanguages.length > 1 && (
                <LanguageIndicator
                  selectedLanguageCode={selectedLanguageCode}
                  workflowLanguages={enabledLanguages}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                />
              )} */}
              {!showRecallItemSelect && showFallbackInput && recallItems.length > 0 && (
                <FallbackInput
                  filteredRecallItems={filteredRecallItems}
                  fallbacks={fallbacks}
                  setFallbacks={setFallbacks}
                  fallbackInputRef={fallbackInputRef}
                  addFallback={addFallback}
                />
              )}
            </div>
            {id === "headline" && !isWelcomeCard && (
              <ImagePlusIcon
                aria-label="Toggle image uploader"
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                onClick={() => setShowImageUploader((prev) => !prev)}
              />
            )}
            {id === "subheader" && question && question.subheader !== undefined && (
              <TrashIcon
                className="ml-2 h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-500"
                onClick={() => {
                  if (updateQuestion) {
                    updateQuestion(questionIdx, { subheader: undefined });
                  }
                }}
              />
            )}
          </div>
        </div>
        {showRecallItemSelect && (
          <RecallItemSelect
            localWorkflow={localWorkflow}
            questionId={questionId}
            addRecallItem={addRecallItem}
            setShowRecallItemSelect={setShowRecallItemSelect}
            recallItems={recallItems}
            selectedLanguageCode={selectedLanguageCode}
            hiddenFields={localWorkflow.hiddenFields}
            attributeClasses={attributeClasses}
          />
        )}
      </div>
      {selectedLanguageCode !== "default" && value && typeof value["default"] !== undefined && (
        <div className="mt-1 text-xs text-gray-500">
          <strong>Translate:</strong>{" "}
          {recallToHeadline(value, localWorkflow, false, "default", attributeClasses)["default"]}
        </div>
      )}
      {selectedLanguageCode === "default" &&
        localWorkflow.languages?.length > 1 &&
        isTranslationIncomplete && (
          <div className="mt-1 text-xs text-red-400">Contains Incomplete translations</div>
        )}
    </div>
  );
};
QuestionFormInput.displayName = "QuestionFormInput";
