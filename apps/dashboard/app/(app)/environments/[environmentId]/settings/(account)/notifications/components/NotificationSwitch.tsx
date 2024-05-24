"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TUserNotificationSettings } from "@typeflowai/types/user";
import { Switch } from "@typeflowai/ui/Switch";

import { updateNotificationSettingsAction } from "../actions";

interface NotificationSwitchProps {
  workflowOrProductOrTeamId: string;
  notificationSettings: TUserNotificationSettings;
  notificationType: "alert" | "weeklySummary" | "unsubscribedTeamIds";
  autoDisableNotificationType?: string;
  autoDisableNotificationElementId?: string;
}

export function NotificationSwitch({
  workflowOrProductOrTeamId,
  notificationSettings,
  notificationType,
  autoDisableNotificationType,
  autoDisableNotificationElementId,
}: NotificationSwitchProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isChecked =
    notificationType === "unsubscribedTeamIds"
      ? !notificationSettings.unsubscribedTeamIds?.includes(workflowOrProductOrTeamId)
      : notificationSettings[notificationType][workflowOrProductOrTeamId] === true;

  const handleSwitchChange = async () => {
    setIsLoading(true);

    let updatedNotificationSettings = { ...notificationSettings };
    if (notificationType === "unsubscribedTeamIds") {
      const unsubscribedTeamIds = updatedNotificationSettings.unsubscribedTeamIds ?? [];
      if (unsubscribedTeamIds.includes(workflowOrProductOrTeamId)) {
        updatedNotificationSettings.unsubscribedTeamIds = unsubscribedTeamIds.filter(
          (id) => id !== workflowOrProductOrTeamId
        );
      } else {
        updatedNotificationSettings.unsubscribedTeamIds = [...unsubscribedTeamIds, workflowOrProductOrTeamId];
      }
    } else {
      updatedNotificationSettings[notificationType][workflowOrProductOrTeamId] =
        !updatedNotificationSettings[notificationType][workflowOrProductOrTeamId];
    }

    await updateNotificationSettingsAction(updatedNotificationSettings);
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      autoDisableNotificationType &&
      autoDisableNotificationElementId === workflowOrProductOrTeamId &&
      isChecked
    ) {
      switch (notificationType) {
        case "alert":
          if (notificationSettings[notificationType][workflowOrProductOrTeamId] === true) {
            handleSwitchChange();
            toast.success("You will not receive any more emails for responses on this workflow!", {
              id: "notification-switch",
            });
          }
          break;

        case "unsubscribedTeamIds":
          if (!notificationSettings.unsubscribedTeamIds?.includes(workflowOrProductOrTeamId)) {
            handleSwitchChange();
            toast.success("You will not be auto-subscribed to this team's workflows anymore!", {
              id: "notification-switch",
            });
          }
          break;

        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch
      id="notification-switch"
      aria-label={`toggle notification settings for ${notificationType}`}
      checked={isChecked}
      disabled={isLoading}
      onCheckedChange={async () => {
        await handleSwitchChange();
        toast.success("Notification settings updated", { id: "notification-switch" });
      }}
    />
  );
}
