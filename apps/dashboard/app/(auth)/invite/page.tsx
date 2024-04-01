import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { sendInviteAcceptedEmail } from "@typeflowai/lib/emails/emails";
import { env } from "@typeflowai/lib/env.mjs";
import { deleteInvite, getInvite } from "@typeflowai/lib/invite/service";
import { verifyInviteToken } from "@typeflowai/lib/jwt";
import { createMembership } from "@typeflowai/lib/membership/service";
import { getUser } from "@typeflowai/lib/user/service";

import {
  ExpiredContent,
  NotLoggedInContent,
  RightAccountContent,
  UsedContent,
  WrongAccountContent,
} from "./components/InviteContentComponents";

function extractTokenFromMetadata(metadata) {
  const prefix = "map[token:";
  const suffix = "]";

  if (metadata.startsWith(prefix) && metadata.endsWith(suffix)) {
    return metadata.slice(prefix.length, metadata.length - suffix.length);
  }

  return null;
}

export default async function JoinTeam({ searchParams }) {
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

  const currentUser = session && session.user ? await getUser(session.user.id) : null;

  try {
    const inviteToken = extractTokenFromMetadata(searchParams.metadata);

    const { inviteId, email } = verifyInviteToken(inviteToken);

    const invite = await getInvite(inviteId);

    const isInviteExpired = new Date(invite.expiresAt) < new Date();

    if (!invite || isInviteExpired) {
      return <ExpiredContent />;
    } else if (invite.accepted) {
      return <UsedContent />;
    } else if (!currentUser) {
      const redirectUrl = env.NEXTAUTH_URL + "/invite?token=" + inviteToken;
      return <NotLoggedInContent email={email} token={inviteToken} redirectUrl={redirectUrl} />;
    } else if (currentUser?.email !== email) {
      return <WrongAccountContent />;
    } else {
      await createMembership(invite.teamId, currentUser.id, { accepted: true, role: invite.role });
      await deleteInvite(inviteId);

      sendInviteAcceptedEmail(invite.creator.name ?? "", currentUser?.name ?? "", invite.creator.email);

      return <RightAccountContent />;
    }
  } catch (e) {
    return <ExpiredContent />;
  }
}
