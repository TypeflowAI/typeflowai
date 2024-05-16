import {
  TLegacyWorkflowChoice,
  TLegacyWorkflowQuestion,
  TLegacyWorkflowThankYouCard,
  TLegacyWorkflowWelcomeCard,
} from "@typeflowai/types/legacyWorkflow";
import { TLanguage } from "@typeflowai/types/product";
import {
  TI18nString,
  TWorkflowCTAQuestion,
  TWorkflowChoice,
  TWorkflowConsentQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
  TWorkflowNPSQuestion,
  TWorkflowOpenTextQuestion,
  TWorkflowQuestions,
  TWorkflowRatingQuestion,
  TWorkflowThankYouCard,
  TWorkflowWelcomeCard,
  ZWorkflowCTAQuestion,
  ZWorkflowCalQuestion,
  ZWorkflowConsentQuestion,
  ZWorkflowFileUploadQuestion,
  ZWorkflowMultipleChoiceMultiQuestion,
  ZWorkflowMultipleChoiceSingleQuestion,
  ZWorkflowNPSQuestion,
  ZWorkflowOpenTextQuestion,
  ZWorkflowPictureSelectionQuestion,
  ZWorkflowQuestion,
  ZWorkflowRatingQuestion,
  ZWorkflowThankYouCard,
  ZWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";
import {
  TWorkflow,
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowQuestion,
} from "@typeflowai/types/workflows";

// Helper function to create an i18nString from a regular string.
export const createI18nString = (text: string | TI18nString, languages: string[]): TI18nString => {
  if (typeof text === "object") {
    // It's already an i18n object, so clone it
    const i18nString: TI18nString = structuredClone(text);
    // Add new language keys with empty strings if they don't exist
    languages?.forEach((language) => {
      if (!(language in i18nString)) {
        i18nString[language] = "";
      }
    });

    // Remove language keys that are not in the languages array
    Object.keys(i18nString).forEach((key) => {
      if (key !== "default" && languages && !languages.includes(key)) {
        delete i18nString[key];
      }
    });

    return i18nString;
  } else {
    // It's a regular string, so create a new i18n object
    const i18nString: any = {
      ["default"]: text as string, // Type assertion to assure TypeScript `text` is a string
    };

    // Initialize all provided languages with empty strings
    languages?.forEach((language) => {
      if (language !== "default") {
        i18nString[language] = "";
      }
    });

    return i18nString;
  }
};

// Function to translate a choice label
const translateChoice = (
  choice: TWorkflowChoice | TLegacyWorkflowChoice,
  languages: string[]
): TWorkflowChoice => {
  if (typeof choice.label !== "undefined") {
    return {
      ...choice,
      label: createI18nString(choice.label, languages),
    };
  } else {
    return {
      ...choice,
      label: choice.label,
    };
  }
};

export const translateWelcomeCard = (
  welcomeCard: TWorkflowWelcomeCard | TLegacyWorkflowWelcomeCard,
  languages: string[]
): TWorkflowWelcomeCard => {
  const clonedWelcomeCard = structuredClone(welcomeCard);
  if (typeof welcomeCard.headline !== "undefined") {
    clonedWelcomeCard.headline = createI18nString(welcomeCard.headline ?? "", languages);
  }
  if (typeof welcomeCard.html !== "undefined") {
    clonedWelcomeCard.html = createI18nString(welcomeCard.html ?? "", languages);
  }
  if (typeof welcomeCard.buttonLabel !== "undefined") {
    clonedWelcomeCard.buttonLabel = createI18nString(clonedWelcomeCard.buttonLabel ?? "", languages);
  }

  return ZWorkflowWelcomeCard.parse(clonedWelcomeCard);
};

const translateThankYouCard = (
  thankYouCard: TWorkflowThankYouCard | TLegacyWorkflowThankYouCard,
  languages: string[]
): TWorkflowThankYouCard => {
  const clonedThankYouCard = structuredClone(thankYouCard);

  if (typeof thankYouCard.headline !== "undefined") {
    clonedThankYouCard.headline = createI18nString(thankYouCard.headline ?? "", languages);
  }

  if (typeof thankYouCard.subheader !== "undefined") {
    clonedThankYouCard.subheader = createI18nString(thankYouCard.subheader ?? "", languages);
  }

  if (typeof clonedThankYouCard.buttonLabel !== "undefined") {
    clonedThankYouCard.buttonLabel = createI18nString(thankYouCard.buttonLabel ?? "", languages);
  }
  return ZWorkflowThankYouCard.parse(clonedThankYouCard);
};

// Function that will translate a single question
const translateQuestion = (
  question: TLegacyWorkflowQuestion | TWorkflowQuestion,
  languages: string[]
): TWorkflowQuestion => {
  // Clone the question to avoid mutating the original
  const clonedQuestion = structuredClone(question);

  //common question properties
  if (typeof question.headline !== "undefined") {
    clonedQuestion.headline = createI18nString(question.headline ?? "", languages);
  }

  if (typeof question.subheader !== "undefined") {
    clonedQuestion.subheader = createI18nString(question.subheader ?? "", languages);
  }

  if (typeof question.buttonLabel !== "undefined") {
    clonedQuestion.buttonLabel = createI18nString(question.buttonLabel ?? "", languages);
  }

  if (typeof question.backButtonLabel !== "undefined") {
    clonedQuestion.backButtonLabel = createI18nString(question.backButtonLabel ?? "", languages);
  }

  switch (question.type) {
    case "openText":
      if (typeof question.placeholder !== "undefined") {
        (clonedQuestion as TWorkflowOpenTextQuestion).placeholder = createI18nString(
          question.placeholder ?? "",
          languages
        );
      }
      return ZWorkflowOpenTextQuestion.parse(clonedQuestion);

    case "multipleChoiceSingle":
    case "multipleChoiceMulti":
      (
        clonedQuestion as TWorkflowMultipleChoiceSingleQuestion | TWorkflowMultipleChoiceMultiQuestion
      ).choices = question.choices.map((choice) => {
        return translateChoice(choice, languages);
      });
      if (
        typeof (
          clonedQuestion as TWorkflowMultipleChoiceSingleQuestion | TWorkflowMultipleChoiceMultiQuestion
        ).otherOptionPlaceholder !== "undefined"
      ) {
        (
          clonedQuestion as TWorkflowMultipleChoiceSingleQuestion | TWorkflowMultipleChoiceMultiQuestion
        ).otherOptionPlaceholder = createI18nString(question.otherOptionPlaceholder ?? "", languages);
      }
      if (question.type === "multipleChoiceSingle") {
        return ZWorkflowMultipleChoiceSingleQuestion.parse(clonedQuestion);
      } else return ZWorkflowMultipleChoiceMultiQuestion.parse(clonedQuestion);

    case "cta":
      if (typeof question.dismissButtonLabel !== "undefined") {
        (clonedQuestion as TWorkflowCTAQuestion).dismissButtonLabel = createI18nString(
          question.dismissButtonLabel ?? "",
          languages
        );
      }
      if (typeof question.html !== "undefined") {
        (clonedQuestion as TWorkflowCTAQuestion).html = createI18nString(question.html ?? "", languages);
      }
      return ZWorkflowCTAQuestion.parse(clonedQuestion);

    case "consent":
      if (typeof question.html !== "undefined") {
        (clonedQuestion as TWorkflowConsentQuestion).html = createI18nString(question.html ?? "", languages);
      }

      if (typeof question.label !== "undefined") {
        (clonedQuestion as TWorkflowConsentQuestion).label = createI18nString(
          question.label ?? "",
          languages
        );
      }

      return ZWorkflowConsentQuestion.parse(clonedQuestion);

    case "nps":
      if (typeof question.lowerLabel !== "undefined") {
        (clonedQuestion as TWorkflowNPSQuestion).lowerLabel = createI18nString(
          question.lowerLabel ?? "",
          languages
        );
      }
      if (typeof question.upperLabel !== "undefined") {
        (clonedQuestion as TWorkflowNPSQuestion).upperLabel = createI18nString(
          question.upperLabel ?? "",
          languages
        );
      }
      return ZWorkflowNPSQuestion.parse(clonedQuestion);

    case "rating":
      if (typeof question.lowerLabel !== "undefined") {
        (clonedQuestion as TWorkflowRatingQuestion).lowerLabel = createI18nString(
          question.lowerLabel ?? "",
          languages
        );
      }

      if (typeof question.upperLabel !== "undefined") {
        (clonedQuestion as TWorkflowRatingQuestion).upperLabel = createI18nString(
          question.upperLabel ?? "",
          languages
        );
      }
      return ZWorkflowRatingQuestion.parse(clonedQuestion);

    case "fileUpload":
      return ZWorkflowFileUploadQuestion.parse(clonedQuestion);

    case "pictureSelection":
      return ZWorkflowPictureSelectionQuestion.parse(clonedQuestion);

    case "cal":
      return ZWorkflowCalQuestion.parse(clonedQuestion);

    default:
      return ZWorkflowQuestion.parse(clonedQuestion);
  }
};

export const extractLanguageIds = (languages: TLanguage[]): string[] => {
  return languages.map((language) => language.id);
};

// Function to translate an entire workflow
export const translateWorkflow = (
  workflow: Pick<TWorkflow, "questions" | "welcomeCard" | "thankYouCard">,
  languageCodes: string[]
): Pick<TWorkflow, "questions" | "welcomeCard" | "thankYouCard"> => {
  const translatedQuestions = workflow.questions.map((question) => {
    return translateQuestion(question, languageCodes);
  });
  const translatedWelcomeCard = translateWelcomeCard(workflow.welcomeCard, languageCodes);
  const translatedThankYouCard = translateThankYouCard(workflow.thankYouCard, languageCodes);
  const translatedWorkflow = structuredClone(workflow);
  return {
    ...translatedWorkflow,
    questions: translatedQuestions,
    welcomeCard: translatedWelcomeCard,
    thankYouCard: translatedThankYouCard,
  };
};

export const hasStringSubheaders = (questions: TWorkflowQuestions): boolean => {
  for (const question of questions) {
    if (typeof question.subheader !== "undefined") {
      return true;
    }
  }
  return false;
};
