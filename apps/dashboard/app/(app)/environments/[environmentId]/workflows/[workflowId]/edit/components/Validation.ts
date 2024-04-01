// extend this object in order to add more validation rules
import {
  TWorkflowConsentQuestion,
  TWorkflowMultipleChoiceMultiQuestion,
  TWorkflowMultipleChoiceSingleQuestion,
  TWorkflowPictureSelectionQuestion,
  TWorkflowQuestion,
} from "@typeflowai/types/workflows";

const validationRules = {
  multipleChoiceMulti: (question: TWorkflowMultipleChoiceMultiQuestion) => {
    return !question.choices.some((element) => element.label.trim() === "");
  },
  multipleChoiceSingle: (question: TWorkflowMultipleChoiceSingleQuestion) => {
    return !question.choices.some((element) => element.label.trim() === "");
  },
  consent: (question: TWorkflowConsentQuestion) => {
    return question.label.trim() !== "";
  },
  pictureSelection: (question: TWorkflowPictureSelectionQuestion) => {
    return question.choices.length >= 2;
  },
  defaultValidation: (question: TWorkflowQuestion) => {
    return question.headline.trim() !== "";
  },
};

const validateQuestion = (question) => {
  const specificValidation = validationRules[question.type];
  const defaultValidation = validationRules.defaultValidation;

  const specificValidationResult = specificValidation ? specificValidation(question) : true;
  const defaultValidationResult = defaultValidation(question);

  // Return true only if both specific and default validation pass
  return specificValidationResult && defaultValidationResult;
};

export { validateQuestion };
