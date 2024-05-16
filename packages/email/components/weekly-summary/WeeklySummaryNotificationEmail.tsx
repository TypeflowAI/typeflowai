import React from "react";

import { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";

import { LiveWorkflowNotification } from "./LiveWorkflowNotification";
import { NotificationFooter } from "./NotificationFooter";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationInsight } from "./NotificationInsight";

interface WeeklySummaryNotificationEmailProps {
  notificationData: TWeeklySummaryNotificationResponse;
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
}

export const WeeklySummaryNotificationEmail = ({
  notificationData,
  startDate,
  endDate,
  startYear,
  endYear,
}: WeeklySummaryNotificationEmailProps) => {
  return (
    <div>
      <NotificationHeader
        productName={notificationData.productName}
        startDate={startDate}
        endDate={endDate}
        startYear={startYear}
        endYear={endYear}
      />
      <NotificationInsight insights={notificationData.insights} />
      <LiveWorkflowNotification
        workflows={notificationData.workflows}
        environmentId={notificationData.environmentId}
      />
      <NotificationFooter environmentId={notificationData.environmentId} />
    </div>
  );
};
