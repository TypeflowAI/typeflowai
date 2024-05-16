import { describe, expect, it } from "vitest";

import {
  mockLegacyWorkflow,
  mockThankYouCard,
  mockTranslatedThankYouCard,
  mockTranslatedWelcomeCard,
  mockTranslatedWorkflow,
  mockWelcomeCard,
  mockWorkflow,
} from "./i18n.mock";
import { reverseTranslateWorkflow } from "./reverseTranslation";
import { createI18nString, translateThankYouCard, translateWelcomeCard, translateWorkflow } from "./utils";

describe("createI18nString", () => {
  it("should create an i18n string from a regular string", () => {
    const result = createI18nString("Hello", ["default"]);
    expect(result).toEqual({ default: "Hello" });
  });

  it("should create a new i18n string with i18n enabled from a previous i18n string", () => {
    const result = createI18nString({ default: "Hello" }, ["default", "es"]);
    expect(result).toEqual({ default: "Hello", es: "" });
  });

  it("should add a new field key value pair when a new language is added", () => {
    const i18nObject = { default: "Hello", es: "Hola" };
    const newLanguages = ["default", "es", "de"];
    const result = createI18nString(i18nObject, newLanguages);
    expect(result).toEqual({
      default: "Hello",
      es: "Hola",
      de: "",
    });
  });

  it("should remove the translation that are not present in newLanguages", () => {
    const i18nObject = { default: "Hello", es: "hola" };
    const newLanguages = ["default"];
    const result = createI18nString(i18nObject, newLanguages);
    expect(result).toEqual({
      default: "Hello",
    });
  });
});

describe("translateWelcomeCard", () => {
  it("should translate all text fields of a welcome card", () => {
    const languages = ["default", "de"];
    const translatedWelcomeCard = translateWelcomeCard(mockWelcomeCard, languages);
    expect(translatedWelcomeCard).toEqual(mockTranslatedWelcomeCard);
  });
});

describe("translateThankYouCard", () => {
  it("should translate all text fields of a Thank you card", () => {
    const languages = ["default", "de"];
    const translatedThankYouCard = translateThankYouCard(mockThankYouCard, languages);
    expect(translatedThankYouCard).toEqual(mockTranslatedThankYouCard);
  });
});

describe("translateWorkflow", () => {
  it("should translate all questions of a Workflow", () => {
    const languageCodes = ["default", "de"];
    const translatedWorkflow = translateWorkflow(mockWorkflow, languageCodes);
    expect(translatedWorkflow).toEqual(mockTranslatedWorkflow);
  });
});

describe("translate to Legacy Workflow", () => {
  it("should translate all questions of a normal workflow to Legacy Workflow", () => {
    const translatedWorkflow = reverseTranslateWorkflow(mockTranslatedWorkflow, "default");
    expect(translatedWorkflow).toEqual(mockLegacyWorkflow);
  });
});
