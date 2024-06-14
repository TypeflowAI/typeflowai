import React from "react";
import type { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";
import { LiveWorkflowNotification } from "./live-workflow-notification";
import { NotificationFooter } from "./notification-footer";
import { NotificationHeader } from "./notification-header";
import { NotificationInsight } from "./notification-insight";

interface WeeklySummaryNotificationEmailProps {
  notificationData: TWeeklySummaryNotificationResponse;
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
}

export function WeeklySummaryNotificationEmail({
  notificationData,
  startDate,
  endDate,
  startYear,
  endYear,
}: WeeklySummaryNotificationEmailProps) {
  return (
    <div>
      <NotificationHeader
        endDate={endDate}
        endYear={endYear}
        productName={notificationData.productName}
        startDate={startDate}
        startYear={startYear}
      />
      <NotificationInsight insights={notificationData.insights} />
      <LiveWorkflowNotification
        environmentId={notificationData.environmentId}
        workflows={notificationData.workflows}
      />
      <NotificationFooter environmentId={notificationData.environmentId} />
    </div>
  );
}
