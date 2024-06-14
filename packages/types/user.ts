import z from "zod";

const ZRole = z.enum([
  "marketing_specialist",
  "sales_manager",
  "startup_founder",
  "customer_support_specialist",
  "virtual_assistant",
  "agency_coordinator",
  "human_resources_manager",
  "other",
]);

export const ZUserObjective = z.enum([
  "enhance_online_presence",
  "boost_engagement_and_conversion",
  "optimize_content_and_seo_strategy",
  "improve_business_strategy",
  "innovate_and_develop",
  "improve_customer_and_employee_experience",
  "streamline_operations_and_sales",
  "other",
]);

export type TUserObjective = z.infer<typeof ZUserObjective>;

export const ZUserNotificationSettings = z.object({
  alert: z.record(z.boolean()),
  weeklySummary: z.record(z.boolean()),
  unsubscribedTeamIds: z.array(z.string()).optional(),
});

export type TUserNotificationSettings = z.infer<typeof ZUserNotificationSettings>;

export const ZUser = z.object({
  id: z.string(),
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, { message: "Name should be at least 1 character long" }),
  email: z.string().email(),
  emailVerified: z.date().nullable(),
  imageUrl: z.string().url().nullable(),
  twoFactorEnabled: z.boolean(),
  identityProvider: z.enum(["email", "google", "github", "azuread", "openid"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  onboardingCompleted: z.boolean(),
  role: ZRole.nullable(),
  objective: ZUserObjective.nullable(),
  notificationSettings: ZUserNotificationSettings,
});

export type TUser = z.infer<typeof ZUser>;

export const ZUserUpdateInput = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  emailVerified: z.date().nullish(),
  onboardingCompleted: z.boolean().optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  imageUrl: z.string().nullish(),
  notificationSettings: ZUserNotificationSettings.optional(),
});

export type TUserUpdateInput = z.infer<typeof ZUserUpdateInput>;

export const ZUserCreateInput = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, { message: "Name should be at least 1 character long" }),
  email: z.string().email(),
  emailVerified: z.date().optional(),
  onboardingCompleted: z.boolean().optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  identityProvider: z.enum(["email", "google", "github", "azuread", "openid"]).optional(),
  identityProviderAccountId: z.string().optional(),
});

export type TUserCreateInput = z.infer<typeof ZUserCreateInput>;
