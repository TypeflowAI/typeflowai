import { TResponseData } from "@typeflowai/types/responses";
import { TUserNotificationSettings } from "@typeflowai/types/user";
import { TWorkflowQuestion, TWorkflowStatus } from "@typeflowai/types/workflows";

export interface Insights {
  totalCompletedResponses: number;
  totalDisplays: number;
  totalResponses: number;
  completionRate: number;
  numLiveWorkflow: number;
}

export interface WorkflowResponse {
  [headline: string]: string | number | boolean | Date | string[];
}

export interface Workflow {
  id: string;
  name: string;
  responses: WorkflowResponse[];
  responseCount: number;
  status: string;
}

export interface NotificationResponse {
  environmentId: string;
  currentDate: Date;
  lastWeekDate: Date;
  productName: string;
  workflows: Workflow[];
  insights: Insights;
}

// Prisma Types

type ResponseData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  finished: boolean;
  data: TResponseData;
};

type DisplayData = {
  id: string;
};

type WorkflowData = {
  id: string;
  name: string;
  questions: TWorkflowQuestion[];
  status: TWorkflowStatus;
  responses: ResponseData[];
  displays: DisplayData[];
};

export type EnvironmentData = {
  id: string;
  workflows: WorkflowData[];
};

type UserData = {
  email: string;
  notificationSettings: TUserNotificationSettings;
};

type MembershipData = {
  user: UserData;
};

type TeamData = {
  memberships: MembershipData[];
};

export type ProductData = {
  id: string;
  name: string;
  environments: EnvironmentData[];
  team: TeamData;
};
