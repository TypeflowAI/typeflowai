"use server";

import { getServerSession } from "next-auth";

import { createActionClass } from "@typeflowai/lib/actionClass/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { UNSPLASH_ACCESS_KEY } from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { canUserAccessProduct } from "@typeflowai/lib/product/auth";
import { getProduct } from "@typeflowai/lib/product/service";
import {
  cloneSegment,
  createSegment,
  deleteSegment,
  getSegment,
  resetSegmentInWorkflow,
  updateSegment,
} from "@typeflowai/lib/segment/service";
import { canUserAccessWorkflow, verifyUserRoleAccess } from "@typeflowai/lib/workflow/auth";
import { workflowCache } from "@typeflowai/lib/workflow/cache";
import {
  deleteWorkflow,
  getWorkflow,
  loadNewSegmentInWorkflow,
  updateWorkflow,
} from "@typeflowai/lib/workflow/service";
import { TActionClassInput } from "@typeflowai/types/actionClasses";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TProduct } from "@typeflowai/types/product";
import { TBaseFilters, TSegmentUpdateInput, ZSegmentFilters } from "@typeflowai/types/segment";
import { TWorkflow } from "@typeflowai/types/workflows";

export async function workflowMutateAction(workflow: TWorkflow): Promise<TWorkflow> {
  return await updateWorkflow(workflow);
}

export async function updateWorkflowAction(workflow: TWorkflow): Promise<TWorkflow> {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflow.id);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const { hasCreateOrUpdateAccess } = await verifyUserRoleAccess(workflow.environmentId, session.user.id);
  if (!hasCreateOrUpdateAccess) throw new AuthorizationError("Not authorized");

  return await updateWorkflow(workflow);
}

export const deleteWorkflowAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);
  const { hasDeleteAccess } = await verifyUserRoleAccess(workflow!.environmentId, session.user.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  await deleteWorkflow(workflowId);
};

export const refetchProductAction = async (productId: string): Promise<TProduct | null> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessProduct(session.user.id, productId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const product = await getProduct(productId);
  return product;
};

export const createBasicSegmentAction = async ({
  description,
  environmentId,
  filters,
  isPrivate,
  workflowId,
  title,
}: {
  environmentId: string;
  workflowId: string;
  title: string;
  description?: string;
  isPrivate: boolean;
  filters: TBaseFilters;
}) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  const parsedFilters = ZSegmentFilters.safeParse(filters);

  if (!parsedFilters.success) {
    const errMsg =
      parsedFilters.error.issues.find((issue) => issue.code === "custom")?.message || "Invalid filters";
    throw new Error(errMsg);
  }

  const segment = await createSegment({
    environmentId,
    workflowId,
    title,
    description: description || "",
    isPrivate,
    filters,
  });
  workflowCache.revalidate({ id: workflowId });

  return segment;
};

export const updateBasicSegmentAction = async (
  environmentId: string,
  segmentId: string,
  data: TSegmentUpdateInput
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  const { filters } = data;
  if (filters) {
    const parsedFilters = ZSegmentFilters.safeParse(filters);

    if (!parsedFilters.success) {
      const errMsg =
        parsedFilters.error.issues.find((issue) => issue.code === "custom")?.message || "Invalid filters";
      throw new Error(errMsg);
    }
  }

  return await updateSegment(segmentId, data);
};

export const loadNewBasicSegmentAction = async (workflowId: string, segmentId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  return await loadNewSegmentInWorkflow(workflowId, segmentId);
};

export const cloneBasicSegmentAction = async (segmentId: string, workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  try {
    const clonedSegment = await cloneSegment(segmentId, workflowId);
    return clonedSegment;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const deleteBasicSegmentAction = async (environmentId: string, segmentId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  const foundSegment = await getSegment(segmentId);

  if (!foundSegment) {
    throw new Error(`Segment with id ${segmentId} not found`);
  }

  return await deleteSegment(segmentId);
};

export const resetBasicSegmentFiltersAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  return await resetSegmentInWorkflow(workflowId);
};

export async function getImagesFromUnsplashAction(searchQuery: string, page: number = 1) {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("Unsplash access key is not set");
  }
  const baseUrl = "https://api.unsplash.com/search/photos";
  const params = new URLSearchParams({
    query: searchQuery,
    client_id: UNSPLASH_ACCESS_KEY,
    orientation: "landscape",
    per_page: "9",
    page: page.toString(),
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch images from Unsplash");
    }

    const { results } = await response.json();
    return results.map((result) => {
      const authorName = encodeURIComponent(result.user.first_name + " " + result.user.last_name);
      const authorLink = encodeURIComponent(result.user.links.html);

      return {
        id: result.id,
        alt_description: result.alt_description,
        urls: {
          regularWithAttribution: `${result.urls.regular}&dpr=2&authorLink=${authorLink}&authorName=${authorName}&utm_source=typeflowai&utm_medium=referral`,
          download: result.links.download_location,
        },
      };
    });
  } catch (error) {
    throw new Error("Error getting images from Unsplash");
  }
}

export async function triggerDownloadUnsplashImageAction(downloadUrl: string) {
  try {
    const response = await fetch(`${downloadUrl}/?client_id=${UNSPLASH_ACCESS_KEY}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to download image from Unsplash");
    }

    return;
  } catch (error) {
    throw new Error("Error downloading image from Unsplash");
  }
}

export async function createActionClassAction(action: TActionClassInput) {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, action.environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await createActionClass(action.environmentId, action);
}
