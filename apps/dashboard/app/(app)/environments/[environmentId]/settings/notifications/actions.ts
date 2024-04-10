"use server";

import { getServerSession } from "next-auth";

import { prisma } from "@typeflowai/database";
import { authOptions } from "@typeflowai/lib/authOptions";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TUserNotificationSettings } from "@typeflowai/types/user";

export async function updateNotificationSettingsAction(notificationSettings: TUserNotificationSettings) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthorizationError("Not authenticated");
  }

  // update user with notification settings
  await prisma.user.update({
    where: { id: session.user.id },
    data: { notificationSettings },
  });
}
