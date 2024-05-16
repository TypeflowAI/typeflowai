"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessProduct, verifyUserRoleAccess } from "@typeflowai/lib/product/auth";
import { getProduct, updateProduct } from "@typeflowai/lib/product/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TProductUpdateInput } from "@typeflowai/types/product";

export async function updateProductAction(productId: string, inputProduct: TProductUpdateInput) {
  const session = await getServerSession(authOptions);

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(product!.teamId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateProduct(productId, inputProduct);
}
