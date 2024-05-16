import React from "react";

import { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";

import { CreateReminderNotificationBody } from "./CreateReminderNotificationBody";
import { NotificationHeader } from "./NotificationHeader";

interface NoLiveWorkflowNotificationEmailProps {
  notificationData: TWeeklySummaryNotificationResponse;
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
}

export const NoLiveWorkflowNotificationEmail = ({
  notificationData,
  startDate,
  endDate,
  startYear,
  endYear,
}: NoLiveWorkflowNotificationEmailProps) => {
  return (
    <div>
      <NotificationHeader
        productName={notificationData.productName}
        startDate={startDate}
        endDate={endDate}
        startYear={startYear}
        endYear={endYear}
      />
      <CreateReminderNotificationBody notificationData={notificationData} />
    </div>
  );
};
