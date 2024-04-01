import { TWorkflow } from "@typeflowai/types/workflows";

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export function isLight(color: string) {
  let r, g, b;
  if (color.length === 4) {
    r = parseInt(color[1] + color[1], 16);
    g = parseInt(color[2] + color[2], 16);
    b = parseInt(color[3] + color[3], 16);
  } else if (color.length === 7) {
    r = parseInt(color[1] + color[2], 16);
    g = parseInt(color[3] + color[4], 16);
    b = parseInt(color[5] + color[6], 16);
  }
  if (r === undefined || g === undefined || b === undefined) {
    throw new Error("Invalid color");
  }
  return r * 0.299 + g * 0.587 + b * 0.114 > 128;
}

const shuffle = (array: any[]) => {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const shuffleQuestions = (array: any[], shuffleOption: string) => {
  const arrayCopy = [...array];
  const otherIndex = arrayCopy.findIndex((element) => element.id === "other");
  const otherElement = otherIndex !== -1 ? arrayCopy.splice(otherIndex, 1)[0] : null;

  if (shuffleOption === "all") {
    shuffle(arrayCopy);
  } else if (shuffleOption === "exceptLast") {
    const lastElement = arrayCopy.pop();
    shuffle(arrayCopy);
    arrayCopy.push(lastElement);
  }

  if (otherElement) {
    arrayCopy.push(otherElement);
  }

  return arrayCopy;
};

export const calculateElementIdx = (workflow: TWorkflow, currentQustionIdx: number): number => {
  const currentQuestion = workflow.questions[currentQustionIdx];
  const workflowLength = workflow.questions.length;
  const middleIdx = Math.floor(workflowLength / 2);
  const possibleNextQuestions = currentQuestion?.logic?.map((l) => l.destination) || [];

  const getLastQuestionIndex = () => {
    const lastQuestion = workflow.questions
      .filter((q) => possibleNextQuestions.includes(q.id))
      .sort((a, b) => workflow.questions.indexOf(a) - workflow.questions.indexOf(b))
      .pop();
    return workflow.questions.findIndex((e) => e.id === lastQuestion?.id);
  };

  let elementIdx = currentQustionIdx || 0.5;
  const lastprevQuestionIdx = getLastQuestionIndex();

  if (lastprevQuestionIdx > 0) elementIdx = Math.min(middleIdx, lastprevQuestionIdx - 1);
  if (possibleNextQuestions.includes("end")) elementIdx = middleIdx;
  return elementIdx;
};
