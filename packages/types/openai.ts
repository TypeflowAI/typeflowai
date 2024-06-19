import { z } from "zod";

export enum OpenAIModel {
  GPT35Turbo = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
  GPT4Turbo = "gpt-4-turbo",
  GPT4o = "gpt-4o",
}

export const ZOpenAIModel = z.nativeEnum(OpenAIModel);

export const ZOpenAIMessage = z.object({
  role: z.string(),
  content: z.string(),
});

export const ZOpenAIMessages = z.array(ZOpenAIMessage);

export const ZOpenAIRequest = z.object({
  messages: ZOpenAIMessages,
  model: ZOpenAIModel,
  temperature: z.number().optional(),
  max_tokens: z.number().optional(),
  top_p: z.number().optional(),
  frequency_penalty: z.number().optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  stream: z.boolean().optional(),
});

export type TOpenAIRequest = z.infer<typeof ZOpenAIRequest>;

const ZOpenAIChoice = z.object({
  message: ZOpenAIMessage,
  index: z.number(),
  logprobs: z.number().optional(),
  finish_reason: z.string(),
});

const ZOpenAIResponse = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(ZOpenAIChoice),
  limitReached: z.boolean().optional(),
});

export type TOpenAIResponse = z.infer<typeof ZOpenAIResponse>;
