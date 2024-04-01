"use client";

import AdvancedSettings from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/AdvancedSettings";
import DateQuestionForm from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/DateQuestionForm";
import PictureSelectionForm from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/PictureSelectionForm";
import { getTWorkflowQuestionTypeName } from "@/app/lib/questions";
import {
  ArrowUpTrayIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CursorArrowRippleIcon,
  ListBulletIcon,
  PhoneIcon,
  PhotoIcon,
  PresentationChartBarIcon,
  QueueListIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

import { cn } from "@typeflowai/lib/cn";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

import CTAQuestionForm from "./CTAQuestionForm";
import CalQuestionForm from "./CalQuestionForm";
import ConsentQuestionForm from "./ConsentQuestionForm";
import FileUploadQuestionForm from "./FileUploadQuestionForm";
import MultipleChoiceMultiForm from "./MultipleChoiceMultiForm";
import MultipleChoiceSingleForm from "./MultipleChoiceSingleForm";
import NPSQuestionForm from "./NPSQuestionForm";
import OpenQuestionForm from "./OpenQuestionForm";
import QuestionDropdown from "./QuestionMenu";
import RatingQuestionForm from "./RatingQuestionForm";

interface QuestionCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  product?: TProduct;
  questionIdx: number;
  moveQuestion: (questionIndex: number, up: boolean) => void;
  updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
  deleteQuestion: (questionIdx: number) => void;
  duplicateQuestion: (questionIdx: number) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (questionId: string | null) => void;
  lastQuestion: boolean;
  isPromptVisible: boolean;
  isInValid: boolean;
}

export function BackButtonInput({
  value,
  onChange,
  className,
}: {
  value: string | undefined;
  onChange: (e: any) => void;
  className?: string;
}) {
  return (
    <div className="w-full">
      <Label htmlFor="backButtonLabel">&quot;Back&quot; Button Label</Label>
      <div className="mt-2">
        <Input
          id="backButtonLabel"
          name="backButtonLabel"
          value={value}
          placeholder="Back"
          onChange={onChange}
          className={className}
        />
      </div>
    </div>
  );
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
  isInValid,
}: QuestionCardProps) {
  const question = localWorkflow.questions[questionIdx];
  const open = activeQuestionId === question.id;
  const [openAdvanced, setOpenAdvanced] = useState(question.logic && question.logic.length > 0);

  const updateEmptyNextButtonLabels = (labelValue: string) => {
    localWorkflow.questions.forEach((q, index) => {
      if (!q.buttonLabel || q.buttonLabel?.trim() === "") {
        updateQuestion(index, { buttonLabel: labelValue });
      }
    });
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
              open ? "bg-violet-950" : "bg-slate-400",
              "top-0 w-10 rounded-l-lg p-2 text-center text-sm text-white hover:bg-slate-600",
              isInValid && "bg-red-400  hover:bg-red-600"
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
                  <div className="-ml-0.5 mr-3 h-6 w-6 text-slate-400">
                    {question.type === TWorkflowQuestionType.FileUpload ? (
                      <ArrowUpTrayIcon />
                    ) : question.type === TWorkflowQuestionType.OpenText ? (
                      <ChatBubbleBottomCenterTextIcon />
                    ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
                      <QueueListIcon />
                    ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
                      <ListBulletIcon />
                    ) : question.type === TWorkflowQuestionType.NPS ? (
                      <PresentationChartBarIcon />
                    ) : question.type === TWorkflowQuestionType.CTA ? (
                      <CursorArrowRippleIcon />
                    ) : question.type === TWorkflowQuestionType.Rating ? (
                      <StarIcon />
                    ) : question.type === TWorkflowQuestionType.Consent ? (
                      <CheckIcon />
                    ) : question.type === TWorkflowQuestionType.PictureSelection ? (
                      <PhotoIcon />
                    ) : question.type === TWorkflowQuestionType.Date ? (
                      <CalendarDaysIcon />
                    ) : question.type === TWorkflowQuestionType.Cal ? (
                      <PhoneIcon />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {question.headline || getTWorkflowQuestionTypeName(question.type)}
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
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
                <MultipleChoiceSingleForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
                <MultipleChoiceMultiForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.NPS ? (
                <NPSQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.CTA ? (
                <CTAQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.Rating ? (
                <RatingQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.Consent ? (
                <ConsentQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.Date ? (
                <DateQuestionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.PictureSelection ? (
                <PictureSelectionForm
                  localWorkflow={localWorkflow}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.FileUpload ? (
                <FileUploadQuestionForm
                  localWorkflow={localWorkflow}
                  product={product}
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
                />
              ) : question.type === TWorkflowQuestionType.Cal ? (
                <CalQuestionForm
                  question={question}
                  questionIdx={questionIdx}
                  updateQuestion={updateQuestion}
                  lastQuestion={lastQuestion}
                  isPromptVisible={isPromptVisible}
                  isInValid={isInValid}
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
                      <div className="mt-4 flex space-x-2">
                        <div className="w-full">
                          <Label htmlFor="buttonLabel">&quot;Next&quot; Button Label</Label>
                          <div className="mt-2">
                            <Input
                              id="buttonLabel"
                              name="buttonLabel"
                              value={question.buttonLabel}
                              maxLength={48}
                              placeholder={lastQuestion ? (isPromptVisible ? "Next" : "Finish") : "Next"}
                              onChange={(e) => {
                                updateQuestion(questionIdx, { buttonLabel: e.target.value });
                              }}
                              onBlur={(e) => {
                                updateEmptyNextButtonLabels(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        {questionIdx !== 0 && (
                          <BackButtonInput
                            value={question.backButtonLabel}
                            onChange={(e) => {
                              if (e.target.value.trim() == "") e.target.value = "";
                              updateQuestion(questionIdx, { backButtonLabel: e.target.value });
                            }}
                          />
                        )}
                      </div>
                    ) : null}
                    {(question.type === TWorkflowQuestionType.Rating ||
                      question.type === TWorkflowQuestionType.NPS) &&
                      questionIdx !== 0 && (
                        <div className="mt-4">
                          <BackButtonInput
                            value={question.backButtonLabel}
                            onChange={(e) => {
                              if (e.target.value.trim() == "") e.target.value = "";
                              updateQuestion(questionIdx, { backButtonLabel: e.target.value });
                            }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuestion(questionIdx, { required: !question.required });
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
