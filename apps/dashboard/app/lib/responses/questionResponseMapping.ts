import { TResponse } from "@typeflowai/types/responses";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

export const getQuestionResponseMapping = (
  workflow: { questions: TWorkflowQuestion[] },
  response: TResponse
): { question: string; answer: string }[] => {
  const questionResponseMapping: { question: string; answer: string }[] = [];

  for (const question of workflow.questions) {
    const answer = response.data[question.id];

    questionResponseMapping.push({
      question: question.headline,
      answer: typeof answer !== "undefined" ? answer.toString() : "",
    });
  }

  return questionResponseMapping;
};
