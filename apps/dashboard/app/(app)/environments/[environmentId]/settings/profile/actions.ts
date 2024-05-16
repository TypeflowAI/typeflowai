"use server";

import { getServerSession } from "next-auth";

import { disableTwoFactorAuth, enableTwoFactorAuth, setupTwoFactorAuth } from "@typeflowai/lib/auth/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { deleteFile } from "@typeflowai/lib/storage/service";
import { getFileNameWithIdFromUrl } from "@typeflowai/lib/storage/utils";
import { deleteUser, updateUser } from "@typeflowai/lib/user/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TUserUpdateInput } from "@typeflowai/types/user";

export async function updateUserAction(data: Partial<TUserUpdateInput>) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  return await updateUser(session.user.id, data);
}

export async function deleteUserAction() {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  return await deleteUser(session.user.id);
}

export async function setupTwoFactorAuthAction(password: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.id) {
    throw new Error("User not found");
  }

  return await setupTwoFactorAuth(session.user.id, password);
}

export async function enableTwoFactorAuthAction(code: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.id) {
    throw new Error("User not found");
  }

  return await enableTwoFactorAuth(session.user.id, code);
}

type TDisableTwoFactorAuthParams = {
  code: string;
  password: string;
  backupCode?: string;
};
export async function disableTwoFactorAuthAction(params: TDisableTwoFactorAuthParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.id) {
    throw new Error("User not found");
  }

  return await disableTwoFactorAuth(session.user.id, params);
}

export async function updateAvatarAction(avatarUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.id) {
    throw new Error("User not found");
  }

  return await updateUser(session.user.id, { imageUrl: avatarUrl });
}

export async function removeAvatarAction(environmentId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  if (!session.user.id) {
    throw new Error("User not found");
  }

  const isUserAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isUserAuthorized) {
    throw new Error("Not Authorized");
  }

  try {
    const imageUrl = session.user.imageUrl;
    if (!imageUrl) {
      throw new Error("Image not found");
    }

    const fileName = getFileNameWithIdFromUrl(imageUrl);
    if (!fileName) {
      throw new Error("Invalid filename");
    }

    const deletionResult = await deleteFile(environmentId, "public", fileName);
    if (!deletionResult.success) {
      throw new Error("Deletion failed");
    }
    return await updateUser(session.user.id, { imageUrl: null });
  } catch (error) {
    throw new Error(`${"Deletion failed"}: ${error.message}`);
  }
}
