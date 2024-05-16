import { calculateElementIdx } from "@/lib/utils";
import { useCallback, useMemo } from "preact/hooks";

import { TWorkflow } from "@typeflowai/types/workflows";

import Progress from "./Progress";

interface ProgressBarProps {
  workflow: TWorkflow;
  questionId: string;
}

export const ProgressBar = ({ workflow, questionId }: ProgressBarProps) => {
  const currentQuestionIdx = useMemo(
    () => workflow.questions.findIndex((e) => e.id === questionId),
    [workflow, questionId]
  );

  const calculateProgress = useCallback((questionId: string, workflow: TWorkflow, progress: number) => {
    if (workflow.questions.length === 0) return 0;
    let currentQustionIdx = workflow.questions.findIndex((e) => e.id === questionId);
    if (currentQustionIdx === -1) currentQustionIdx = 0;
    const elementIdx = calculateElementIdx(workflow, currentQustionIdx);

    const newProgress = elementIdx / workflow.questions.length;
    let updatedProgress = progress;
    if (newProgress > progress) {
      updatedProgress = newProgress;
    } else if (newProgress <= progress && progress + 0.1 <= 1) {
      updatedProgress = progress + 0.1;
    }
    return updatedProgress;
  }, []);

  const progressArray = useMemo(() => {
    let progress = 0;
    let progressArrayTemp: number[] = [];
    workflow.questions.forEach((question) => {
      progress = calculateProgress(question.id, workflow, progress);
      progressArrayTemp.push(progress);
    });
    return progressArrayTemp;
  }, [calculateProgress, workflow]);

  return <Progress progress={questionId === "end" ? 1 : progressArray[currentQuestionIdx]} />;
};
