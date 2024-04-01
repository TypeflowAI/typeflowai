"use server";

import { Team } from "@prisma/client";
import { Prisma as prismaClient } from "@prisma/client/";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { prisma } from "@typeflowai/database";
import { SHORT_URL_BASE, WEBAPP_URL } from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { createMembership } from "@typeflowai/lib/membership/service";
import { createProduct } from "@typeflowai/lib/product/service";
import { createShortUrl } from "@typeflowai/lib/shortUrl/service";
import { createTeam, getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { canUserAccessWorkflow, verifyUserRoleAccess } from "@typeflowai/lib/workflow/auth";
import { workflowCache } from "@typeflowai/lib/workflow/cache";
import { deleteWorkflow, duplicateWorkflow, getWorkflow } from "@typeflowai/lib/workflow/service";
import { AuthenticationError, AuthorizationError, ResourceNotFoundError } from "@typeflowai/types/errors";

export const createShortUrlAction = async (url: string) => {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthenticationError("Not authenticated");

  const regexPattern = new RegExp("^" + WEBAPP_URL);
  const isValidUrl = regexPattern.test(url);

  if (!isValidUrl) throw new Error("Only TypeflowAI workflow URLs are allowed");

  const shortUrl = await createShortUrl(url);
  const fullShortUrl = SHORT_URL_BASE + "/" + shortUrl.id;
  return fullShortUrl;
};

export async function createTeamAction(teamName: string): Promise<Team> {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const newTeam = await createTeam({
    name: teamName,
  });

  await createMembership(newTeam.id, session.user.id, {
    role: "owner",
    accepted: true,
  });

  await createProduct(newTeam.id, {
    name: "My Product",
  });

  return newTeam;
}

export async function duplicateWorkflowAction(environmentId: string, workflowId: string) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const duplicatedWorkflow = await duplicateWorkflow(environmentId, workflowId);
  return duplicatedWorkflow;
}

export async function copyToOtherEnvironmentAction(
  environmentId: string,
  workflowId: string,
  targetEnvironmentId: string
) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

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
            ? JSON.parse(JSON.stringify(trigger.actionClass.noCodeConfig))
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
      name: `${existingWorkflow.name} (copy)`,
      status: "draft",
      questions: JSON.parse(JSON.stringify(existingWorkflow.questions)),
      thankYouCard: JSON.parse(JSON.stringify(existingWorkflow.thankYouCard)),
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
      workflowClosedMessage: existingWorkflow.workflowClosedMessage ?? prismaClient.JsonNull,
      singleUse: existingWorkflow.singleUse ?? prismaClient.JsonNull,
      productOverwrites: existingWorkflow.productOverwrites ?? prismaClient.JsonNull,
      verifyEmail: existingWorkflow.verifyEmail ?? prismaClient.JsonNull,
      styling: existingWorkflow.styling ?? prismaClient.JsonNull,
    },
  });

  workflowCache.revalidate({
    id: newWorkflow.id,
    environmentId: targetEnvironmentId,
  });
  return newWorkflow;
}

export const deleteWorkflowAction = async (workflowId: string) => {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessWorkflow(session.user.id, workflowId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const workflow = await getWorkflow(workflowId);

  const { hasDeleteAccess } = await verifyUserRoleAccess(workflow!.environmentId, session.user.id);
  if (!hasDeleteAccess) throw new AuthorizationError("Not authorized");

  await deleteWorkflow(workflowId);
};

export const createProductAction = async (environmentId: string, productName: string) => {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await hasUserEnvironmentAccess(session.user.id, environmentId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  const team = await getTeamByEnvironmentId(environmentId);
  if (!team) throw new ResourceNotFoundError("Team from environment", environmentId);

  const product = await createProduct(team.id, {
    name: productName,
  });

  // get production environment
  const productionEnvironment = product.environments.find((environment) => environment.type === "production");
  if (!productionEnvironment) throw new ResourceNotFoundError("Production environment", environmentId);

  return productionEnvironment;
};
