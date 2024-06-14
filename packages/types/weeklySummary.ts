import { z } from "zod";

import { ZAttributeClass } from "./attributeClasses";
import { ZResponseData } from "./responses";
import { ZUserNotificationSettings } from "./user";
import { ZWorkflowHiddenFields, ZWorkflowQuestion, ZWorkflowStatus } from "./workflows";

const ZWeeklySummaryInsights = z.object({
  totalCompletedResponses: z.number(),
  totalDisplays: z.number(),
  totalResponses: z.number(),
  completionRate: z.number(),
  numLiveWorkflow: z.number(),
});

export type TWeeklySummaryInsights = z.infer<typeof ZWeeklySummaryInsights>;

export const ZWeeklySummaryWorkflowResponseData = z.object({
  headline: z.string(),
  responseValue: z.union([z.string(), z.array(z.string())]),
  questionType: z.string(),
});

export type TWeeklySummaryWorkflowResponseData = z.infer<typeof ZWeeklySummaryWorkflowResponseData>;

export const ZWeeklySummaryNotificationDataWorkflow = z.object({
  id: z.string(),
  name: z.string(),
  responses: z.array(ZWeeklySummaryWorkflowResponseData),
  responseCount: z.number(),
  status: z.string(),
});

export type TWeeklySummaryNotificationDataWorkflow = z.infer<typeof ZWeeklySummaryNotificationDataWorkflow>;

export const ZWeeklySummaryNotificationResponse = z.object({
  environmentId: z.string(),
  currentDate: z.date(),
  lastWeekDate: z.date(),
  productName: z.string(),
  workflows: z.array(ZWeeklySummaryNotificationDataWorkflow),
  insights: ZWeeklySummaryInsights,
});

export type TWeeklySummaryNotificationResponse = z.infer<typeof ZWeeklySummaryNotificationResponse>;

export const ZWeeklyEmailResponseData = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  finished: z.boolean(),
  data: ZResponseData,
});

export type TWeeklyEmailResponseData = z.infer<typeof ZWeeklyEmailResponseData>;

export const ZWeeklySummaryWorkflowData = z.object({
  id: z.string(),
  name: z.string(),
  questions: z.array(ZWorkflowQuestion),
  status: ZWorkflowStatus,
  responses: z.array(ZWeeklyEmailResponseData),
  displays: z.array(z.object({ id: z.string() })),
  hiddenFields: ZWorkflowHiddenFields,
});

export type TWeeklySummaryWorkflowData = z.infer<typeof ZWeeklySummaryWorkflowData>;

export const ZWeeklySummaryEnvironmentData = z.object({
  id: z.string(),
  workflows: z.array(ZWeeklySummaryWorkflowData),
  attributeClasses: z.array(ZAttributeClass),
});

export type TWeeklySummaryEnvironmentData = z.infer<typeof ZWeeklySummaryEnvironmentData>;

export const ZWeeklySummaryUserData = z.object({
  email: z.string(),
  notificationSettings: ZUserNotificationSettings,
});

export type TWeeklySummaryUserData = z.infer<typeof ZWeeklySummaryUserData>;

export const ZWeeklySummaryMembershipData = z.object({
  user: ZWeeklySummaryUserData,
});

export type TWeeklySummaryMembershipData = z.infer<typeof ZWeeklySummaryMembershipData>;

export const ZWeeklyEmailTeamData = z.object({
  memberships: z.array(ZWeeklySummaryMembershipData),
});

export type TWeeklyEmailTeamData = z.infer<typeof ZWeeklyEmailTeamData>;

export const ZWeeklySummaryProductData = z.object({
  id: z.string(),
  name: z.string(),
  environments: z.array(ZWeeklySummaryEnvironmentData),
  team: ZWeeklyEmailTeamData,
});

export type TWeeklySummaryProductData = z.infer<typeof ZWeeklySummaryProductData>;
