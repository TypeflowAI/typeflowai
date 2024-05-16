import { createI18nString } from "@typeflowai/lib/i18n/utils";
import {
  TI18nString,
  TWorkflow,
  TWorkflowMatrixQuestion,
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
  TWorkflowQuestion,
} from "@typeflowai/types/workflows";

// Function to get index for choice /rowLabel /columnLabel
export const getIndex = (id: string, isChoice: boolean) => {
  if (!isChoice) return null;

  const parts = id.split("-");
  if (parts.length > 1) {
    return parseInt(parts[1], 10);
  }
  return null;
};

export const getChoiceLabel = (
  question: TWorkflowQuestion,
  choiceIdx: number,
  workflowLanguageCodes: string[]
): TI18nString => {
  const choiceQuestion = question as
    | TWorkflowMultipleChoiceMultiQuestion
    | TWorkflowMultipleChoiceSingleQuestion;
  return choiceQuestion.choices[choiceIdx]?.label || createI18nString("", workflowLanguageCodes);
};

export const getMatrixLabel = (
  question: TWorkflowQuestion,
  idx: number,
  workflowLanguageCodes: string[],
  type: "row" | "column"
): TI18nString => {
  const matrixQuestion = question as TWorkflowMatrixQuestion;
  const labels = type === "row" ? matrixQuestion.rows : matrixQuestion.columns;
  return labels[idx] || createI18nString("", workflowLanguageCodes);
};

export const getCardText = (
  workflow: TWorkflow,
  id: string,
  isThankYouCard: boolean,
  workflowLanguageCodes: string[]
): TI18nString => {
  const card = isThankYouCard ? workflow.thankYouCard : workflow.welcomeCard;
  return (card[id as keyof typeof card] as TI18nString) || createI18nString("", workflowLanguageCodes);
};

export const determineImageUploaderVisibility = (questionIdx: number, localWorkflow: TWorkflow) => {
  switch (questionIdx) {
    case localWorkflow.questions.length: // Thank You Card
      return !!localWorkflow.thankYouCard.imageUrl || !!localWorkflow.thankYouCard.videoUrl;
    case -1: // Welcome Card
      return !!localWorkflow.welcomeCard.fileUrl || !!localWorkflow.welcomeCard.videoUrl;
    default:
      // Regular Workflow Question
      const question = localWorkflow.questions[questionIdx];
      return (!!question && !!question.imageUrl) || (!!question && !!question.videoUrl);
  }
};

export const getLabelById = (id: string) => {
  switch (id) {
    case "headline":
      return "Question";
    case "subheader":
      return "Description";
    case "placeholder":
      return "Placeholder";
    case "buttonLabel":
      return `"Next" Button Label`;
    case "backButtonLabel":
      return `"Back" Button Label`;
    case "lowerLabel":
      return "Lower Label";
    case "upperLabel":
      return "Upper Label";
    default:
      return "";
  }
};

export const getPlaceHolderById = (id: string) => {
  switch (id) {
    case "headline":
      return "Your question here. Recall information with @";
    case "subheader":
      return "Your description here. Recall information with @";
    default:
      return "";
  }
};
