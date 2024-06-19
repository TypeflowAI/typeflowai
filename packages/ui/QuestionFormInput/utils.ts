import { createI18nString } from "@typeflowai/lib/i18n/utils";
import { isLabelValidForAllLanguages } from "@typeflowai/lib/i18n/utils";
import {
  TI18nString,
  TWorkflow,
  TWorkflowMatrixQuestion,
  TWorkflowMultipleChoiceQuestion,
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
  const choiceQuestion = question as TWorkflowMultipleChoiceQuestion;
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
      return false;
    default:
      // Regular Workflow Question
      const question = localWorkflow.questions[questionIdx];
      return (!!question && !!question.imageUrl) || (!!question && !!question.videoUrl);
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

export const isValueIncomplete = (
  id: string,
  isInvalid: boolean,
  workflowLanguageCodes: string[],
  value?: TI18nString
) => {
  // Define a list of IDs for which a default value needs to be checked.
  const labelIds = [
    "label",
    "headline",
    "subheader",
    "lowerLabel",
    "upperLabel",
    "buttonLabel",
    "placeholder",
    "backButtonLabel",
    "dismissButtonLabel",
  ];

  // If value is not provided, immediately return false as it cannot be incomplete.
  if (value === undefined) return false;

  // Check if the default value is incomplete. This applies only to specific label IDs.
  // For these IDs, the default value should not be an empty string.
  const isDefaultIncomplete = labelIds.includes(id) ? value["default"]?.trim() !== "" : false;

  // Return true if all the following conditions are met:
  // 1. The field is marked as invalid.
  // 2. The label is not valid for all provided language codes in the workflow.
  // 4. For specific label IDs, the default value is incomplete as defined above.
  return isInvalid && !isLabelValidForAllLanguages(value, workflowLanguageCodes) && isDefaultIncomplete;
};
