"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import {
  cloneSegment,
  createSegment,
  deleteSegment,
  getSegment,
  resetSegmentInWorkflow,
  updateSegment,
} from "@typeflowai/lib/segment/service";
import { canUserAccessWorkflow } from "@typeflowai/lib/workflow/auth";
import { loadNewSegmentInWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { TSegmentCreateInput, TSegmentUpdateInput, ZSegmentFilters } from "@typeflowai/types/segment";

export const createSegmentAction = async ({
  description,
  environmentId,
  filters,
  isPrivate,
  workflowId,
  title,
}: TSegmentCreateInput) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await hasUserEnvironmentAccess(session.user.id, environmentId);
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
    description,
    isPrivate,
    filters,
  });

  return segment;
};

export const updateSegmentAction = async (
  environmentId: string,
  segmentId: string,
  data: TSegmentUpdateInput
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await hasUserEnvironmentAccess(session.user.id, environmentId);
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

export const loadNewSegmentAction = async (workflowId: string, segmentId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  return await loadNewSegmentInWorkflow(workflowId, segmentId);
};

export const cloneSegmentAction = async (segmentId: string, workflowId: string) => {
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

export const deleteSegmentAction = async (environmentId: string, segmentId: string) => {
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

export const resetSegmentFiltersAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const environmentAccess = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!environmentAccess) throw new AuthorizationError("Not authorized");

  return await resetSegmentInWorkflow(workflowId);
};
