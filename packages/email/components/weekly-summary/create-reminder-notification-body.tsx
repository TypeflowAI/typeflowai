import { Container, Text } from "@react-email/components";
import React from "react";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import type { TWeeklySummaryNotificationResponse } from "@typeflowai/types/weeklySummary";
import { EmailButton } from "../general/email-button";
import { NotificationFooter } from "./notification-footer";

interface CreateReminderNotificationBodyProps {
  notificationData: TWeeklySummaryNotificationResponse;
}

export function CreateReminderNotificationBody({ notificationData }: CreateReminderNotificationBodyProps) {
  return (
    <Container>
      <Text>
        We’d love to send you a Weekly Summary, but currently there are no workflows running for
        {notificationData.productName}.
      </Text>
      <Text className="pt-4 font-bold">Don’t let a week pass without learning about your users:</Text>
      <EmailButton
        href={`${WEBAPP_URL}/environments/${notificationData.environmentId}/workflows?utm_source=weekly&utm_medium=email&utm_content=SetupANewWorkflowCTA`}
        label="Setup a new workflow"
      />
      <NotificationFooter environmentId={notificationData.environmentId} />
    </Container>
  );
}
