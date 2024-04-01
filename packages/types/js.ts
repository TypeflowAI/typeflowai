import z from "zod";

import { ZActionClass } from "./actionClasses";
import { ZPersonAttributes, ZPersonClient } from "./people";
import { ZProduct } from "./product";
import { ZUuid } from "./user";
import { ZWorkflow } from "./workflows";

const ZWorkflowWithTriggers = ZWorkflow.extend({
  triggers: z.array(ZActionClass).or(z.array(z.string())),
});

export type TWorkflowWithTriggers = z.infer<typeof ZWorkflowWithTriggers>;

export const ZJSStateDisplay = z.object({
  createdAt: z.date(),
  workflowId: z.string().cuid(),
  responded: z.boolean(),
});

export type TJSStateDisplay = z.infer<typeof ZJSStateDisplay>;

export const ZJsStateSync = z.object({
  person: ZPersonClient.nullish(),
  workflows: z.array(ZWorkflow),
  noCodeActionClasses: z.array(ZActionClass),
  product: ZProduct,
});

export type TJsStateSync = z.infer<typeof ZJsStateSync>;

export const ZJsState = z.object({
  attributes: ZPersonAttributes,
  workflows: z.array(ZWorkflow),
  noCodeActionClasses: z.array(ZActionClass),
  product: ZProduct,
  displays: z.array(ZJSStateDisplay).optional(),
});

export type TJsState = z.infer<typeof ZJsState>;

export const ZJsPublicSyncInput = z.object({
  environmentId: z.string().cuid(),
});

export type TJsPublicSyncInput = z.infer<typeof ZJsPublicSyncInput>;

export const ZJsSyncInput = z.object({
  environmentId: z.string().cuid(),
  userId: ZUuid.optional().optional(),
  jsVersion: z.string().optional(),
});

export type TJsSyncInput = z.infer<typeof ZJsSyncInput>;

export const ZJsConfig = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: ZUuid.optional(),
  state: ZJsState,
  expiresAt: z.date(),
});

export type TJsConfig = z.infer<typeof ZJsConfig>;

export const ZJsConfigUpdateInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: ZUuid.optional(),
  state: ZJsState,
});

export type TJsConfigUpdateInput = z.infer<typeof ZJsConfigUpdateInput>;

export const ZJsConfigInput = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  debug: z.boolean().optional(),
  errorHandler: z.function().args(z.any()).returns(z.void()).optional(),
  userId: ZUuid.optional(),
  attributes: ZPersonAttributes.optional(),
});

export type TJsConfigInput = z.infer<typeof ZJsConfigInput>;

export const ZJsPeopleUserIdInput = z.object({
  environmentId: z.string().cuid(),
  userId: z.string().min(1).max(255),
});

export type TJsPeopleUserIdInput = z.infer<typeof ZJsPeopleUserIdInput>;

export const ZJsPeopleAttributeInput = z.object({
  key: z.string(),
  value: z.string(),
});

export type TJsPeopleAttributeInput = z.infer<typeof ZJsPeopleAttributeInput>;

export const ZJsActionInput = z.object({
  environmentId: z.string().cuid(),
  userId: ZUuid.optional(),
  name: z.string(),
  properties: z.record(z.string()),
});

export type TJsActionInput = z.infer<typeof ZJsActionInput>;

export const ZJsSyncParams = z.object({
  environmentId: z.string().cuid(),
  apiHost: z.string(),
  userId: ZUuid.optional(),
});

export type TJsSyncParams = z.infer<typeof ZJsSyncParams>;

const ZJsSettingsWorkflow = ZWorkflow.pick({
  id: true,
  welcomeCard: true,
  questions: true,
  triggers: true,
  thankYouCard: true,
  autoClose: true,
  delay: true,
});

export const ZJsSettings = z.object({
  workflows: z.optional(z.array(ZJsSettingsWorkflow)),
  noCodeEvents: z.optional(z.array(z.any())), // You might want to further refine this.
  brandColor: z.optional(z.string()),
  typeflowaiSignature: z.optional(z.boolean()),
  placement: z.optional(
    z.union([
      z.literal("bottomLeft"),
      z.literal("bottomRight"),
      z.literal("topLeft"),
      z.literal("topRight"),
      z.literal("center"),
    ])
  ),
  clickOutsideClose: z.optional(z.boolean()),
  darkOverlay: z.optional(z.boolean()),
});

export type TSettings = z.infer<typeof ZJsSettings>;
