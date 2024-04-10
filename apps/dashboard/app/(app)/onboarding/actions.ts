"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessProduct, verifyUserRoleAccess } from "@typeflowai/lib/product/auth";
import { getProduct, updateProduct } from "@typeflowai/lib/product/service";
import { updateUser } from "@typeflowai/lib/user/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TProductUpdateInput } from "@typeflowai/types/product";
import { TUserUpdateInput } from "@typeflowai/types/user";

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
