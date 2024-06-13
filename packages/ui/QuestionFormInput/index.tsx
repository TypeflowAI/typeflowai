"use client";

import { PencilIcon } from "lucide-react";
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
  getRecallQuestions,
  headlineToRecall,
  recallToHeadline,
  replaceRecallInfoWithUnderline,
} from "@typeflowai/lib/utils/recall";
import { TI18nString, TWorkflow, TWorkflowChoice, TWorkflowQuestion } from "@typeflowai/types/workflows";

// import { LanguageIndicator } from "../../ee/multiLanguage/components/LanguageIndicator";
import { createI18nString } from "../../lib/i18n/utils";
import { FileInput } from "../FileInput";
import { Input } from "../Input";
import { Label } from "../Label";
import { FallbackInput } from "./components/FallbackInput";
import RecallQuestionSelect from "./components/RecallQuestionSelect";
import { isValueIncomplete } from "./lib/utils";
import {
  determineImageUploaderVisibility,
  getCardText,
  getChoiceLabel,
  getIndex,
  getLabelById,
  getMatrixLabel,
  getPlaceHolderById,
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
  label?: string;
  maxLength?: number;
  placeholder?: string;
  ref?: RefObject<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  className?: string;
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
  const [showQuestionSelect, setShowQuestionSelect] = useState(false);
  const [showFallbackInput, setShowFallbackInput] = useState(false);
  const [recallQuestions, setRecallQuestions] = useState<TWorkflowQuestion[]>(
    getLocalizedValue(text, selectedLanguageCode).includes("#recall:")
      ? getRecallQuestions(getLocalizedValue(text, selectedLanguageCode), localWorkflow, selectedLanguageCode)
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

  const filteredRecallQuestions = Array.from(new Set(recallQuestions.map((q) => q.id))).map((id) => {
    return recallQuestions.find((q) => q.id === id);
  });

  // Hook to synchronize the horizontal scroll position of highlightContainerRef and inputRef.
  useSyncScroll(highlightContainerRef, inputRef);

  useEffect(() => {
    if (!isWelcomeCard && (id === "headline" || id === "subheader")) {
      checkForRecallSymbol();
    }
    // Generates an array of headlines from recallQuestions, replacing nested recall questions with '___' .
    const recallQuestionHeadlines = recallQuestions.flatMap((recallQuestion) => {
      if (!getLocalizedValue(recallQuestion.headline, selectedLanguageCode).includes("#recall:")) {
        return [(recallQuestion.headline as TI18nString)[selectedLanguageCode]];
      }
      const recallQuestionText = (recallQuestion[id as keyof typeof recallQuestion] as string) || "";
      const recallInfo = extractRecallInfo(recallQuestionText);

      if (recallInfo) {
        const recallQuestionId = extractId(recallInfo);
        const recallQuestion = localWorkflow.questions.find((question) => question.id === recallQuestionId);

        if (recallQuestion) {
          return [recallQuestionText.replace(recallInfo, `___`)];
        }
      }
      return [];
    });

    // Constructs an array of JSX elements representing segmented parts of text, interspersed with special formatted spans for recall headlines.
    const processInput = (): JSX.Element[] => {
      const parts: JSX.Element[] = [];
      let remainingText = recallToHeadline(text, localWorkflow, false, selectedLanguageCode)[
        selectedLanguageCode
      ];
      filterRecallQuestions(remainingText);
      recallQuestionHeadlines.forEach((headline) => {
        const index = remainingText.indexOf("@" + headline);
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
              className="z-30 flex cursor-pointer items-center justify-center whitespace-pre rounded-md bg-slate-100 text-sm text-transparent"
              key={parts.length}>
              {"@" + headline}
            </span>
          );
          remainingText = remainingText.substring(index + headline.length + 1);
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
      setShowQuestionSelect(true);
    } else {
      setShowQuestionSelect(false);
    }
  };

  // Adds a new recall question to the recallQuestions array, updates fallbacks, modifies the text with recall details.
  const addRecallQuestion = (recallQuestion: TWorkflowQuestion) => {
    if ((recallQuestion.headline as TI18nString)[selectedLanguageCode].trim() === "") {
      toast.error("Cannot add question with empty headline as recall");
      return;
    }
    let recallQuestionTemp = structuredClone(recallQuestion);
    recallQuestionTemp = replaceRecallInfoWithUnderline(recallQuestionTemp, selectedLanguageCode);
    setRecallQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, recallQuestionTemp];
      return updatedQuestions;
    });
    if (!Object.keys(fallbacks).includes(recallQuestion.id)) {
      setFallbacks((prevFallbacks) => ({
        ...prevFallbacks,
        [recallQuestion.id]: "",
      }));
    }
    setShowQuestionSelect(false);
    let modifiedHeadlineWithId = { ...getElementTextBasedOnType() };
    modifiedHeadlineWithId[selectedLanguageCode] = getLocalizedValue(
      modifiedHeadlineWithId,
      selectedLanguageCode
    ).replace("@", `#recall:${recallQuestion.id}/fallback:# `);
    handleUpdate(getLocalizedValue(modifiedHeadlineWithId, selectedLanguageCode));
    const modifiedHeadlineWithName = recallToHeadline(
      modifiedHeadlineWithId,
      localWorkflow,
      false,
      selectedLanguageCode
    );
    setText(modifiedHeadlineWithName);
    setShowFallbackInput(true);
  };

  // Filters and updates the list of recall questions based on their presence in the given text, also managing related text and fallback states.
  const filterRecallQuestions = (remainingText: string) => {
    let includedQuestions: TWorkflowQuestion[] = [];
    recallQuestions.forEach((recallQuestion) => {
      if (remainingText.includes(`@${getLocalizedValue(recallQuestion.headline, selectedLanguageCode)}`)) {
        includedQuestions.push(recallQuestion);
      } else {
        const questionToRemove = getLocalizedValue(recallQuestion.headline, selectedLanguageCode).slice(
          0,
          -1
        );
        const newText = { ...text };
        newText[selectedLanguageCode] = text[selectedLanguageCode].replace(`@${questionToRemove}`, "");
        setText(newText);
        handleUpdate(text[selectedLanguageCode].replace(`@${questionToRemove}`, ""));
        let updatedFallback = { ...fallbacks };
        delete updatedFallback[recallQuestion.id];
        setFallbacks(updatedFallback);
      }
    });
    setRecallQuestions(includedQuestions);
  };

  const addFallback = () => {
    let headlineWithFallback = getElementTextBasedOnType();
    filteredRecallQuestions.forEach((recallQuestion) => {
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
          <Label htmlFor={id}>{getLabelById(id)}</Label>
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
                className={`absolute top-0 text-black caret-black ${
                  localWorkflow.languages?.length > 1 ? "pr-24" : ""
                } ${className}`}
                placeholder={placeholder ? placeholder : getPlaceHolderById(id)}
                id={id}
                name={id}
                aria-label={label ? label : getLabelById(id)}
                autoComplete={showQuestionSelect ? "off" : "on"}
                value={
                  recallToHeadline(text, localWorkflow, false, selectedLanguageCode)[selectedLanguageCode]
                }
                ref={inputRef}
                onBlur={onBlur}
                onChange={(e) => {
                  let translatedText = {
                    ...getElementTextBasedOnType(),
                    [selectedLanguageCode]: e.target.value,
                  };
                  setText(recallToHeadline(translatedText, localWorkflow, false, selectedLanguageCode));
                  handleUpdate(
                    headlineToRecall(e.target.value, recallQuestions, fallbacks, selectedLanguageCode)
                  );
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
              {!showQuestionSelect && showFallbackInput && recallQuestions.length > 0 && (
                <FallbackInput
                  filteredRecallQuestions={filteredRecallQuestions}
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
          </div>
        </div>
        {showQuestionSelect && (
          <RecallQuestionSelect
            localWorkflow={localWorkflow}
            questionId={questionId}
            addRecallQuestion={addRecallQuestion}
            setShowQuestionSelect={setShowQuestionSelect}
            showQuestionSelect={showQuestionSelect}
            inputRef={inputRef}
            recallQuestions={recallQuestions}
            selectedLanguageCode={selectedLanguageCode}
          />
        )}
      </div>
      {selectedLanguageCode !== "default" && value && typeof value["default"] !== undefined && (
        <div className="mt-1 text-xs text-gray-500">
          <strong>Translate:</strong> {recallToHeadline(value, localWorkflow, false, "default")["default"]}
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
