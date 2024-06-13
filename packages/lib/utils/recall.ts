import {
  TI18nString,
  TWorkflow,
  TWorkflowQuestion,
  TWorkflowQuestionsObject,
} from "@typeflowai/types/workflows";

import { getLocalizedValue } from "../i18n/utils";
import { structuredClone } from "../pollyfills/structuredClone";

export interface fallbacks {
  [id: string]: string;
}

// Extracts the ID of recall question from a string containing the "recall" pattern.
export const extractId = (text: string): string | null => {
  const pattern = /#recall:([A-Za-z0-9_-]+)/;
  const match = text.match(pattern);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
};

// If there are multiple recall infos in a string extracts all recall question IDs from that string and construct an array out of it.
export const extractIds = (text: string): string[] => {
  const pattern = /#recall:([A-Za-z0-9_-]+)/g;
  const matches = Array.from(text.matchAll(pattern));
  return matches.map((match) => match[1]).filter((id) => id !== null);
};

// Extracts the fallback value from a string containing the "fallback" pattern.
export const extractFallbackValue = (text: string): string => {
  const pattern = /fallback:(\S*)#/;
  const match = text.match(pattern);
  if (match && match[1]) {
    return match[1];
  } else {
    return "";
  }
};

// Extracts the complete recall information (ID and fallback) from a headline string.
export const extractRecallInfo = (headline: string): string | null => {
  const pattern = /#recall:([A-Za-z0-9_-]+)\/fallback:(\S*)#/;
  const match = headline.match(pattern);
  return match ? match[0] : null;
};

// Finds the recall information by a specific recall question ID within a text.
export const findRecallInfoById = (text: string, id: string): string | null => {
  const pattern = new RegExp(`#recall:${id}\\/fallback:(\\S*)#`, "g");
  const match = text.match(pattern);
  return match ? match[0] : null;
};

// Converts recall information in a headline to a corresponding recall question headline, with or without a slash.
export const recallToHeadline = <T extends TWorkflowQuestionsObject>(
  headline: TI18nString,
  workflow: T,
  withSlash: boolean,
  language: string
): TI18nString => {
  let newHeadline = structuredClone(headline);
  if (!newHeadline[language]?.includes("#recall:")) return headline;

  while (newHeadline[language].includes("#recall:")) {
    const recallInfo = extractRecallInfo(getLocalizedValue(newHeadline, language));
    if (recallInfo) {
      const questionId = extractId(recallInfo);
      let questionHeadline = getLocalizedValue(
        workflow.questions.find((question) => question.id === questionId)?.headline,
        language
      );
      while (questionHeadline?.includes("#recall:")) {
        const recallInfo = extractRecallInfo(questionHeadline);
        if (recallInfo) {
          questionHeadline = questionHeadline.replaceAll(recallInfo, "___");
        }
      }
      if (withSlash) {
        newHeadline[language] = newHeadline[language].replace(recallInfo, `/${questionHeadline}\\`);
      } else {
        newHeadline[language] = newHeadline[language].replace(recallInfo, `@${questionHeadline}`);
      }
    }
  }
  return newHeadline;
};

// Replaces recall information in a workflow question's headline with an ___.
export const replaceRecallInfoWithUnderline = (
  recallQuestion: TWorkflowQuestion,
  language: string
): TWorkflowQuestion => {
  while (getLocalizedValue(recallQuestion.headline, language).includes("#recall:")) {
    const recallInfo = extractRecallInfo(getLocalizedValue(recallQuestion.headline, language));
    if (recallInfo) {
      recallQuestion.headline[language] = getLocalizedValue(recallQuestion.headline, language).replace(
        recallInfo,
        "___"
      );
    }
  }
  return recallQuestion;
};

// Checks for workflow questions with a "recall" pattern but no fallback value.
export const checkForEmptyFallBackValue = (
  workflow: TWorkflow,
  langauge: string
): TWorkflowQuestion | null => {
  const findRecalls = (text: string) => {
    const recalls = text.match(/#recall:[^ ]+/g);
    return recalls && recalls.some((recall) => !extractFallbackValue(recall));
  };
  for (const question of workflow.questions) {
    if (
      findRecalls(getLocalizedValue(question.headline, langauge)) ||
      (question.subheader && findRecalls(getLocalizedValue(question.subheader, langauge)))
    ) {
      return question;
    }
  }
  return null;
};

// Processes each question in a workflow to ensure headlines are formatted correctly for recall and return the modified workflow.
export const checkForRecallInHeadline = <T extends TWorkflowQuestionsObject>(
  workflow: T,
  langauge: string
): T => {
  const modifiedWorkflow: T = structuredClone(workflow);
  modifiedWorkflow.questions.forEach((question) => {
    question.headline = recallToHeadline(question.headline, modifiedWorkflow, false, langauge);
  });
  return modifiedWorkflow;
};

// Retrieves an array of workflow questions referenced in a text containing recall information.
export const getRecallQuestions = (
  text: string,
  workflow: TWorkflow,
  langauge: string
): TWorkflowQuestion[] => {
  if (!text.includes("#recall:")) return [];

  const ids = extractIds(text);
  let recallQuestionArray: TWorkflowQuestion[] = [];
  ids.forEach((questionId) => {
    let recallQuestion = workflow.questions.find((question) => question.id === questionId);
    if (recallQuestion) {
      let recallQuestionTemp = structuredClone(recallQuestion);
      recallQuestionTemp = replaceRecallInfoWithUnderline(recallQuestionTemp, langauge);
      recallQuestionArray.push(recallQuestionTemp);
    }
  });
  return recallQuestionArray;
};

// Constructs a fallbacks object from a text containing multiple recall and fallback patterns.
export const getFallbackValues = (text: string): fallbacks => {
  if (!text.includes("#recall:")) return {};
  const pattern = /#recall:([A-Za-z0-9_-]+)\/fallback:([\S*]+)#/g;
  let match;
  const fallbacks: fallbacks = {};

  while ((match = pattern.exec(text)) !== null) {
    const id = match[1];
    const fallbackValue = match[2];
    fallbacks[id] = fallbackValue;
  }
  return fallbacks;
};

// Transforms headlines in a text to their corresponding recall information.
export const headlineToRecall = (
  text: string,
  recallQuestions: TWorkflowQuestion[],
  fallbacks: fallbacks,
  langauge: string
): string => {
  recallQuestions.forEach((recallQuestion) => {
    const recallInfo = `#recall:${recallQuestion.id}/fallback:${fallbacks[recallQuestion.id]}#`;
    text = text.replace(`@${recallQuestion.headline[langauge]}`, recallInfo);
  });
  return text;
};
