import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { OpenAIModel } from "@typeflowai/types/openai";
import { TProduct } from "@typeflowai/types/product";
import { TTemplate } from "@typeflowai/types/templates";
import { TWorkflowQuestion } from "@typeflowai/types/workflows";

export const replaceQuestionPresetPlaceholders = (
  question: TWorkflowQuestion,
  product: TProduct
): TWorkflowQuestion => {
  if (!product) return question;
  const newQuestion = structuredClone(question);
  const defaultLanguageCode = "default";
  if (newQuestion.headline) {
    newQuestion.headline[defaultLanguageCode] = getLocalizedValue(
      newQuestion.headline,
      defaultLanguageCode
    ).replace("{{productName}}", product.name);
  }
  if (newQuestion.subheader) {
    newQuestion.subheader[defaultLanguageCode] = getLocalizedValue(
      newQuestion.subheader,
      defaultLanguageCode
    )?.replace("{{productName}}", product.name);
  }
  return newQuestion;
};

// replace all occurences of productName with the actual product name in the current template
export const replacePresetPlaceholders = (template: TTemplate, product: any) => {
  const preset = structuredClone(template.preset);
  preset.name = preset.name.replace("{{productName}}", product.name);
  preset.questions = preset.questions.map((question) => {
    return replaceQuestionPresetPlaceholders(question, product);
  });
  return { ...template, preset };
};

export const adjustEngineForTemplate = (template: any, isEngineLimited: boolean) => {
  if (isEngineLimited) {
    return {
      ...template,
      preset: {
        ...template.preset,
        prompt: {
          ...template.preset.prompt,
          engine: OpenAIModel.GPT35Turbo,
        },
      },
    };
  }
  return template;
};

export const adjustPromptForTemplate = (template: any) => {
  let { message } = template.preset.prompt;

  // Modificación aquí para incluir guiones en la expresión regular
  message = message.replace(
    /@([\w-]+)/g,
    '<span data-type="mention" class="mention" data-id="$1">@$1</span>'
  );

  const paragraphs = message
    .split("\n")
    .filter((line: any) => line.trim() !== "")
    .map((line: any) => `<p class="paragraph">${line.trim()}</p>`)
    .join("");

  template.preset.prompt.message = paragraphs;

  return template;
};
