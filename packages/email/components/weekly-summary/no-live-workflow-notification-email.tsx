import React from "react";
import type { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";
import { CreateReminderNotificationBody } from "./create-reminder-notification-body";
import { NotificationHeader } from "./notification-header";

interface NoLiveWorkflowNotificationEmailProps {
  notificationData: TWeeklySummaryNotificationResponse;
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
}

export function NoLiveWorkflowNotificationEmail({
  notificationData,
  startDate,
  endDate,
  startYear,
  endYear,
}: NoLiveWorkflowNotificationEmailProps) {
  return (
    <div>
      <NotificationHeader
        endDate={endDate}
        endYear={endYear}
        productName={notificationData.productName}
        startDate={startDate}
        startYear={startYear}
      />
      <CreateReminderNotificationBody notificationData={notificationData} />
    </div>
  );
}
