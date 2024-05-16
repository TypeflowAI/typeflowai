import "server-only";

import { TLegacyWorkflow, ZLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TI18nString, TWorkflow } from "@typeflowai/types/workflows";

import { structuredClone } from "../pollyfills/structuredClone";
import { isI18nObject } from "./utils";

// Helper function to extract a regular string from an i18nString.
const extractStringFromI18n = (i18nString: TI18nString, languageCode: string): string => {
  if (typeof i18nString === "object" && i18nString !== null) {
    return i18nString[languageCode] || "";
  }
  return i18nString;
};

// Assuming I18nString and extraction logic are defined
const reverseTranslateObject = <T extends Record<string, any>>(obj: T, languageCode: string): T => {
  const clonedObj = structuredClone(obj);
  for (let key in clonedObj) {
    const value = clonedObj[key];
    if (isI18nObject(value)) {
      // Now TypeScript knows `value` is I18nString, treat it accordingly
      clonedObj[key] = extractStringFromI18n(value, languageCode) as T[Extract<keyof T, string>];
    } else if (typeof value === "object" && value !== null) {
      // Recursively handle nested objects
      clonedObj[key] = reverseTranslateObject(value, languageCode);
    }
  }
  return clonedObj;
};

export const reverseTranslateWorkflow = (
  workflow: TWorkflow,
  languageCode: string = "default"
): TLegacyWorkflow => {
  const reversedWorkflow = structuredClone(workflow);
  reversedWorkflow.questions = reversedWorkflow.questions.map((question) =>
    reverseTranslateObject(question, languageCode)
  );

  // check if the headline is an empty object, if so, add a "default" key
  // TODO: This is a temporary fix, should be handled propperly
  if (
    reversedWorkflow.welcomeCard.headline &&
    Object.keys(reversedWorkflow.welcomeCard.headline).length === 0
  ) {
    reversedWorkflow.welcomeCard.headline = { default: "" };
  }

  reversedWorkflow.welcomeCard = reverseTranslateObject(reversedWorkflow.welcomeCard, languageCode);
  reversedWorkflow.thankYouCard = reverseTranslateObject(reversedWorkflow.thankYouCard, languageCode);
  // validate the type with zod
  return ZLegacyWorkflow.parse(reversedWorkflow);
};
