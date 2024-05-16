"use server";

import { Prisma as prismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

import { prisma } from "@typeflowai/database";
import { authOptions } from "@typeflowai/lib/authOptions";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { generateWorkflowSingleUseId } from "@typeflowai/lib/utils/singleUseWorkflows";
import { canUserAccessWorkflow, verifyUserRoleAccess } from "@typeflowai/lib/workflow/auth";
import { workflowCache } from "@typeflowai/lib/workflow/cache";
import {
  deleteWorkflow,
  duplicateWorkflow,
  getWorkflow,
  getWorkflows,
} from "@typeflowai/lib/workflow/service";
import { AuthorizationError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TWorkflowFilterCriteria } from "@typeflowai/types/workflows";

export const getWorkflowAction = async (workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getWorkflow(workflowId);
};

export const duplicateWorkflowAction = async (environmentId: string, workflowId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const duplicatedWorkflow = await duplicateWorkflow(environmentId, workflowId, session.user.id);
  return duplicatedWorkflow;
};

export const copyToOtherEnvironmentAction = async (
  environmentId: string,
  workflowId: string,
  targetEnvironmentId: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorizedToAccessSourceEnvironment = await hasUserEnvironmentAccess(
    session.user.id,
    environmentId
  );
  if (!isAuthorizedToAccessSourceEnvironment) throw new AuthorizationError("Not authorized");

  const isAuthorizedToAccessTargetEnvironment = await hasUserEnvironmentAccess(
    session.user.id,
    targetEnvironmentId
  );
  if (!isAuthorizedToAccessTargetEnvironment) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const existingWorkflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      environmentId,
    },
    include: {
      triggers: {
        include: {
          actionClass: true,
        },
      },
      attributeFilters: {
        include: {
          attributeClass: true,
        },
      },
      segment: true,
    },
  });

  if (!existingWorkflow) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  let targetEnvironmentTriggers: string[] = [];
  // map the local triggers to the target environment
  for (const trigger of existingWorkflow.triggers) {
    const targetEnvironmentTrigger = await prisma.actionClass.findFirst({
      where: {
        name: trigger.actionClass.name,
        environment: {
          id: targetEnvironmentId,
        },
      },
    });
    if (!targetEnvironmentTrigger) {
      // if the trigger does not exist in the target environment, create it
      const newTrigger = await prisma.actionClass.create({
        data: {
          name: trigger.actionClass.name,
          environment: {
            connect: {
              id: targetEnvironmentId,
            },
          },
          description: trigger.actionClass.description,
          type: trigger.actionClass.type,
          noCodeConfig: trigger.actionClass.noCodeConfig
            ? structuredClone(trigger.actionClass.noCodeConfig)
            : undefined,
        },
      });
      targetEnvironmentTriggers.push(newTrigger.id);
    } else {
      targetEnvironmentTriggers.push(targetEnvironmentTrigger.id);
    }
  }

  let targetEnvironmentAttributeFilters: string[] = [];
  // map the local attributeFilters to the target env
  for (const attributeFilter of existingWorkflow.attributeFilters) {
    // check if attributeClass exists in target env.
    // if not, create it
    const targetEnvironmentAttributeClass = await prisma.attributeClass.findFirst({
      where: {
        name: attributeFilter.attributeClass.name,
        environment: {
          id: targetEnvironmentId,
        },
      },
    });
    if (!targetEnvironmentAttributeClass) {
      const newAttributeClass = await prisma.attributeClass.create({
        data: {
          name: attributeFilter.attributeClass.name,
          description: attributeFilter.attributeClass.description,
          type: attributeFilter.attributeClass.type,
          environment: {
            connect: {
              id: targetEnvironmentId,
            },
          },
        },
      });
      targetEnvironmentAttributeFilters.push(newAttributeClass.id);
    } else {
      targetEnvironmentAttributeFilters.push(targetEnvironmentAttributeClass.id);
    }
  }

  // create new workflow with the data of the existing workflow
  const newWorkflow = await prisma.workflow.create({
    data: {
      ...existingWorkflow,
      id: undefined, // id is auto-generated
      environmentId: undefined, // environmentId is set below
      createdBy: undefined,
      segmentId: undefined,
      name: `${existingWorkflow.name} (copy)`,
      status: "draft",
      questions: structuredClone(existingWorkflow.questions),
      thankYouCard: structuredClone(existingWorkflow.thankYouCard),
      inlineTriggers: JSON.parse(JSON.stringify(existingWorkflow.inlineTriggers)),
      triggers: {
        create: targetEnvironmentTriggers.map((actionClassId) => ({
          actionClassId: actionClassId,
        })),
      },
      attributeFilters: {
        create: existingWorkflow.attributeFilters.map((attributeFilter, idx) => ({
          attributeClassId: targetEnvironmentAttributeFilters[idx],
          condition: attributeFilter.condition,
          value: attributeFilter.value,
        })),
      },
      environment: {
        connect: {
          id: targetEnvironmentId,
        },
      },
      creator: {
        connect: {
          id: session.user.id,
        },
      },
      workflowClosedMessage: existingWorkflow.workflowClosedMessage ?? prismaClient.JsonNull,
      singleUse: existingWorkflow.singleUse ?? prismaClient.JsonNull,
      productOverwrites: existingWorkflow.productOverwrites ?? prismaClient.JsonNull,
      verifyEmail: existingWorkflow.verifyEmail ?? prismaClient.JsonNull,
      styling: existingWorkflow.styling ?? prismaClient.JsonNull,
      segment: existingWorkflow.segment ? { connect: { id: existingWorkflow.segment.id } } : undefined,
    },
  });

  workflowCache.revalidate({
    id: newWorkflow.id,
    environmentId: targetEnvironmentId,
  });
  return newWorkflow;
};

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

export const generateSingleUseIdAction = async (
  workflowId: string,
  isEncrypted: boolean
): Promise<string> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserWorkflowAccess = await canUserAccessWorkflow(session.user.id, workflowId);

  if (!hasUserWorkflowAccess) throw new AuthorizationError("Not authorized");

  return generateWorkflowSingleUseId(isEncrypted);
};

export const getWorkflowsAction = async (
  environmentId: string,
  limit?: number,
  offset?: number,
  filterCriteria?: TWorkflowFilterCriteria
) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  return await getWorkflows(environmentId, limit, offset, filterCriteria);
};
