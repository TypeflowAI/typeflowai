import { z } from "zod";

import { ZColor, ZPlacement } from "./common";
import { ZEnvironment } from "./environment";
import { ZBaseStyling } from "./styling";

export const ZProductStyling = ZBaseStyling.extend({
  allowStyleOverwrite: z.boolean(),
});

export type TProductStyling = z.infer<typeof ZProductStyling>;

export const ZLanguage = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  code: z.string(),
  alias: z.string().nullable(),
});
export type TLanguage = z.infer<typeof ZLanguage>;

export const ZLanguageInput = z.object({
  code: z.string(),
  alias: z.string().nullable(),
});
export type TLanguageInput = z.infer<typeof ZLanguageInput>;

export const ZLanguageUpdate = z.object({
  alias: z.string().nullable(),
});
export type TLanguageUpdate = z.infer<typeof ZLanguageUpdate>;

export const ZLogo = z.object({
  url: z.string().optional(),
  bgColor: z.string().optional(),
});

export type TLogo = z.infer<typeof ZLogo>;

export const ZProduct = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().trim().min(1, { message: "Product name cannot be empty" }),
  teamId: z.string(),
  styling: ZProductStyling,
  recontactDays: z
    .number({ message: "Recontact days is required" })
    .int()
    .min(0, { message: "Must be a positive number" })
    .max(365, { message: "Must be less than 365" }),
  inAppWorkflowBranding: z.boolean(),
  linkWorkflowBranding: z.boolean(),
  placement: ZPlacement,
  clickOutsideClose: z.boolean(),
  darkOverlay: z.boolean(),
  environments: z.array(ZEnvironment),
  brandColor: ZColor.nullish(),
  highlightBorderColor: ZColor.nullish(),
  languages: z.array(ZLanguage),
  logo: ZLogo.nullish(),
});

export type TProduct = z.infer<typeof ZProduct>;

export const ZProductUpdateInput = z.object({
  name: z.string().optional(),
  teamId: z.string().optional(),
  brandColor: ZColor.optional(),
  highlightBorderColor: ZColor.nullish(),
  recontactDays: z.number().int().optional(),
  inAppWorkflowBranding: z.boolean().optional(),
  linkWorkflowBranding: z.boolean().optional(),
  placement: ZPlacement.optional(),
  clickOutsideClose: z.boolean().optional(),
  darkOverlay: z.boolean().optional(),
  environments: z.array(ZEnvironment).optional(),
  styling: ZProductStyling.optional(),
  logo: ZLogo.optional(),
});

export type TProductUpdateInput = z.infer<typeof ZProductUpdateInput>;
