import { z } from "zod";

import { ZUuid } from "./user";

export const ZDisplay = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  personId: z.string().cuid().nullable(),
  workflowId: z.string().cuid(),
  responseId: z.string().cuid().nullable(),
  status: z.enum(["seen", "responded"]).optional(),
});

export type TDisplay = z.infer<typeof ZDisplay>;

export const ZDisplayCreateInput = z.object({
  environmentId: z.string().cuid(),
  workflowId: z.string().cuid(),
  userId: ZUuid.optional(),
  responseId: z.string().cuid().optional(),
});

export type TDisplayCreateInput = z.infer<typeof ZDisplayCreateInput>;

export const ZDisplayUpdateInput = z.object({
  environmentId: z.string().cuid(),
  userId: ZUuid.optional(),
  responseId: z.string().cuid().optional(),
});

export type TDisplayUpdateInput = z.infer<typeof ZDisplayUpdateInput>;

export const ZDisplaysWithWorkflowName = ZDisplay.extend({
  workflowName: z.string(),
});

export type TDisplaysWithWorkflowName = z.infer<typeof ZDisplaysWithWorkflowName>;
