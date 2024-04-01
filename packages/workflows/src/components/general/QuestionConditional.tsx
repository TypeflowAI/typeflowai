import CTAQuestion from "@/components/questions/CTAQuestion";
import CalQuestion from "@/components/questions/CalQuestion";
import ConsentQuestion from "@/components/questions/ConsentQuestion";
import DateQuestion from "@/components/questions/DateQuestion";
import FileUploadQuestion from "@/components/questions/FileUploadQuestion";
import MultipleChoiceMultiQuestion from "@/components/questions/MultipleChoiceMultiQuestion";
import MultipleChoiceSingleQuestion from "@/components/questions/MultipleChoiceSingleQuestion";
import NPSQuestion from "@/components/questions/NPSQuestion";
import OpenTextQuestion from "@/components/questions/OpenTextQuestion";
import PictureSelectionQuestion from "@/components/questions/PictureSelectionQuestion";
import RatingQuestion from "@/components/questions/RatingQuestion";

import { TResponseData, TResponseTtc } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflowQuestion, TWorkflowQuestionType } from "@typeflowai/types/workflows";

interface QuestionConditionalProps {
  question: TWorkflowQuestion;
  value: string | number | string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isPromptVisible: boolean;
  autoFocus?: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  workflowId: string;
}

export default function QuestionConditional({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  isPromptVisible,
  autoFocus = true,
  ttc,
  setTtc,
  workflowId,
  onFileUpload,
}: QuestionConditionalProps) {
  return question.type === TWorkflowQuestionType.OpenText ? (
    <OpenTextQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      autoFocus={autoFocus}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
    <MultipleChoiceSingleQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
    <MultipleChoiceMultiQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.NPS ? (
    <NPSQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.CTA ? (
    <CTAQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Rating ? (
    <RatingQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Consent ? (
    <ConsentQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Date ? (
    <DateQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.PictureSelection ? (
    <PictureSelectionQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.FileUpload ? (
    <FileUploadQuestion
      workflowId={workflowId}
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      onFileUpload={onFileUpload}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Cal ? (
    <CalQuestion
      question={question}
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : null;
}
