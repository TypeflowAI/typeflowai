"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { TUserNotificationSettings } from "@typeflowai/types/user";
import { Switch } from "@typeflowai/ui/Switch";

import { updateNotificationSettingsAction } from "../actions";

interface NotificationSwitchProps {
  workflowOrProductId: string;
  notificationSettings: TUserNotificationSettings;
  notificationType: "alert" | "weeklySummary";
}

export function NotificationSwitch({
  workflowOrProductId,
  notificationSettings,
  notificationType,
}: NotificationSwitchProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Switch
      id="notification-switch"
      aria-label="toggle notification settings"
      checked={notificationSettings[notificationType][workflowOrProductId]}
      disabled={isLoading}
      onCheckedChange={async () => {
        setIsLoading(true);
        // update notificiation settings
        const updatedNotificationSettings = { ...notificationSettings };
        updatedNotificationSettings[notificationType][workflowOrProductId] =
          !updatedNotificationSettings[notificationType][workflowOrProductId];
        await updateNotificationSettingsAction(notificationSettings);
        setIsLoading(false);
        toast.success(`Notification settings updated`, { id: "notification-switch" });
        router.refresh();
      }}
    />
  );
}
