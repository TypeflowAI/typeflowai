import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@typeflowai/database";
// import { EMAIL_VERIFICATION_DISABLED, INVITE_DISABLED, SIGNUP_ENABLED } from "@typeflowai/lib/constants";
// import { sendInviteAcceptedEmail, sendVerificationEmail } from "@typeflowai/lib/emails/emails";
import { INVITE_DISABLED, SIGNUP_ENABLED } from "@typeflowai/lib/constants";
// import { sendInviteAcceptedEmail } from "@typeflowai/lib/emails/emails";
import { env } from "@typeflowai/lib/env.mjs";
import { deleteInvite } from "@typeflowai/lib/invite/service";
import { verifyInviteToken } from "@typeflowai/lib/jwt";
import { createMembership } from "@typeflowai/lib/membership/service";
import { createProduct } from "@typeflowai/lib/product/service";
import { createTeam, getTeam } from "@typeflowai/lib/team/service";
import { createUser } from "@typeflowai/lib/user/service";

export async function POST(request: Request) {
  let { inviteToken, password, ...user } = await request.json();
  if (inviteToken ? INVITE_DISABLED : !SIGNUP_ENABLED) {
    return NextResponse.json({ error: "Signup disabled" }, { status: 403 });
  }
  user = { ...user, ...{ email: user.email.toLowerCase() } };

  let inviteId;

  try {
    let invite;

    if (!password) {
      throw new Error("Password is required");
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { data: dataSupabase, error: signUpError } = await supabase.auth.signUp({
      email: user.email,
      password: password,
      options: {
        emailRedirectTo: `${process.env.WEBAPP_URL}/api/auth/callback`,
      },
    });

    if (signUpError) throw signUpError;

    // create the user
    if (dataSupabase.user) {
      user = await createUser(user, dataSupabase.user.id);
    }

    // User is invited to team
    if (inviteToken) {
      let inviteTokenData = await verifyInviteToken(inviteToken);
      inviteId = inviteTokenData?.inviteId;

      invite = await prisma.invite.findUnique({
        where: { id: inviteId },
        include: {
          creator: true,
        },
      });

      if (!invite) {
        return NextResponse.json({ error: "Invalid invite ID" }, { status: 400 });
      }

      // assign user to existing team
      await createMembership(invite.teamId, user.id, {
        accepted: true,
        role: invite.role,
      });
      //TODO: Fix This, remove or configure with Supabase
      // if (!EMAIL_VERIFICATION_DISABLED) {
      //   await sendVerificationEmail(user);
      // }

      //TODO: Reactivate once SMPT will be configured
      // await sendInviteAcceptedEmail(invite.creator.name, user.name, invite.creator.email);
      await deleteInvite(inviteId);

      return NextResponse.json(user);
    }

    // User signs up without invite
    // Default team assignment is enabled
    if (env.DEFAULT_TEAM_ID && env.DEFAULT_TEAM_ID.length > 0) {
      // check if team exists
      let team = await getTeam(env.DEFAULT_TEAM_ID);
      let isNewTeam = false;
      if (!team) {
        // create team with id from env
        team = await createTeam({ id: env.DEFAULT_TEAM_ID, name: user.name + "'s Team" });
        isNewTeam = true;
      }
      const role = isNewTeam ? "owner" : env.DEFAULT_TEAM_ROLE || "admin";
      await createMembership(team.id, user.id, { role, accepted: true });
    }
    // Without default team assignment
    else {
      const team = await createTeam({ name: user.name + "'s Team" });
      await createMembership(team.id, user.id, { role: "owner", accepted: true });
      await createProduct(team.id, { name: "My Product" });
    }
    //TODO: Fix This, remove or configure with Supabase
    // if (!EMAIL_VERIFICATION_DISABLED) {
    //   await sendVerificationEmail(user);
    // }
    return NextResponse.json(user);
  } catch (e) {
    if (e.code === "P2002") {
      return NextResponse.json(
        {
          error: "user with this email address already exists",
          errorCode: e.code,
        },
        { status: 409 }
      );
    } else {
      return NextResponse.json(
        {
          error: e.message,
          errorCode: e.code,
        },
        { status: 500 }
      );
    }
  }
}
