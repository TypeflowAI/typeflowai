// import { calculateElementIdx } from "@/lib/utils";
import { useCallback, useMemo } from "preact/hooks";

import { TWorkflow } from "@typeflowai/types/workflows";

import Progress from "./Progress";

interface ProgressBarProps {
  workflow: TWorkflow;
  questionId: string;
  isPromptVisible: boolean;
}

export default function ProgressBar({ workflow, questionId, isPromptVisible }: ProgressBarProps) {
  const calculateProgress = useCallback((currentIdx: number, totalSteps: number) => {
    if (totalSteps === 0) return 0;
    // Asegurarse de que el progreso se calcula como una fracción del total de pasos
    return (currentIdx + 1) / totalSteps;
  }, []);

  const totalSteps = workflow.questions.length + (isPromptVisible ? 1 : 0);
  const progressArray = useMemo(() => {
    let progressArrayTemp: number[] = [];
    // Calcular el progreso para cada pregunta
    workflow.questions.forEach((_, idx) => {
      progressArrayTemp.push(calculateProgress(idx, totalSteps));
    });
    // Añadir el progreso del prompt si está visible
    if (isPromptVisible) {
      progressArrayTemp.push(1); // El prompt se considera como el último paso
    }
    return progressArrayTemp;
  }, [workflow.questions, isPromptVisible, calculateProgress, totalSteps]);

  const currentIdx =
    questionId === "prompt"
      ? workflow.questions.length // Índice para prompt
      : workflow.questions.findIndex((e) => e.id === questionId);

  return <Progress progress={progressArray[currentIdx]} />;
}
