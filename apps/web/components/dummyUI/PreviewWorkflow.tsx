import { useState } from "react";

import Modal from "./Modal";
import QuestionConditional from "./QuestionConditional";
import ThankYouCard from "./ThankYouCard";
import { TWorkflow, TWorkflowQuestion } from "./types";

interface PreviewWorkflowProps {
  localWorkflow?: TWorkflow;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId?: string | null;
  questions: TWorkflowQuestion[];
  brandColor: string;
}

export default function PreviewWorkflow({
  localWorkflow,
  setActiveQuestionId,
  activeQuestionId,
  questions,
  brandColor,
}: PreviewWorkflowProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const gotoNextQuestion = () => {
    const currentIndex = questions.findIndex((q) => q.id === activeQuestionId);
    if (currentIndex < questions.length - 1) {
      setActiveQuestionId(questions[currentIndex + 1].id);
    } else {
      if (localWorkflow?.thankYouCard?.enabled) {
        setActiveQuestionId("thank-you-card");
      } else {
        setIsModalOpen(false);
        setTimeout(() => {
          setActiveQuestionId(questions[0].id);
          setIsModalOpen(true);
        }, 500);
        if (localWorkflow?.thankYouCard?.enabled) {
          setActiveQuestionId("thank-you-card");
        } else {
          setIsModalOpen(false);
          setTimeout(() => {
            setActiveQuestionId(questions[0].id);
            setIsModalOpen(true);
          }, 500);
        }
      }
    }
  };

  const resetPreview = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setActiveQuestionId(questions[0].id);
      setIsModalOpen(true);
    }, 500);
  };

  if (!activeQuestionId) {
    return null;
  }

  return (
    <>
      <Modal isOpen={isModalOpen} reset={resetPreview}>
        {activeQuestionId == "thank-you-card" ? (
          <ThankYouCard
            brandColor={brandColor}
            headline={localWorkflow?.thankYouCard?.headline!}
            subheader={localWorkflow?.thankYouCard?.subheader!}
          />
        ) : (
          questions.map(
            (question, idx) =>
              activeQuestionId === question.id && (
                <QuestionConditional
                  key={question.id}
                  question={question}
                  brandColor={brandColor}
                  lastQuestion={idx === questions.length - 1}
                  onSubmit={gotoNextQuestion}
                />
              )
          )
        )}
      </Modal>
    </>
  );
}
