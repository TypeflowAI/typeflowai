import { z } from "zod";

export * from "./sharedTypes";

export const ZIntegrationBase = z.object({
  id: z.string(),
  environmentId: z.string(),
});

export const ZIntegrationBaseWorkflowData = z.object({
  createdAt: z.date(),
  questionIds: z.array(z.string()),
  questions: z.string(),
  workflowId: z.string(),
  workflowName: z.string(),
});
