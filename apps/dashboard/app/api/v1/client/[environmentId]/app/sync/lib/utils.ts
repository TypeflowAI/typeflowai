import { parseRecallInfo } from "@typeflowai/lib/utils/recall";
import { TAttributes } from "@typeflowai/types/attributes";
import { TLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TWorkflow } from "@typeflowai/types/workflows";

export const replaceAttributeRecall = (workflow: TWorkflow, attributes: TAttributes): TWorkflow => {
  const workflowTemp = structuredClone(workflow);
  const languages = Object.keys(workflow.questions[0].headline);
  workflowTemp.questions.forEach((question) => {
    languages.forEach((language) => {
      if (question.headline[language].includes("recall:")) {
        question.headline[language] = parseRecallInfo(question.headline[language], attributes);
      }
      if (question.subheader && question.subheader[language].includes("recall:")) {
        question.subheader[language] = parseRecallInfo(question.subheader[language], attributes);
      }
    });
  });
  if (workflowTemp.welcomeCard.enabled && workflowTemp.welcomeCard.headline) {
    languages.forEach((language) => {
      if (
        workflowTemp.welcomeCard.headline &&
        workflowTemp.welcomeCard.headline[language].includes("recall:")
      ) {
        workflowTemp.welcomeCard.headline[language] = parseRecallInfo(
          workflowTemp.welcomeCard.headline[language],
          attributes
        );
      }
    });
  }
  if (workflowTemp.thankYouCard.enabled) {
    languages.forEach((language) => {
      if (
        workflowTemp.thankYouCard.headline &&
        workflowTemp.thankYouCard.headline[language].includes("recall:")
      ) {
        workflowTemp.thankYouCard.headline[language] = parseRecallInfo(
          workflowTemp.thankYouCard.headline[language],
          attributes
        );
        if (
          workflowTemp.thankYouCard.subheader &&
          workflowTemp.thankYouCard.subheader[language].includes("recall:")
        ) {
          workflowTemp.thankYouCard.subheader[language] = parseRecallInfo(
            workflowTemp.thankYouCard.subheader[language],
            attributes
          );
        }
      }
    });
  }
  return workflowTemp;
};

export const replaceAttributeRecallInLegacyWorkflows = (
  workflow: TLegacyWorkflow,
  attributes: TAttributes
): TLegacyWorkflow => {
  const workflowTemp = structuredClone(workflow);
  workflowTemp.questions.forEach((question) => {
    if (question.headline.includes("recall:")) {
      question.headline = parseRecallInfo(question.headline, attributes);
    }
    if (question.subheader && question.subheader.includes("recall:")) {
      question.subheader = parseRecallInfo(question.subheader, attributes);
    }
  });
  if (workflowTemp.welcomeCard.enabled && workflowTemp.welcomeCard.headline) {
    if (workflowTemp.welcomeCard.headline && workflowTemp.welcomeCard.headline.includes("recall:")) {
      workflowTemp.welcomeCard.headline = parseRecallInfo(workflowTemp.welcomeCard.headline, attributes);
    }
  }
  if (workflowTemp.thankYouCard.enabled && workflowTemp.thankYouCard.headline) {
    if (workflowTemp.thankYouCard.headline && workflowTemp.thankYouCard.headline.includes("recall:")) {
      workflowTemp.thankYouCard.headline = parseRecallInfo(workflowTemp.thankYouCard.headline, attributes);
      if (workflowTemp.thankYouCard.subheader && workflowTemp.thankYouCard.subheader.includes("recall:")) {
        workflowTemp.thankYouCard.subheader = parseRecallInfo(
          workflowTemp.thankYouCard.subheader,
          attributes
        );
      }
    }
  }
  return workflowTemp;
};
