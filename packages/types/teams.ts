import { z } from "zod";

export const ZAIFeature = z.object({
  status: z.enum(["active", "canceled", "inactive"]).default("inactive"),
  responses: z.number().default(0).nullable(),
  unlimited: z.boolean().default(false),
  openaiApiKey: z.string().nullable().optional(),
});

export type TAIFeature = z.infer<typeof ZAIFeature>;

export const ZTeamBilling = z.object({
  stripeCustomerId: z.string().nullable(),
  subscriptionType: z.enum(["free", "basic", "pro", "enterprise"]).nullable().default(null),
  subscriptionStatus: z.enum(["active", "canceled", "scheduled", "inactive"]).default("inactive"),
  nextRenewalDate: z.string().nullable(),
  features: z.object({
    ai: ZAIFeature,
  }),
});

export type TTeamBilling = z.infer<typeof ZTeamBilling>;

export const ZTeam = z.object({
  id: z.string().cuid2(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  billing: ZTeamBilling,
});

export const ZTeamCreateInput = z.object({
  id: z.string().cuid2().optional(),
  name: z.string(),
  billing: ZTeamBilling.optional(),
});

export type TTeamCreateInput = z.infer<typeof ZTeamCreateInput>;

export const ZTeamUpdateInput = z.object({
  name: z.string(),
  billing: ZTeamBilling.optional(),
});

export type TTeamUpdateInput = z.infer<typeof ZTeamUpdateInput>;

export type TTeam = z.infer<typeof ZTeam>;
