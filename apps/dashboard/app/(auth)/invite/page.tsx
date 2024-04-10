import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { sendInviteAcceptedEmail } from "@typeflowai/lib/emails/emails";
import { env } from "@typeflowai/lib/env.mjs";
import { deleteInvite, getInvite } from "@typeflowai/lib/invite/service";
import { verifyInviteToken } from "@typeflowai/lib/jwt";
import { createMembership } from "@typeflowai/lib/membership/service";

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
  const currentUser = await getServerSession(authOptions);

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
    } else if (currentUser?.user?.email !== email) {
      return <WrongAccountContent />;
    } else {
      await createMembership(invite.teamId, currentUser.user.id, { accepted: true, role: invite.role });
      await deleteInvite(inviteId);

      sendInviteAcceptedEmail(invite.creator.name ?? "", currentUser.user?.name ?? "", invite.creator.email);

      return <RightAccountContent />;
    }
  } catch (e) {
    return <ExpiredContent />;
  }
}
