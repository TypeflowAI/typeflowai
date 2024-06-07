"use server";

import { Team } from "@prisma/client";
import { getServerSession } from "next-auth";

import { sendInviteMemberEmail } from "@typeflowai/email";
import { hasTeamAuthority } from "@typeflowai/lib/auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { INVITE_DISABLED } from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { inviteUser } from "@typeflowai/lib/invite/service";
import { canUserAccessProduct } from "@typeflowai/lib/product/auth";
import { getProduct, updateProduct } from "@typeflowai/lib/product/service";
import { verifyUserRoleAccess } from "@typeflowai/lib/team/auth";
import { updateTeam } from "@typeflowai/lib/team/service";
import { updateUser } from "@typeflowai/lib/user/service";
import { createWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthenticationError, AuthorizationError } from "@typeflowai/types/errors";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProductUpdateInput } from "@typeflowai/types/product";
import { TTemplate } from "@typeflowai/types/templates";
import { TUserUpdateInput } from "@typeflowai/types/user";
import { TWorkflowInput, TWorkflowType } from "@typeflowai/types/workflows";

export const inviteTeamMateAction = async (
  teamId: string,
  email: string,
  role: TMembershipRole,
  inviteMessage: string
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }

  const isUserAuthorized = await hasTeamAuthority(session.user.id, teamId);

  if (INVITE_DISABLED) {
    throw new AuthenticationError("Invite disabled");
  }

  if (!isUserAuthorized) {
    throw new AuthenticationError("Not authorized");
  }

  const { hasCreateOrUpdateMembersAccess } = await verifyUserRoleAccess(teamId, session.user.id);
  if (!hasCreateOrUpdateMembersAccess) {
    throw new AuthenticationError("Not authorized");
  }

  const invite = await inviteUser({
    teamId,
    currentUser: { id: session.user.id, name: session.user.name },
    invitee: {
      email,
      name: "",
      role,
    },
  });

  if (invite) {
    await sendInviteMemberEmail(
      invite.id,
      email,
      session.user.name ?? "",
      "",
      true, // is onboarding invite
      inviteMessage
    );
  }

  return invite;
};

export const finishOnboardingAction = async (team: Team) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  await updateTeam(team.id, {
    billing: {
      ...team.billing,
      subscriptionType: "free",
      features: {
        ...team.billing.features,
        ai: {
          ...team.billing.features.ai,
          responses: 10,
        },
      },
    },
  });

  const updatedProfile = { onboardingCompleted: true };
  return await updateUser(session.user.id, updatedProfile);
};

export async function createWorkflowAction(environmentId: string, workflowBody: TWorkflowInput) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createWorkflow(environmentId, workflowBody);
}

export async function fetchEnvironment(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  return await getEnvironment(id);
}

export const createWorkflowFromTemplate = async (template: TTemplate, environmentId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const userHasAccess = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!userHasAccess) throw new AuthorizationError("Not authorized");

  // Set common workflow properties
  const userId = session.user.id;
  // Construct workflow input based on the pathway
  const workflowInput = {
    ...template.preset,
    type: "link" as TWorkflowType,
    autoComplete: undefined,
    createdBy: userId,
  };
  // Create and return the new workflow
  return await createWorkflow(environmentId, workflowInput);
};

export async function updateUserAction(updatedUser: TUserUpdateInput) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  return await updateUser(session.user.id, updatedUser);
}

export async function updateProductAction(productId: string, updatedProduct: Partial<TProductUpdateInput>) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(product!.teamId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateProduct(productId, updatedProduct);
}
