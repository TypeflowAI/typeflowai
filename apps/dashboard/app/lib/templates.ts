import { TTemplate } from "@typeflowai/types/templates";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

export const replaceQuestionPresetPlaceholders = (question: TWorkflowQuestion, product) => {
  if (!question) return;
  if (!product) return question;
  const newQuestion = JSON.parse(JSON.stringify(question));
  if (newQuestion.headline) {
    newQuestion.headline = newQuestion.headline.replace("{{productName}}", product.name);
  }
  if (newQuestion.subheader) {
    newQuestion.subheader = newQuestion.subheader?.replace("{{productName}}", product.name);
  }
  return newQuestion;
};

// replace all occurences of productName with the actual product name in the current template
export const replacePresetPlaceholders = (template: TTemplate, product: any) => {
  const preset = JSON.parse(JSON.stringify(template.preset));
  preset.name = preset.name.replace("{{productName}}", product.name);
  preset.questions = preset.questions.map((question) => {
    return replaceQuestionPresetPlaceholders(question, product);
  });
  return { ...template, preset };
};
