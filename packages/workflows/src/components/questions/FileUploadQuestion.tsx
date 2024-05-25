import { QuestionMedia } from "@/components/general/QuestionMedia";
import { ScrollableContainer } from "@/components/wrappers/ScrollableContainer";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useState } from "preact/hooks";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { TResponseData, TResponseTtc } from "@typeflowai/types/responses";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import type { TWorkflowFileUploadQuestion } from "@typeflowai/types/workflows";

import { BackButton } from "../buttons/BackButton";
import SubmitButton from "../buttons/SubmitButton";
import { FileInput } from "../general/FileInput";
import Headline from "../general/Headline";
import Subheader from "../general/Subheader";

interface FileUploadQuestionProps {
  question: TWorkflowFileUploadQuestion;
  value: string[];
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isPromptVisible: boolean;
  workflowId: string;
  languageCode: string;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  isInIframe: boolean;
  currentQuestionId: string;
}

export const FileUploadQuestion = ({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  isPromptVisible,
  workflowId,
  onFileUpload,
  languageCode,
  ttc,
  setTtc,
  currentQuestionId,
}: FileUploadQuestionProps) => {
  const [startTime, setStartTime] = useState(performance.now());
  const isMediaAvailable = question.imageUrl || question.videoUrl;

  useTtc(question.id, ttc, setTtc, startTime, setStartTime, question.id === currentQuestionId);

  return (
    <form
      key={question.id}
      onSubmit={(e) => {
        e.preventDefault();
        const updatedTtcObj = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
        setTtc(updatedTtcObj);
        if (question.required) {
          if (value && value.length > 0) {
            onSubmit({ [question.id]: value }, updatedTtcObj);
          } else {
            alert("Please upload a file");
          }
        } else {
          if (value) {
            onSubmit({ [question.id]: value }, updatedTtcObj);
          } else {
            onSubmit({ [question.id]: "skipped" }, updatedTtcObj);
          }
        }
      }}
      className="w-full ">
      <ScrollableContainer>
        <div>
          {isMediaAvailable && <QuestionMedia imgUrl={question.imageUrl} videoUrl={question.videoUrl} />}
          <Headline
            headline={getLocalizedValue(question.headline, languageCode)}
            questionId={question.id}
            required={question.required}
          />
          <Subheader
            subheader={question.subheader ? getLocalizedValue(question.subheader, languageCode) : ""}
            questionId={question.id}
          />
          <FileInput
            htmlFor={question.id}
            workflowId={workflowId}
            onFileUpload={onFileUpload}
            onUploadCallback={(urls: string[]) => {
              if (urls) {
                onChange({ [question.id]: urls });
              } else {
                onChange({ [question.id]: "skipped" });
              }
            }}
            fileUrls={value as string[]}
            allowMultipleFiles={question.allowMultipleFiles}
            {...(!!question.allowedFileExtensions
              ? { allowedFileExtensions: question.allowedFileExtensions }
              : {})}
            {...(!!question.maxSizeInMB ? { maxSizeInMB: question.maxSizeInMB } : {})}
          />
        </div>
      </ScrollableContainer>
      <div className="flex w-full justify-between px-6 py-4">
        {!isFirstQuestion && (
          <BackButton
            backButtonLabel={getLocalizedValue(question.backButtonLabel, languageCode)}
            onClick={() => {
              onBack();
            }}
          />
        )}
        <div></div>
        <SubmitButton
          buttonLabel={getLocalizedValue(question.buttonLabel, languageCode)}
          isLastQuestion={isLastQuestion}
          isPromptVisible={isPromptVisible}
        />
      </div>
    </form>
  );
};
