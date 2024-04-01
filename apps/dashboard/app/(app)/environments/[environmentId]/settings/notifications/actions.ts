"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { prisma } from "@typeflowai/database";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TUserNotificationSettings } from "@typeflowai/types/user";

export async function updateNotificationSettingsAction(notificationSettings: TUserNotificationSettings) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) {
    throw new AuthorizationError("Not authenticated");
  }

  // update user with notification settings
  await prisma.user.update({
    where: { id: session.user.id },
    data: { notificationSettings },
  });
}
