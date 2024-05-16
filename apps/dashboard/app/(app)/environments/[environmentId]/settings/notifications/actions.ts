"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { updateUser } from "@typeflowai/lib/user/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TUserNotificationSettings } from "@typeflowai/types/user";

export async function updateNotificationSettingsAction(notificationSettings: TUserNotificationSettings) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new AuthorizationError("Not authenticated");
  }

  await updateUser(session.user.id, {
    notificationSettings,
  });
}
