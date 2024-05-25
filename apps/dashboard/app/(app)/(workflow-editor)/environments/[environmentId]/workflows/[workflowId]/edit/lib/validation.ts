// extend this object in order to add more validation rules
import { isEqual } from "lodash";
import { toast } from "react-hot-toast";

import { extractLanguageCodes, getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { checkForEmptyFallBackValue } from "@typeflowai/lib/utils/recall";
import { ZSegmentFilters } from "@typeflowai/types/segment";
import {
  TI18nString,
  TWorkflow,
  TWorkflowCTAQuestion,
  TWorkflowConsentQuestion,
  TWorkflowLanguage,
  TWorkflowMatrixQuestion,
  TWorkflowMultipleChoiceQuestion,
  TWorkflowOpenTextQuestion,
  TWorkflowPictureSelectionQuestion,
  TWorkflowQuestion,
  TWorkflowQuestionType,
  TWorkflowQuestions,
  TWorkflowThankYouCard,
  TWorkflowWelcomeCard,
} from "@typeflowai/types/workflows";

// Utility function to check if label is valid for all required languages
export const isLabelValidForAllLanguages = (
  label: TI18nString,
  workflowLanguages: TWorkflowLanguage[]
): boolean => {
  const filteredLanguages = workflowLanguages.filter((workflowLanguages) => {
    return workflowLanguages.enabled;
  });
  const languageCodes = extractLanguageCodes(filteredLanguages);
  const languages = languageCodes.length === 0 ? ["default"] : languageCodes;
  return languages.every((language) => label && label[language] && label[language].trim() !== "");
};

// Validation logic for multiple choice questions
const handleI18nCheckForMultipleChoice = (
  question: TWorkflowMultipleChoiceQuestion,
  languages: TWorkflowLanguage[]
): boolean => {
  return question.choices.every((choice) => isLabelValidForAllLanguages(choice.label, languages));
};

const hasDuplicates = (labels: TI18nString[]) => {
  const flattenedLabels = labels
    .map((label) =>
      Object.keys(label)
        .map((lang) => {
          const text = label[lang].trim().toLowerCase();
          return text && `${lang}:${text}`;
        })
        .filter((text) => text)
    )
    .flat();
  const uniqueLabels = new Set(flattenedLabels);
  return uniqueLabels.size !== flattenedLabels.length;
};

const handleI18nCheckForMatrixLabels = (
  question: TWorkflowMatrixQuestion,
  languages: TWorkflowLanguage[]
): boolean => {
  const rowsAndColumns = [...question.rows, ...question.columns];

  if (hasDuplicates(question.rows)) {
    return false;
  }

  if (hasDuplicates(question.columns)) {
    return false;
  }
  return rowsAndColumns.every((label) => isLabelValidForAllLanguages(label, languages));
};

// Validation rules
export const validationRules = {
  openText: (question: TWorkflowOpenTextQuestion, languages: TWorkflowLanguage[]) => {
    return question.placeholder &&
      getLocalizedValue(question.placeholder, "default").trim() !== "" &&
      languages.length > 1
      ? isLabelValidForAllLanguages(question.placeholder, languages)
      : true;
  },
  multipleChoiceMulti: (question: TWorkflowMultipleChoiceQuestion, languages: TWorkflowLanguage[]) => {
    return handleI18nCheckForMultipleChoice(question, languages);
  },
  multipleChoiceSingle: (question: TWorkflowMultipleChoiceQuestion, languages: TWorkflowLanguage[]) => {
    return handleI18nCheckForMultipleChoice(question, languages);
  },
  consent: (question: TWorkflowConsentQuestion, languages: TWorkflowLanguage[]) => {
    return isLabelValidForAllLanguages(question.label, languages);
  },
  pictureSelection: (question: TWorkflowPictureSelectionQuestion) => {
    return question.choices.length >= 2;
  },
  cta: (question: TWorkflowCTAQuestion, languages: TWorkflowLanguage[]) => {
    return !question.required && question.dismissButtonLabel
      ? isLabelValidForAllLanguages(question.dismissButtonLabel, languages)
      : true;
  },
  matrix: (question: TWorkflowMatrixQuestion, languages: TWorkflowLanguage[]) => {
    return handleI18nCheckForMatrixLabels(question, languages);
  },
  // Assuming headline is of type TI18nString
  defaultValidation: (
    question: TWorkflowQuestion,
    languages: TWorkflowLanguage[],
    isFirstQuestion: boolean
  ) => {
    // headline and subheader are default for every question
    const isHeadlineValid = isLabelValidForAllLanguages(question.headline, languages);
    const isSubheaderValid =
      question.subheader &&
      getLocalizedValue(question.subheader, "default").trim() !== "" &&
      languages.length > 1
        ? isLabelValidForAllLanguages(question.subheader, languages)
        : true;
    let isValid = isHeadlineValid && isSubheaderValid;
    const defaultLanguageCode = "default";
    //question specific fields
    let fieldsToValidate = ["html", "buttonLabel", "upperLabel", "backButtonLabel", "lowerLabel"];

    // Remove backButtonLabel from validation if it is the first question
    if (isFirstQuestion) {
      fieldsToValidate = fieldsToValidate.filter((field) => field !== "backButtonLabel");
    }

    for (const field of fieldsToValidate) {
      if (question[field] && typeof question[field][defaultLanguageCode] !== "undefined") {
        isValid = isValid && isLabelValidForAllLanguages(question[field], languages);
      }
    }

    return isValid;
  },
};

// Main validation function
export const validateQuestion = (
  question: TWorkflowQuestion,
  workflowLanguages: TWorkflowLanguage[],
  isFirstQuestion: boolean
): boolean => {
  const specificValidation = validationRules[question.type];
  const defaultValidation = validationRules.defaultValidation;

  const specificValidationResult = specificValidation
    ? specificValidation(question, workflowLanguages)
    : true;
  const defaultValidationResult = defaultValidation(question, workflowLanguages, isFirstQuestion);

  // Return true only if both specific and default validation pass
  return specificValidationResult && defaultValidationResult;
};

export const validateWorkflowQuestionsInBatch = (
  question: TWorkflowQuestion,
  invalidQuestions: string[] | null,
  workflowLanguages: TWorkflowLanguage[],
  isFirstQuestion: boolean
) => {
  if (invalidQuestions === null) {
    return [];
  }

  if (validateQuestion(question, workflowLanguages, isFirstQuestion)) {
    return invalidQuestions.filter((id) => id !== question.id);
  } else if (!invalidQuestions.includes(question.id)) {
    return [...invalidQuestions, question.id];
  }

  return invalidQuestions;
};

export const isCardValid = (
  card: TWorkflowWelcomeCard | TWorkflowThankYouCard,
  cardType: "start" | "end",
  workflowLanguages: TWorkflowLanguage[]
): boolean => {
  const defaultLanguageCode = "default";
  const isContentValid = (content: Record<string, string> | undefined) => {
    return (
      !content ||
      content[defaultLanguageCode] === "" ||
      isLabelValidForAllLanguages(content, workflowLanguages)
    );
  };

  return (
    (card.headline ? isLabelValidForAllLanguages(card.headline, workflowLanguages) : true) &&
    isContentValid(
      cardType === "start" ? (card as TWorkflowWelcomeCard).html : (card as TWorkflowThankYouCard).subheader
    ) &&
    isContentValid(card.buttonLabel)
  );
};

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to validate question ID and Hidden field Id
export const validateId = (
  type: "Hidden field" | "Question",
  field: string,
  existingQuestionIds: string[],
  existingHiddenFieldIds: string[]
): boolean => {
  if (field.trim() === "") {
    toast.error(`Please enter a ${type} Id.`);
    return false;
  }

  const combinedIds = [...existingQuestionIds, ...existingHiddenFieldIds];

  if (combinedIds.findIndex((id) => id.toLowerCase() === field.toLowerCase()) !== -1) {
    toast.error(`${type} Id already exists in questions or hidden fields.`);
    return false;
  }

  const forbiddenIds = [
    "userId",
    "source",
    "suid",
    "end",
    "start",
    "welcomeCard",
    "hidden",
    "verifiedEmail",
    "multiLanguage",
  ];
  if (forbiddenIds.includes(field)) {
    toast.error(`${type} Id not allowed.`);
    return false;
  }

  if (field.includes(" ")) {
    toast.error(`${type} Id not allowed, avoid using spaces.`);
    return false;
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(field)) {
    toast.error(`${type} Id not allowed, use only alphanumeric characters, hyphens, or underscores.`);
    return false;
  }

  return true;
};

// Checks if there is a cycle present in the workflow data logic.
export const isWorkflowLogicCyclic = (questions: TWorkflowQuestions) => {
  const visited: Record<string, boolean> = {};
  const recStack: Record<string, boolean> = {};

  const checkForCycle = (questionId: string) => {
    if (!visited[questionId]) {
      visited[questionId] = true;
      recStack[questionId] = true;

      const question = questions.find((question) => question.id === questionId);
      if (question && question.logic && question.logic.length > 0) {
        for (const logic of question.logic) {
          const destination = logic.destination;
          if (!destination) {
            return false;
          }

          if (!visited[destination] && checkForCycle(destination)) {
            return true;
          } else if (recStack[destination]) {
            return true;
          }
        }
      } else {
        // Handle default behavior
        const nextQuestionIndex = questions.findIndex((question) => question.id === questionId) + 1;
        const nextQuestion = questions[nextQuestionIndex];
        if (nextQuestion && !visited[nextQuestion.id] && checkForCycle(nextQuestion.id)) {
          return true;
        }
      }
    }

    recStack[questionId] = false;
    return false;
  };

  for (const question of questions) {
    const questionId = question.id;
    if (checkForCycle(questionId)) {
      return true;
    }
  }

  return false;
};

export const isWorkflowValid = (
  workflow: TWorkflow,
  faultyQuestions: string[],
  setInvalidQuestions: (questions: string[]) => void,
  selectedLanguageCode: string,
  setSelectedLanguageCode: (languageCode: string) => void
) => {
  const existingQuestionIds = new Set();

  // Ensuring at least one question is added to the workflow.
  if (workflow.questions.length === 0) {
    toast.error("Please add at least one question");
    return false;
  }

  // Checking the validity of the welcome and thank-you cards if they are enabled.
  if (workflow.welcomeCard.enabled) {
    if (!isCardValid(workflow.welcomeCard, "start", workflow.languages)) {
      faultyQuestions.push("start");
    }
  }

  if (workflow.thankYouCard.enabled) {
    if (!isCardValid(workflow.thankYouCard, "end", workflow.languages)) {
      faultyQuestions.push("end");
    }
  }

  // Verifying that any provided PIN is exactly four digits long.
  const pin = workflow.pin;
  if (pin && pin.toString().length !== 4) {
    toast.error("PIN must be a four digit number.");
    return false;
  }

  // Assessing each question for completeness and correctness,
  for (let index = 0; index < workflow.questions.length; index++) {
    const question = workflow.questions[index];
    const isFirstQuestion = index === 0;
    const isValid = validateQuestion(question, workflow.languages, isFirstQuestion);

    if (!isValid) {
      faultyQuestions.push(question.id);
    }
  }

  // if there are any faulty questions, the user won't be allowed to save the workflow
  if (faultyQuestions.length > 0) {
    setInvalidQuestions(faultyQuestions);
    setSelectedLanguageCode("default");
    toast.error("Please check for empty fields or duplicate labels");
    return false;
  }

  for (const question of workflow.questions) {
    const existingLogicConditions = new Set();

    if (existingQuestionIds.has(question.id)) {
      toast.error("There are 2 identical question IDs. Please update one.");
      return false;
    }
    existingQuestionIds.add(question.id);

    if (
      question.type === TWorkflowQuestionType.MultipleChoiceSingle ||
      question.type === TWorkflowQuestionType.MultipleChoiceMulti
    ) {
      const haveSameChoices =
        question.choices.some((element) => element.label[selectedLanguageCode]?.trim() === "") ||
        question.choices.some((element, index) =>
          question.choices
            .slice(index + 1)
            .some(
              (nextElement) =>
                nextElement.label[selectedLanguageCode]?.trim() === element.label[selectedLanguageCode].trim()
            )
        );

      if (haveSameChoices) {
        toast.error("You have empty or duplicate choices.");
        return false;
      }
    }

    for (const logic of question.logic || []) {
      const validFields = ["condition", "destination", "value"].filter(
        (field) => logic[field] !== undefined
      ).length;

      if (validFields < 2) {
        setInvalidQuestions([question.id]);
        toast.error("Incomplete logic jumps detected: Fill or remove them in the Questions tab.");
        return false;
      }

      if (question.required && logic.condition === "skipped") {
        toast.error("A logic condition is missing: Please update or delete it in the Questions tab.");
        return false;
      }

      const thisLogic = `${logic.condition}-${logic.value}`;
      if (existingLogicConditions.has(thisLogic)) {
        setInvalidQuestions([question.id]);
        toast.error(
          "There are two competing logic conditons: Please update or delete one in the Questions tab."
        );
        return false;
      }
      existingLogicConditions.add(thisLogic);
    }
  }

  // Checking the validity of redirection URLs to ensure they are properly formatted.
  if (
    workflow.redirectUrl &&
    !workflow.redirectUrl.includes("https://") &&
    !workflow.redirectUrl.includes("http://")
  ) {
    toast.error("Please enter a valid URL for redirecting respondents.");
    return false;
  }

  // validate the user segment filters
  const localWorkflowSegment = {
    id: workflow.segment?.id,
    filters: workflow.segment?.filters,
    title: workflow.segment?.title,
    description: workflow.segment?.description,
  };

  const workflowSegment = {
    id: workflow.segment?.id,
    filters: workflow.segment?.filters,
    title: workflow.segment?.title,
    description: workflow.segment?.description,
  };

  // if the non-private segment in the workflow and the strippedWorkflow are different, don't save
  if (!workflow.segment?.isPrivate && !isEqual(localWorkflowSegment, workflowSegment)) {
    toast.error("Please save the audience filters before saving the workflow");
    return false;
  }

  if (!!workflow.segment?.filters?.length) {
    const parsedFilters = ZSegmentFilters.safeParse(workflow.segment.filters);
    if (!parsedFilters.success) {
      const errMsg =
        parsedFilters.error.issues.find((issue) => issue.code === "custom")?.message ||
        "Invalid targeting: Please check your audience filters";
      toast.error(errMsg);
      return false;
    }
  }

  const questionWithEmptyFallback = checkForEmptyFallBackValue(workflow, selectedLanguageCode);
  if (questionWithEmptyFallback) {
    toast.error("Fallback missing");
    return false;
  }

  // Detecting any cyclic dependencies in workflow logic.
  if (isWorkflowLogicCyclic(workflow.questions)) {
    toast.error("Cyclic logic detected. Please fix it before saving.");
    return false;
  }

  if (workflow.type === "app" && workflow.segment?.id === "temp") {
    const { filters } = workflow.segment;

    const parsedFilters = ZSegmentFilters.safeParse(filters);
    if (!parsedFilters.success) {
      const errMsg =
        parsedFilters.error.issues.find((issue) => issue.code === "custom")?.message ||
        "Invalid targeting: Please check your audience filters";
      toast.error(errMsg);
      return;
    }
  }

  return true;
};
