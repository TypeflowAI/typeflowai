import { z } from "zod";

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
