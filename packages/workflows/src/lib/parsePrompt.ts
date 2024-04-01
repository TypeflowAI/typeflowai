import { PromptAttributes } from "@typeflowai/types/prompt";

export function processPromptMessage(
  promptMessage: string,
  promptAttributes: Record<string, string | null | undefined>,
  questionAnswers: Record<string, string | number | string[]>
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(promptMessage, "text/html");
  const mentions = doc.querySelectorAll('span[data-type="mention"]');

  let prefix = "";

  if (promptAttributes) {
    for (const key in promptAttributes) {
      if (promptAttributes.hasOwnProperty(key)) {
        const attributeValue = promptAttributes[key];
        const attibuteTitle = PromptAttributes[key as keyof typeof PromptAttributes];
        if (attibuteTitle) {
          prefix += `${attibuteTitle}: ${attributeValue}\n`;
        }
      }
    }
  }

  mentions.forEach((mention) => {
    const questionId = mention.getAttribute("data-id");
    if (questionId) {
      let questionValue = questionAnswers[questionId];

      if (typeof questionValue === "number") {
        questionValue = questionValue.toString();
      } else if (Array.isArray(questionValue)) {
        questionValue = questionValue.join(", ");
      } else if (typeof questionValue !== "string") {
        questionValue = "";
      }

      mention.textContent = questionValue || `@${questionId}`;
    }
  });

  const fullMessage = `${prefix}${doc.body.textContent || doc.body.innerText}`;

  return fullMessage;
}
