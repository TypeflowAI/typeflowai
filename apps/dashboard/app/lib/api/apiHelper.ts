import { createServerClient } from "@supabase/ssr";
import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

import { prisma } from "@typeflowai/database";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";

export const hashApiKey = (key: string): string => createHash("sha256").update(key).digest("hex");

export const hasEnvironmentAccess = async (
  req: NextApiRequest,
  res: NextApiResponse,
  environmentId: string
) => {
  if (req.headers["x-api-key"]) {
    const ownership = await hasApiEnvironmentAccess(req.headers["x-api-key"].toString(), environmentId);
    if (!ownership) {
      return false;
    }
  } else {
    const user = await getSessionUser(req, res);
    if (!user) {
      return false;
    }
    const ownership = await hasUserEnvironmentAccess(user.id, environmentId);
    if (!ownership) {
      return false;
    }
  }
  return true;
};

export const hasApiEnvironmentAccess = async (apiKey, environmentId) => {
  // write function to check if the API Key has access to the environment
  const apiKeyData = await prisma.apiKey.findUnique({
    where: {
      hashedKey: hashApiKey(apiKey),
    },
    select: {
      environmentId: true,
    },
  });

  if (apiKeyData?.environmentId === environmentId) {
    return true;
  }
  return false;
};

export const hasTeamAccess = async (user, teamId) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: teamId,
      },
    },
  });
  if (membership) {
    return true;
  }
  return false;
};

export const getSessionUser = async (req?: NextApiRequest, res?: NextApiResponse) => {
  // check for session (browser usage)
  // let session: Session | null;
  // if (req && res) {
  //   session = await getServerSession(req, res, authOptions);
  // } else {
  //   session = await getServerSession(authOptions);
  // }
  if (req && res) {
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
    if (session && "user" in session) return session.user;
  }
};

export const isOwner = async (user, teamId) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: teamId,
      },
    },
  });
  if (membership && membership.role === "owner") {
    return true;
  }
  return false;
};

export const isAdminOrOwner = async (user, teamId) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: teamId,
      },
    },
  });
  if (membership && (membership.role === "admin" || membership.role === "owner")) {
    return true;
  }
  return false;
};
