import { BackButton } from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import CalEmbed from "@/components/general/CalEmbed";
import Headline from "@/components/general/Headline";
import { QuestionMedia } from "@/components/general/QuestionMedia";
import Subheader from "@/components/general/Subheader";
import { ScrollableContainer } from "@/components/wrappers/ScrollableContainer";
import { getUpdatedTtc, useTtc } from "@/lib/ttc";
import { useCallback, useState } from "preact/hooks";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { TResponseData } from "@typeflowai/types/responses";
import { TResponseTtc } from "@typeflowai/types/responses";
import { TWorkflowCalQuestion } from "@typeflowai/types/workflows";

interface CalQuestionProps {
  question: TWorkflowCalQuestion;
  value: string;
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isPromptVisible: boolean;
  languageCode: string;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  isInIframe: boolean;
}

export const CalQuestion = ({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isPromptVisible,
  isLastQuestion,
  languageCode,
  ttc,
  setTtc,
}: CalQuestionProps) => {
  const [startTime, setStartTime] = useState(performance.now());
  useTtc(question.id, ttc, setTtc, startTime, setStartTime);
  const isMediaAvailable = question.imageUrl || question.videoUrl;
  const [errorMessage, setErrorMessage] = useState("");

  const onSuccessfulBooking = useCallback(() => {
    onChange({ [question.id]: "booked" });
    const updatedttc = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
    setTtc(updatedttc);
    onSubmit({ [question.id]: "booked" }, updatedttc);
  }, [onChange, onSubmit, question.id, setTtc, startTime, ttc]);

  return (
    <form
      key={question.id}
      onSubmit={(e) => {
        e.preventDefault();
        if (question.required && !value) {
          setErrorMessage("Please book an appointment");
          return;
        }

        const updatedttc = getUpdatedTtc(ttc, question.id, performance.now() - startTime);
        setTtc(updatedttc);

        onChange({ [question.id]: value });
        onSubmit({ [question.id]: value }, updatedttc);
      }}
      className="w-full">
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
          <>
            {errorMessage && <span className="text-red-500">{errorMessage}</span>}
            <CalEmbed key={question.id} question={question} onSuccessfulBooking={onSuccessfulBooking} />
          </>
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
        {!question.required && (
          <SubmitButton
            buttonLabel={getLocalizedValue(question.buttonLabel, languageCode)}
            isLastQuestion={isLastQuestion}
            isPromptVisible={isPromptVisible}
          />
        )}
      </div>
    </form>
  );
};
