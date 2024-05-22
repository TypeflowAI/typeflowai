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
  updateWorkflow,
} from "@typeflowai/lib/workflow/service";
import { AuthorizationError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TWorkflow, TWorkflowFilterCriteria } from "@typeflowai/types/workflows";

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
        ...(trigger.actionClass.type === "code"
          ? { key: trigger.actionClass.key }
          : { name: trigger.actionClass.name }),
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
          ...(trigger.actionClass.type === "code"
            ? { key: trigger.actionClass.key }
            : {
                noCodeConfig: trigger.actionClass.noCodeConfig
                  ? structuredClone(trigger.actionClass.noCodeConfig)
                  : undefined,
              }),
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

export async function updateWorkflowAction(workflow: TWorkflow, iconUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authenticated");
  }

  const icon = iconUrl;

  return await updateWorkflow({ ...workflow, icon });
}

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

export const handleFileUpload = async (
  file: File,
  environmentId: string
): Promise<{
  error?: string;
  url: string;
}> => {
  if (!file) return { error: "No file provided", url: "" };

  if (!file.type.startsWith("image/")) {
    return { error: "Please upload an image file.", url: "" };
  }

  if (file.size > 10 * 1024 * 1024) {
    return {
      error: "File size must be less than 10 MB.",
      url: "",
    };
  }

  const payload = {
    fileName: file.name,
    fileType: file.type,
    environmentId,
  };

  const response = await fetch("/api/v1/management/storage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // throw new Error(`Upload failed with status: ${response.status}`);
    return {
      error: "Upload failed. Please try again.",
      url: "",
    };
  }

  const json = await response.json();

  const { data } = json;
  const { signedUrl, fileUrl, signingData, presignedFields } = data;

  let requestHeaders: Record<string, string> = {};

  if (signingData) {
    const { signature, timestamp, uuid } = signingData;

    requestHeaders = {
      "X-File-Type": file.type,
      "X-File-Name": encodeURIComponent(file.name),
      "X-Environment-ID": environmentId ?? "",
      "X-Signature": signature,
      "X-Timestamp": String(timestamp),
      "X-UUID": uuid,
    };
  }

  const formData = new FormData();

  if (presignedFields) {
    Object.keys(presignedFields).forEach((key) => {
      formData.append(key, presignedFields[key]);
    });
  }

  // Add the actual file to be uploaded
  formData.append("file", file);

  const uploadResponse = await fetch(signedUrl, {
    method: "POST",
    ...(signingData ? { headers: requestHeaders } : {}),
    body: formData,
  });

  if (!uploadResponse.ok) {
    return {
      error: "Upload failed. Please try again.",
      url: "",
    };
  }

  return {
    url: fileUrl,
  };
};
