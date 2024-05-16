"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import {
  createLanguage,
  deleteLanguage,
  getWorkflowsUsingGivenLanguage,
  updateLanguage,
} from "@typeflowai/lib/language/service";
import { canUserAccessProduct, verifyUserRoleAccess } from "@typeflowai/lib/product/auth";
import { getProduct } from "@typeflowai/lib/product/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TLanguageInput } from "@typeflowai/types/product";

export async function createLanguageAction(
  productId: string,
  environmentId: string,
  languageInput: TLanguageInput
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user?.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(product!.teamId, session.user?.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await createLanguage(productId, environmentId, languageInput);
}

export async function deleteLanguageAction(productId: string, environmentId: string, languageId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user?.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(product!.teamId, session.user?.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await deleteLanguage(environmentId, languageId);
}

export async function getWorkflowsUsingGivenLanguageAction(productId: string, languageId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user?.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getWorkflowsUsingGivenLanguage(languageId);
}

export async function updateLanguageAction(
  productId: string,
  environmentId: string,
  languageId: string,
  languageInput: TLanguageInput
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user?.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(product!.teamId, session.user?.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateLanguage(environmentId, languageId, languageInput);
}
