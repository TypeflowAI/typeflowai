import { OpenAIModel } from "@typeflowai/types/openai";

export const adjustEngineForTemplate = (template, isEngineLimited) => {
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

export const adjustPromptForTemplate = (template) => {
  let { message } = template.preset.prompt;

  // Modificación aquí para incluir guiones en la expresión regular
  message = message.replace(
    /@([\w-]+)/g,
    '<span data-type="mention" class="mention" data-id="$1">@$1</span>'
  );

  const paragraphs = message
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p class="paragraph">${line.trim()}</p>`)
    .join("");

  template.preset.prompt.message = paragraphs;

  return template;
};
