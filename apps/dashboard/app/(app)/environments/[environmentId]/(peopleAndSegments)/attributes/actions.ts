"use server";

import { getServerSession } from "next-auth";

import { canUserAccessAttributeClass } from "@typeflowai/lib/attributeClass/auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getSegmentsByAttributeClassName } from "@typeflowai/lib/segment/service";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { AuthorizationError } from "@typeflowai/types/errors";

export const getSegmentsByAttributeClassAction = async (
  environmentId: string,
  attributeClass: TAttributeClass
): Promise<{ activeWorkflows: string[]; inactiveWorkflows: string[] }> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new AuthorizationError("Not authorized");

    const isAuthorized = await canUserAccessAttributeClass(session.user.id, attributeClass.id);
    if (!isAuthorized) throw new AuthorizationError("Not authorized");
    const segments = await getSegmentsByAttributeClassName(environmentId, attributeClass.name);

    // segments is an array of segments, each segment has a workflow array with objects with properties: id, name and status.
    // We need the name of the workflows only and we need to filter out the workflows that are both in progress and not in progress.

    const activeWorkflows = segments
      .map((segment) =>
        segment.workflows
          .filter((workflow) => workflow.status === "inProgress")
          .map((workflow) => workflow.name)
      )
      .flat();
    const inactiveWorkflows = segments
      .map((segment) =>
        segment.workflows
          .filter((workflow) => workflow.status !== "inProgress")
          .map((workflow) => workflow.name)
      )
      .flat();

    return { activeWorkflows, inactiveWorkflows };
  } catch (err) {
    console.error(`Error getting segments by attribute class: ${err}`);
    throw err;
  }
};
