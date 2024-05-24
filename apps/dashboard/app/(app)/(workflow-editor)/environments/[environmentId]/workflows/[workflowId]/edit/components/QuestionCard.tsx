"use client";

import { getTWorkflowQuestionTypeName } from "@/app/lib/questions";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ArrowUpFromLineIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Grid3X3Icon,
  HomeIcon,
  ImageIcon,
  ListIcon,
  MessageSquareTextIcon,
  MousePointerClickIcon,
  PhoneIcon,
  PresentationIcon,
  Rows3Icon,
  StarIcon,
} from "lucide-react";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import { cn } from "@typeflowai/lib/cn";
import { recallToHeadline } from "@typeflowai/lib/utils/recall";
import { TProduct } from "@typeflowai/types/product";
import { TI18nString, TWorkflow, TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { Label } from "@typeflowai/ui/Label";
import { QuestionFormInput } from "@typeflowai/ui/QuestionFormInput";
import { Switch } from "@typeflowai/ui/Switch";

import { AddressQuestionForm } from "./AddressQuestionForm";
import { AdvancedSettings } from "./AdvancedSettings";
import { CTAQuestionForm } from "./CTAQuestionForm";
import { CalQuestionForm } from "./CalQuestionForm";
import { ConsentQuestionForm } from "./ConsentQuestionForm";
import { DateQuestionForm } from "./DateQuestionForm";
import { FileUploadQuestionForm } from "./FileUploadQuestionForm";
import { MatrixQuestionForm } from "./MatrixQuestionForm";
import { MultipleChoiceMultiForm } from "./MultipleChoiceMultiForm";
import { MultipleChoiceSingleForm } from "./MultipleChoiceSingleForm";
import { NPSQuestionForm } from "./NPSQuestionForm";
import { OpenQuestionForm } from "./OpenQuestionForm";
import { PictureSelectionForm } from "./PictureSelectionForm";
import { QuestionDropdown } from "./QuestionMenu";
import { RatingQuestionForm } from "./RatingQuestionForm";

interface QuestionCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  product: TProduct;
  questionIdx: number;
  moveQuestion: (questionIndex: number, up: boolean) => void;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  deleteQuestion: (questionIdx: number) => void;
  duplicateQuestion: (questionIdx: number) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (language: string) => void;
  isInvalid: boolean;
}

export default function QuestionCard({
  localWorkflow,
  setLocalWorkflow,
  product,
  questionIdx,
  moveQuestion,
  updateQuestion,
  duplicateQuestion,
  deleteQuestion,
  activeQuestionId,
  setActiveQuestionId,
  lastQuestion,
  isPromptVisible,
  selectedLanguageCode,
  setSelectedLanguageCode,
  isInvalid,
}: QuestionCardProps) {
  const question = localWorkflow.questions[questionIdx];
  const open = activeQuestionId === question.id;
  const [openAdvanced, setOpenAdvanced] = useState(question.logic && question.logic.length > 0);

  // formats the text to highlight specific parts of the text with slashes
  const formatTextWithSlashes = (text) => {
    const regex = /\/(.*?)\\/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Check if the part was inside slashes
      if (index % 2 !== 0) {
        return (
          <span key={index} className="mx-1 rounded-md bg-slate-100 p-1 px-2 text-xs">
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  const updateEmptyNextButtonLabels = (labelValue: TI18nString) => {
    localWorkflow.questions.forEach((q, index) => {
      if (index === localWorkflow.questions.length - 1) return;
      if (!q.buttonLabel || q.buttonLabel[selectedLanguageCode]?.trim() === "") {
        updateQuestion(index, { buttonLabel: labelValue });
      }
    });
  };

  const getIsRequiredToggleDisabled = (): boolean => {
    if (question.type === "address") {
      return [
        question.isAddressLine1Required,
        question.isAddressLine2Required,
        question.isCityRequired,
        question.isCountryRequired,
        question.isStateRequired,
        question.isZipRequired,
      ].some((condition) => condition === true);
    }
    return false;
  };

  const handleRequiredToggle = () => {
    // Fix for NPS and Rating questions having missing translations when buttonLabel is not removed
    if (!question.required && (question.type === "nps" || question.type === "rating")) {
      updateQuestion(questionIdx, { required: true, buttonLabel: undefined });
    } else {
      updateQuestion(questionIdx, { required: !question.required });
    }
  };

  return (
    <Draggable draggableId={question.id} index={questionIdx}>
      {(provided) => (
        <div
          className={cn(
            open ? "scale-100 shadow-lg" : "scale-97 shadow-md",
            "flex flex-row rounded-lg bg-white transition-all duration-300 ease-in-out"
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <div
            className={cn(
              open ? "bg-slate-700" : "bg-slate-400",
              "top-0 w-10 rounded-l-lg p-2 text-center text-sm text-white hover:cursor-grab hover:bg-slate-600",
              isInvalid && "bg-red-400  hover:bg-red-600"
            )}>
            {questionIdx + 1}
          </div>
          <Collapsible.Root
            open={open}
            onOpenChange={() => {
              if (activeQuestionId !== question.id) {
                setActiveQuestionId(question.id);
              } else {
                setActiveQuestionId(null);
              }
            }}
            className="flex-1 rounded-r-lg border border-slate-200">
            <Collapsible.CollapsibleTrigger
              asChild
              className={cn(open ? "" : "  ", "flex cursor-pointer justify-between p-4 hover:bg-slate-50")}>
              <div>
                <div className="inline-flex">
                  <div className="-ml-0.5 mr-3 h-6 min-w-[1.5rem] text-slate-400">
                    {question.type === TWorkflowQuestionType.FileUpload ? (
                      <ArrowUpFromLineIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.OpenText ? (
                      <MessageSquareTextIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
                      <Rows3Icon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
                      <ListIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.NPS ? (
                      <PresentationIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.CTA ? (
                      <MousePointerClickIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Rating ? (
                      <StarIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Consent ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.PictureSelection ? (
                      <ImageIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Date ? (
                      <CalendarDaysIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Cal ? (
                      <PhoneIcon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Matrix ? (
                      <Grid3X3Icon className="h-5 w-5" />
                    ) : question.type === TWorkflowQuestionType.Address ? (
                      <HomeIcon className="h-5 w-5" />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {recallToHeadline(question.headline, localWorkflow, true, selectedLanguageCode)[
                        selectedLanguageCode
                      ]
                        ? formatTextWithSlashes(
                            recallToHeadline(question.headline, localWorkflow, true, selectedLanguageCode)[
                              selectedLanguageCode
                            ] ?? ""
                          )
                        : getTWorkflowQuestionTypeName(question.type)}
                    </p>
                    {!open && question?.required && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {question?.required && "Required"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <QuestionDropdown
                    questionIdx={questionIdx}
                    lastQuestion={lastQuestion}
                    duplicateQuestion={duplicateQuestion}
                    deleteQuestion={deleteQuestion}
                    moveQuestion={moveQuestion}
                  />
                </div>
              </div>
            </Collapsible.CollapsibleTrigger>
            <Collapsible.CollapsibleContent className="px-4 pb-4">
              {question.type === TWorkflowQuestionType.OpenText ? (
                <OpenQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
                <MultipleChoiceSingleForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
                <MultipleChoiceMultiForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.NPS ? (
                <NPSQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.CTA ? (
                <CTAQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Rating ? (
                <RatingQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Consent ? (
                <ConsentQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Date ? (
                <DateQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.PictureSelection ? (
                <PictureSelectionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.FileUpload ? (
                <FileUploadQuestionForm
                  localWorkflow={localWorkflow}
                  product={product}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Cal ? (
                <CalQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Matrix ? (
                <MatrixQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : question.type === TWorkflowQuestionType.Address ? (
                <AddressQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  selectedLanguageCode={selectedLanguageCode}
                  setSelectedLanguageCode={setSelectedLanguageCode}
                  isInvalid={isInvalid}
                />
              ) : null}
              <div className="mt-4">
                <Collapsible.Root open={openAdvanced} onOpenChange={setOpenAdvanced} className="mt-5">
                  <Collapsible.CollapsibleTrigger className="flex items-center text-sm text-slate-700">
                    {openAdvanced ? (
                      <ChevronDownIcon className="mr-1 h-4 w-3" />
                    ) : (
                      <ChevronRightIcon className="mr-2 h-4 w-3" />
                    )}
                    {openAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
                  </Collapsible.CollapsibleTrigger>

                  <Collapsible.CollapsibleContent className="space-y-4">
                    {question.type !== TWorkflowQuestionType.NPS &&
                    question.type !== TWorkflowQuestionType.Rating &&
                    question.type !== TWorkflowQuestionType.CTA ? (
                      <div className="mt-2 flex space-x-2">
                        <div className="w-full">
                          <QuestionFormInput
                            id="buttonLabel"
                            value={question.buttonLabel}
                            localWorkflow={localWorkflow}
                            questionIdx={questionIdx}
                            maxLength={48}
                            placeholder={lastQuestion ? (isPromptVisible ? "Next" : "Finish") : "Next"}
                            isInvalid={isInvalid}
                            updateQuestion={updateQuestion}
                            selectedLanguageCode={selectedLanguageCode}
                            setSelectedLanguageCode={setSelectedLanguageCode}
                            onBlur={(e) => {
                              if (!question.buttonLabel) return;
                              let translatedNextButtonLabel = {
                                ...question.buttonLabel,
                                [selectedLanguageCode]: e.target.value,
                              };

                              if (questionIdx === localWorkflow.questions.length - 1) return;
                              updateEmptyNextButtonLabels(translatedNextButtonLabel);
                            }}
                          />
                        </div>
                        {questionIdx !== 0 && (
                          <QuestionFormInput
                            id="backButtonLabel"
                            value={question.backButtonLabel}
                            localWorkflow={localWorkflow}
                            questionIdx={questionIdx}
                            maxLength={48}
                            placeholder={"Back"}
                            isInvalid={isInvalid}
                            updateQuestion={updateQuestion}
                            selectedLanguageCode={selectedLanguageCode}
                            setSelectedLanguageCode={setSelectedLanguageCode}
                          />
                        )}
                      </div>
                    ) : null}
                    {(question.type === TWorkflowQuestionType.Rating ||
                      question.type === TWorkflowQuestionType.NPS) &&
                      questionIdx !== 0 && (
                        <div className="mt-4">
                          <QuestionFormInput
                            id="backButtonLabel"
                            value={question.backButtonLabel}
                            localWorkflow={localWorkflow}
                            questionIdx={questionIdx}
                            maxLength={48}
                            placeholder={"Back"}
                            isInvalid={isInvalid}
                            updateQuestion={updateQuestion}
                            selectedLanguageCode={selectedLanguageCode}
                            setSelectedLanguageCode={setSelectedLanguageCode}
                          />
                        </div>
                      )}

                    <AdvancedSettings
                      question={question}
                      questionIdx={questionIdx}
                      localWorkflow={localWorkflow}
                      setLocalWorkflow={setLocalWorkflow}
                      updateQuestion={updateQuestion}
                    />
                  </Collapsible.CollapsibleContent>
                </Collapsible.Root>
              </div>
            </Collapsible.CollapsibleContent>

            {open && (
              <div className="mx-4 flex justify-end space-x-6 border-t border-slate-200">
                {question.type === "openText" && (
                  <div className="my-4 flex items-center justify-end space-x-2">
                    <Label htmlFor="longAnswer">Long Answer</Label>
                    <Switch
                      id="longAnswer"
                      disabled={question.inputType !== "text"}
                      checked={question.longAnswer !== false}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuestion(questionIdx, {
                          longAnswer:
                            typeof question.longAnswer === "undefined" ? false : !question.longAnswer,
                        });
                      }}
                    />
                  </div>
                )}
                {
                  <div className="my-4 flex items-center justify-end space-x-2">
                    <Label htmlFor="required-toggle">Required</Label>
                    <Switch
                      id="required-toggle"
                      checked={question.required}
                      disabled={getIsRequiredToggleDisabled()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequiredToggle();
                      }}
                    />
                  </div>
                }
              </div>
            )}
          </Collapsible.Root>
        </div>
      )}
    </Draggable>
  );
}
