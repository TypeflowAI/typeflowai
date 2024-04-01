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

export const ZUuid = z.string().refine(
  (val) => {
    // Regex para validar un UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(val);
  },
  {
    message: "Invalid UUID",
  }
);

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

export const ZUser = z.object({
  id: ZUuid,
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  imageUrl: z.string().url().nullable(),
  twoFactorEnabled: z.boolean(),
  identityProvider: z.enum(["email", "google", "github", "azuread"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  onboardingCompleted: z.boolean(),
  objective: ZUserObjective.nullable(),
});

export type TUser = z.infer<typeof ZUser>;

export const ZUserUpdateInput = z.object({
  name: z.string().nullish(),
  email: z.string().optional(),
  emailVerified: z.date().nullish(),
  onboardingCompleted: z.boolean().optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  imageUrl: z.string().url().nullish(),
});

export type TUserUpdateInput = z.infer<typeof ZUserUpdateInput>;

export const ZUserCreateInput = z.object({
  name: z.string().optional(),
  email: z.string(),
  emailVerified: z.date().optional(),
  onboardingCompleted: z.boolean().optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  identityProvider: z.enum(["email", "google", "github", "azuread"]).optional(),
  identityProviderAccountId: z.string().optional(),
});

export type TUserCreateInput = z.infer<typeof ZUserCreateInput>;

export const ZUserNotificationSettings = z.object({
  alert: z.record(z.boolean()),
  weeklySummary: z.record(z.boolean()),
});

export type TUserNotificationSettings = z.infer<typeof ZUserNotificationSettings>;
