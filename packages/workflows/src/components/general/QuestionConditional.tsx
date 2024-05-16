import { AddressQuestion } from "@/components/questions/AddressQuestion";
import { CTAQuestion } from "@/components/questions/CTAQuestion";
import { CalQuestion } from "@/components/questions/CalQuestion";
import { ConsentQuestion } from "@/components/questions/ConsentQuestion";
import { DateQuestion } from "@/components/questions/DateQuestion";
import { FileUploadQuestion } from "@/components/questions/FileUploadQuestion";
import { MatrixQuestion } from "@/components/questions/MatrixQuestion";
import { MultipleChoiceMultiQuestion } from "@/components/questions/MultipleChoiceMultiQuestion";
import { MultipleChoiceSingleQuestion } from "@/components/questions/MultipleChoiceSingleQuestion";
import { NPSQuestion } from "@/components/questions/NPSQuestion";
import { OpenTextQuestion } from "@/components/questions/OpenTextQuestion";
import { PictureSelectionQuestion } from "@/components/questions/PictureSelectionQuestion";
import { RatingQuestion } from "@/components/questions/RatingQuestion";

import { TResponseData, TResponseTtc } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflowQuestion, TWorkflowQuestionType } from "@typeflowai/types/workflows";

interface QuestionConditionalProps {
  question: TWorkflowQuestion;
  value: string | number | string[] | Record<string, string>;
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isPromptVisible: boolean;
  languageCode: string;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  workflowId: string;
  isInIframe: boolean;
}

export const QuestionConditional = ({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  isPromptVisible,
  languageCode,
  ttc,
  setTtc,
  workflowId,
  onFileUpload,
  isInIframe,
}: QuestionConditionalProps) => {
  return question.type === TWorkflowQuestionType.OpenText ? (
    <OpenTextQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.MultipleChoiceSingle ? (
    <MultipleChoiceSingleQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.MultipleChoiceMulti ? (
    <MultipleChoiceMultiQuestion
      key={question.id}
      question={question}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.NPS ? (
    <NPSQuestion
      key={question.id}
      question={question}
      value={typeof value === "number" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.CTA ? (
    <CTAQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.Rating ? (
    <RatingQuestion
      key={question.id}
      question={question}
      value={typeof value === "number" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.Consent ? (
    <ConsentQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.Date ? (
    <DateQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.PictureSelection ? (
    <PictureSelectionQuestion
      key={question.id}
      question={question}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.FileUpload ? (
    <FileUploadQuestion
      key={question.id}
      workflowId={workflowId}
      question={question}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      onFileUpload={onFileUpload}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : question.type === TWorkflowQuestionType.Cal ? (
    <CalQuestion
      key={question.id}
      question={question}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      isInIframe={isInIframe}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Matrix ? (
    <MatrixQuestion
      question={question}
      value={typeof value === "object" && !Array.isArray(value) ? value : {}}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
    />
  ) : question.type === TWorkflowQuestionType.Address ? (
    <AddressQuestion
      question={question}
      value={Array.isArray(value) ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      isPromptVisible={isPromptVisible}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      isInIframe={isInIframe}
    />
  ) : null;
};
