"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getActionCountInLast7Days,
  getActionCountInLast24Hours,
  getActionCountInLastHour,
} from "@typeflowai/lib/action/service";
import { canUserUpdateActionClass, verifyUserRoleAccess } from "@typeflowai/lib/actionClass/auth";
import { createActionClass, deleteActionClass, updateActionClass } from "@typeflowai/lib/actionClass/service";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflowsByActionClassId } from "@typeflowai/lib/workflow/service";
import { TActionClassInput } from "@typeflowai/types/actionClasses";
import { AuthorizationError } from "@typeflowai/types/errors";

export async function deleteActionClassAction(environmentId, actionClassId: string) {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasDeleteAccess } = await verifyUserRoleAccess(environmentId, session.user.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  await deleteActionClass(environmentId, actionClassId);
}

export async function updateActionClassAction(
  environmentId: string,
  actionClassId: string,
  updatedAction: Partial<TActionClassInput>
) {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateActionClass(environmentId, actionClassId, updatedAction);
}

export async function createActionClassAction(action: TActionClassInput) {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, action.environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createActionClass(action.environmentId, action);
}

export const getActionCountInLastHourAction = async (actionClassId: string, environmentId: string) => {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getActionCountInLastHour(actionClassId);
};

export const getActionCountInLast24HoursAction = async (actionClassId: string, environmentId: string) => {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getActionCountInLast24Hours(actionClassId);
};

export const getActionCountInLast7DaysAction = async (actionClassId: string, environmentId: string) => {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getActionCountInLast7Days(actionClassId);
};

export const GetActiveInactiveWorkflowsAction = async (
  actionClassId: string,
  environmentId: string
): Promise<{ activeWorkflows: string[]; inactiveWorkflows: string[] }> => {
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

  if (!session) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isAuthorized = await canUserUpdateActionClass(session.user.id, actionClassId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflows = await getWorkflowsByActionClassId(actionClassId);
  const response = {
    activeWorkflows: workflows.filter((s) => s.status === "inProgress").map((workflow) => workflow.name),
    inactiveWorkflows: workflows.filter((s) => s.status !== "inProgress").map((workflow) => workflow.name),
  };
  return response;
};
