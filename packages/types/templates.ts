import { z } from "zod";

import {
  ZLegacyWorkflowQuestions,
  ZLegacyWorkflowThankYouCard,
  ZLegacyWorkflowWelcomeCard,
} from "./legacyWorkflow";
import { ZUserObjective } from "./user";
import {
  ZWorkflowHiddenFields,
  ZWorkflowPrompt,
  ZWorkflowQuestions,
  ZWorkflowThankYouCard,
  ZWorkflowWelcomeCard,
} from "./workflows";

export const ZTemplate = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.any().optional(),
  category: z
    .enum(["Marketing", "Sales", "Startup", "Support", "Virtual Assistant", "Agency", "Human Resources"])
    .optional(),
  subcategory: z.string().optional(),
  objectives: z.array(ZUserObjective).optional(),
  isPremium: z.boolean().optional(),
  preset: z.object({
    name: z.string(),
    icon: z.any().optional(),
    welcomeCard: ZWorkflowWelcomeCard,
    questions: ZWorkflowQuestions,
    prompt: ZWorkflowPrompt,
    thankYouCard: ZWorkflowThankYouCard,
    hiddenFields: ZWorkflowHiddenFields,
  }),
});

export type TTemplate = z.infer<typeof ZTemplate>;

export const ZLegacyTemplate = ZTemplate.extend({
  preset: z.object({
    name: z.string(),
    icon: z.any().optional(),
    welcomeCard: ZLegacyWorkflowWelcomeCard,
    questions: ZLegacyWorkflowQuestions,
    prompt: ZWorkflowPrompt,
    thankYouCard: ZLegacyWorkflowThankYouCard,
    hiddenFields: ZWorkflowHiddenFields,
  }),
});

export type TLegacyTemplate = z.infer<typeof ZLegacyTemplate>;
