import { z } from "zod";

import { ZPerson, ZPersonAttributes } from "./people";
import { ZTag } from "./tags";
import { ZWorkflow } from "./workflows";

export const ZResponseData = z.record(z.union([z.string(), z.number(), z.array(z.string())]));

export type TResponseData = z.infer<typeof ZResponseData>;

export const ZResponseTtc = z.record(z.number());

export type TResponseTtc = z.infer<typeof ZResponseTtc>;

export const ZResponsePersonAttributes = ZPersonAttributes.nullable();

export type TResponsePersonAttributes = z.infer<typeof ZResponsePersonAttributes>;

export const ZResponseNoteUser = z.object({
  id: z.string().cuid2(),
  name: z.string().nullable(),
});

export type TResponseNoteUser = z.infer<typeof ZResponseNoteUser>;

export const ZResponseNote = z.object({
  updatedAt: z.date(),
  createdAt: z.date(),
  id: z.string(),
  text: z.string(),
  user: ZResponseNoteUser,
  isResolved: z.boolean(),
  isEdited: z.boolean(),
});

export type TResponseNote = z.infer<typeof ZResponseNote>;

export const ZResponseMeta = z.object({
  source: z.string().optional(),
  url: z.string().optional(),
  userAgent: z
    .object({
      browser: z.string().optional(),
      os: z.string().optional(),
      device: z.string().optional(),
    })
    .optional(),
});

export type TResponseMeta = z.infer<typeof ZResponseMeta>;

export const ZResponse = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  workflowId: z.string().cuid2(),
  person: ZPerson.nullable(),
  personAttributes: ZResponsePersonAttributes,
  finished: z.boolean(),
  data: ZResponseData,
  ttc: ZResponseTtc.optional(),
  notes: z.array(ZResponseNote),
  tags: z.array(ZTag),
  meta: ZResponseMeta.nullable(),
  singleUseId: z.string().nullable(),
});

export type TResponse = z.infer<typeof ZResponse>;

export const ZResponseInput = z.object({
  environmentId: z.string().cuid2(),
  workflowId: z.string().cuid2(),
  userId: z.string().nullish(),
  singleUseId: z.string().nullable().optional(),
  finished: z.boolean(),
  data: ZResponseData,
  ttc: ZResponseTtc.optional(),
  meta: z
    .object({
      source: z.string().optional(),
      url: z.string().optional(),
      userAgent: z
        .object({
          browser: z.string().optional(),
          device: z.string().optional(),
          os: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type TResponseInput = z.infer<typeof ZResponseInput>;

export const ZResponseUpdateInput = z.object({
  finished: z.boolean(),
  data: ZResponseData,
  ttc: ZResponseTtc.optional(),
});

export type TResponseUpdateInput = z.infer<typeof ZResponseUpdateInput>;

export const ZResponseWithWorkflow = ZResponse.extend({
  workflow: ZWorkflow,
});

export type TResponseWithWorkflow = z.infer<typeof ZResponseWithWorkflow>;

export const ZResponseUpdate = z.object({
  finished: z.boolean(),
  data: ZResponseData,
  ttc: ZResponseTtc.optional(),
  meta: z
    .object({
      url: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
});

export type TResponseUpdate = z.infer<typeof ZResponseUpdate>;
