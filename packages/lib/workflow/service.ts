import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@typeflowai/database";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { ZOptionalNumber } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TPerson } from "@typeflowai/types/people";
import { TWorkflow, TWorkflowAttributeFilter, TWorkflowInput, ZWorkflow } from "@typeflowai/types/workflows";

import { getActionClasses } from "../actionClass/service";
import { getAttributeClasses } from "../attributeClass/service";
import { ITEMS_PER_PAGE, SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { displayCache } from "../display/cache";
import { getDisplaysByPersonId } from "../display/service";
import { personCache } from "../person/cache";
import { productCache } from "../product/cache";
import { getProductByEnvironmentId } from "../product/service";
import { responseCache } from "../response/cache";
import { diffInDays, formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { workflowCache } from "./cache";

export const selectWorkflow = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  type: true,
  environmentId: true,
  status: true,
  welcomeCard: true,
  questions: true,
  prompt: true,
  thankYouCard: true,
  hiddenFields: true,
  displayOption: true,
  recontactDays: true,
  autoClose: true,
  closeOnDate: true,
  delay: true,
  autoComplete: true,
  verifyEmail: true,
  icon: true,
  redirectUrl: true,
  productOverwrites: true,
  styling: true,
  workflowClosedMessage: true,
  singleUse: true,
  pin: true,
  resultShareKey: true,
  triggers: {
    select: {
      actionClass: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          environmentId: true,
          name: true,
          description: true,
          type: true,
          noCodeConfig: true,
        },
      },
    },
  },
  attributeFilters: {
    select: {
      id: true,
      attributeClassId: true,
      condition: true,
      value: true,
    },
  },
};

const getActionClassIdFromName = (actionClasses: TActionClass[], actionClassName: string): string => {
  return actionClasses.find((actionClass) => actionClass.name === actionClassName)!.id;
};

const revalidateWorkflowByActionClassId = (
  actionClasses: TActionClass[],
  actionClassNames: string[]
): void => {
  for (const actionClassName of actionClassNames) {
    const actionClassId: string = getActionClassIdFromName(actionClasses, actionClassName);
    workflowCache.revalidate({
      actionClassId,
    });
  }
};

const revalidateWorkflowByAttributeClassId = (attributeFilters: TWorkflowAttributeFilter[]): void => {
  for (const attributeFilter of attributeFilters) {
    workflowCache.revalidate({
      attributeClassId: attributeFilter.attributeClassId,
    });
  }
};

export const getWorkflow = async (workflowId: string): Promise<TWorkflow | null> => {
  const workflow = await unstable_cache(
    async () => {
      validateInputs([workflowId, ZId]);

      let workflowPrisma;
      try {
        workflowPrisma = await prisma.workflow.findUnique({
          where: {
            id: workflowId,
          },
          select: selectWorkflow,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }

      if (!workflowPrisma) {
        return null;
      }

      const transformedWorkflow = {
        ...workflowPrisma,
        triggers: workflowPrisma.triggers.map((trigger) => trigger.actionClass.name),
      };
      return transformedWorkflow;
    },
    [`getWorkflow-${workflowId}`],
    {
      tags: [workflowCache.tag.byId(workflowId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  // since the unstable_cache function does not support deserialization of dates, we need to manually deserialize them
  // https://github.com/vercel/next.js/issues/51613
  return workflow ? formatDateFields(workflow, ZWorkflow) : null;
};

export const getWorkflowsByAttributeClassId = async (
  attributeClassId: string,
  page?: number
): Promise<TWorkflow[]> => {
  const workflows = await unstable_cache(
    async () => {
      validateInputs([attributeClassId, ZId], [page, ZOptionalNumber]);

      const workflowsPrisma = await prisma.workflow.findMany({
        where: {
          attributeFilters: {
            some: {
              attributeClassId,
            },
          },
        },
        select: selectWorkflow,
        take: page ? ITEMS_PER_PAGE : undefined,
        skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
      });

      const workflows: TWorkflow[] = [];

      for (const workflowPrisma of workflowsPrisma) {
        const transformedWorkflow = {
          ...workflowPrisma,
          triggers: workflowPrisma.triggers.map((trigger) => trigger.actionClass.name),
        };
        workflows.push(transformedWorkflow);
      }

      return workflows;
    },
    [`getWorkflowsByAttributeClassId-${attributeClassId}-${page}`],
    {
      tags: [workflowCache.tag.byAttributeClassId(attributeClassId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return workflows.map((workflow) => formatDateFields(workflow, ZWorkflow));
};

export const getWorkflowsByActionClassId = async (
  actionClassId: string,
  page?: number
): Promise<TWorkflow[]> => {
  const workflows = await unstable_cache(
    async () => {
      validateInputs([actionClassId, ZId], [page, ZOptionalNumber]);

      const workflowsPrisma = await prisma.workflow.findMany({
        where: {
          triggers: {
            some: {
              actionClass: {
                id: actionClassId,
              },
            },
          },
        },
        select: selectWorkflow,
        take: page ? ITEMS_PER_PAGE : undefined,
        skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
      });

      const workflows: TWorkflow[] = [];

      for (const workflowPrisma of workflowsPrisma) {
        const transformedWorkflow = {
          ...workflowPrisma,
          triggers: workflowPrisma.triggers.map((trigger) => trigger.actionClass.name),
        };
        workflows.push(transformedWorkflow);
      }

      return workflows;
    },
    [`getWorkflowsByActionClassId-${actionClassId}-${page}`],
    {
      tags: [workflowCache.tag.byActionClassId(actionClassId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return workflows.map((workflow) => formatDateFields(workflow, ZWorkflow));
};

export const getWorkflows = async (environmentId: string, page?: number): Promise<TWorkflow[]> => {
  const workflows = await unstable_cache(
    async () => {
      validateInputs([environmentId, ZId], [page, ZOptionalNumber]);
      let workflowsPrisma;
      try {
        workflowsPrisma = await prisma.workflow.findMany({
          where: {
            environmentId,
          },
          select: selectWorkflow,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }

      const workflows: TWorkflow[] = [];

      for (const workflowPrisma of workflowsPrisma) {
        const transformedWorkflow = {
          ...workflowPrisma,
          triggers: workflowPrisma.triggers.map((trigger) => trigger.actionClass.name),
        };
        workflows.push(transformedWorkflow);
      }
      return workflows;
    },
    [`getWorkflows-${environmentId}-${page}`],
    {
      tags: [workflowCache.tag.byEnvironmentId(environmentId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  // since the unstable_cache function does not support deserialization of dates, we need to manually deserialize them
  // https://github.com/vercel/next.js/issues/51613
  return workflows.map((workflow) => formatDateFields(workflow, ZWorkflow));
};

export const updateWorkflow = async (updatedWorkflow: TWorkflow): Promise<TWorkflow> => {
  validateInputs([updatedWorkflow, ZWorkflow]);

  const workflowId = updatedWorkflow.id;
  let data: any = {};

  const actionClasses = await getActionClasses(updatedWorkflow.environmentId);
  const currentWorkflow = await getWorkflow(workflowId);

  if (!currentWorkflow) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  const { triggers, attributeFilters, environmentId, ...workflowData } = updatedWorkflow;

  if (triggers) {
    const newTriggers: string[] = [];
    const removedTriggers: string[] = [];

    // find added triggers
    for (const trigger of triggers) {
      if (!trigger) {
        continue;
      }
      if (currentWorkflow.triggers.find((t) => t === trigger)) {
        continue;
      } else {
        newTriggers.push(trigger);
      }
    }

    // find removed triggers
    for (const trigger of currentWorkflow.triggers) {
      if (triggers.find((t: any) => t === trigger)) {
        continue;
      } else {
        removedTriggers.push(trigger);
      }
    }
    // create new triggers
    if (newTriggers.length > 0) {
      data.triggers = {
        ...(data.triggers || []),
        create: newTriggers.map((trigger) => ({
          actionClassId: getActionClassIdFromName(actionClasses, trigger),
        })),
      };
    }
    // delete removed triggers
    if (removedTriggers.length > 0) {
      data.triggers = {
        ...(data.triggers || []),
        deleteMany: {
          actionClassId: {
            in: removedTriggers.map((trigger) => getActionClassIdFromName(actionClasses, trigger)),
          },
        },
      };
    }

    // Revalidation for newly added/removed actionClassId
    revalidateWorkflowByActionClassId(actionClasses, [...newTriggers, ...removedTriggers]);
  }

  if (attributeFilters) {
    const newFilters: TWorkflowAttributeFilter[] = [];
    const removedFilters: TWorkflowAttributeFilter[] = [];

    // find added attribute filters
    for (const attributeFilter of attributeFilters) {
      if (!attributeFilter.attributeClassId || !attributeFilter.condition || !attributeFilter.value) {
        continue;
      }

      if (
        currentWorkflow.attributeFilters.find(
          (f) =>
            f.attributeClassId === attributeFilter.attributeClassId &&
            f.condition === attributeFilter.condition &&
            f.value === attributeFilter.value
        )
      ) {
        continue;
      } else {
        newFilters.push({
          attributeClassId: attributeFilter.attributeClassId,
          condition: attributeFilter.condition,
          value: attributeFilter.value,
        });
      }
    }
    // find removed attribute filters
    for (const attributeFilter of currentWorkflow.attributeFilters) {
      if (
        attributeFilters.find(
          (f) =>
            f.attributeClassId === attributeFilter.attributeClassId &&
            f.condition === attributeFilter.condition &&
            f.value === attributeFilter.value
        )
      ) {
        continue;
      } else {
        removedFilters.push({
          attributeClassId: attributeFilter.attributeClassId,
          condition: attributeFilter.condition,
          value: attributeFilter.value,
        });
      }
    }

    // create new attribute filters
    if (newFilters.length > 0) {
      data.attributeFilters = {
        ...(data.attributeFilters || []),
        create: newFilters.map((attributeFilter) => ({
          attributeClassId: attributeFilter.attributeClassId,
          condition: attributeFilter.condition,
          value: attributeFilter.value,
        })),
      };
    }
    // delete removed attribute filter
    if (removedFilters.length > 0) {
      // delete all attribute filters that match the removed attribute classes
      await Promise.all(
        removedFilters.map(async (attributeFilter) => {
          await prisma.workflowAttributeFilter.deleteMany({
            where: {
              attributeClassId: attributeFilter.attributeClassId,
            },
          });
        })
      );
    }

    revalidateWorkflowByAttributeClassId([...newFilters, ...removedFilters]);
  }

  data = {
    ...workflowData,
    ...data,
  };

  try {
    const prismaWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data,
    });

    const modifiedWorkflow: TWorkflow = {
      ...prismaWorkflow, // Properties from prismaWorkflow
      triggers: updatedWorkflow.triggers ? updatedWorkflow.triggers : [], // Include triggers from updatedWorkflow
      attributeFilters: updatedWorkflow.attributeFilters ? updatedWorkflow.attributeFilters : [], // Include attributeFilters from updatedWorkflow
    };

    workflowCache.revalidate({
      id: modifiedWorkflow.id,
      environmentId: modifiedWorkflow.environmentId,
    });

    return modifiedWorkflow;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export async function deleteWorkflow(workflowId: string) {
  validateInputs([workflowId, ZId]);

  const deletedWorkflow = await prisma.workflow.delete({
    where: {
      id: workflowId,
    },
    select: selectWorkflow,
  });

  responseCache.revalidate({
    workflowId,
    environmentId: deletedWorkflow.environmentId,
  });
  workflowCache.revalidate({
    id: deletedWorkflow.id,
    environmentId: deletedWorkflow.environmentId,
  });

  // Revalidate triggers by actionClassId
  deletedWorkflow.triggers.forEach((trigger) => {
    workflowCache.revalidate({
      actionClassId: trigger.actionClass.id,
    });
  });
  // Revalidate workflows by attributeClassId
  deletedWorkflow.attributeFilters.forEach((attributeFilter) => {
    workflowCache.revalidate({
      attributeClassId: attributeFilter.attributeClassId,
    });
  });

  return deletedWorkflow;
}

export const createWorkflow = async (
  environmentId: string,
  workflowBody: TWorkflowInput
): Promise<TWorkflow> => {
  validateInputs([environmentId, ZId]);

  if (workflowBody.attributeFilters) {
    revalidateWorkflowByAttributeClassId(workflowBody.attributeFilters);
  }

  if (workflowBody.triggers) {
    const actionClasses = await getActionClasses(environmentId);
    revalidateWorkflowByActionClassId(actionClasses, workflowBody.triggers);
  }

  // TODO: Create with triggers & attributeFilters
  delete workflowBody.triggers;
  delete workflowBody.attributeFilters;
  const data: Omit<TWorkflowInput, "triggers" | "attributeFilters"> = {
    ...workflowBody,
  };

  const workflow = await prisma.workflow.create({
    data: {
      ...data,
      environment: {
        connect: {
          id: environmentId,
        },
      },
    },
    select: selectWorkflow,
  });

  const transformedWorkflow = {
    ...workflow,
    triggers: workflow.triggers.map((trigger) => trigger.actionClass.name),
  };

  workflowCache.revalidate({
    id: workflow.id,
    environmentId: workflow.environmentId,
  });

  return transformedWorkflow;
};

export const duplicateWorkflow = async (environmentId: string, workflowId: string) => {
  validateInputs([environmentId, ZId], [workflowId, ZId]);
  const existingWorkflow = await getWorkflow(workflowId);

  if (!existingWorkflow) {
    throw new ResourceNotFoundError("Workflow", workflowId);
  }

  const actionClasses = await getActionClasses(environmentId);
  const newAttributeFilters = existingWorkflow.attributeFilters.map((attributeFilter) => ({
    attributeClassId: attributeFilter.attributeClassId,
    condition: attributeFilter.condition,
    value: attributeFilter.value,
  }));

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
        create: existingWorkflow.triggers.map((trigger) => ({
          actionClassId: getActionClassIdFromName(actionClasses, trigger),
        })),
      },
      attributeFilters: {
        create: newAttributeFilters,
      },
      environment: {
        connect: {
          id: environmentId,
        },
      },
      workflowClosedMessage: existingWorkflow.workflowClosedMessage
        ? JSON.parse(JSON.stringify(existingWorkflow.workflowClosedMessage))
        : Prisma.JsonNull,
      singleUse: existingWorkflow.singleUse
        ? JSON.parse(JSON.stringify(existingWorkflow.singleUse))
        : Prisma.JsonNull,
      productOverwrites: existingWorkflow.productOverwrites
        ? JSON.parse(JSON.stringify(existingWorkflow.productOverwrites))
        : Prisma.JsonNull,
      styling: existingWorkflow.styling
        ? JSON.parse(JSON.stringify(existingWorkflow.styling))
        : Prisma.JsonNull,
      verifyEmail: existingWorkflow.verifyEmail
        ? JSON.parse(JSON.stringify(existingWorkflow.verifyEmail))
        : Prisma.JsonNull,
    },
  });

  workflowCache.revalidate({
    id: newWorkflow.id,
    environmentId: newWorkflow.environmentId,
  });

  // Revalidate workflows by actionClassId
  revalidateWorkflowByActionClassId(actionClasses, existingWorkflow.triggers);

  // Revalidate workflows by attributeClassId
  revalidateWorkflowByAttributeClassId(newAttributeFilters);

  return newWorkflow;
};

export const getSyncWorkflows = async (environmentId: string, person: TPerson): Promise<TWorkflow[]> => {
  validateInputs([environmentId, ZId]);

  const workflows = await unstable_cache(
    async () => {
      const product = await getProductByEnvironmentId(environmentId);

      if (!product) {
        throw new Error("Product not found");
      }

      let workflows = await getWorkflows(environmentId);

      // filtered workflows for running and web
      workflows = workflows.filter((workflow) => workflow.status === "inProgress" && workflow.type === "web");

      const displays = await getDisplaysByPersonId(person.id);

      // filter workflows that meet the displayOption criteria
      workflows = workflows.filter((workflow) => {
        if (workflow.displayOption === "respondMultiple") {
          return true;
        } else if (workflow.displayOption === "displayOnce") {
          return displays.filter((display) => display.workflowId === workflow.id).length === 0;
        } else if (workflow.displayOption === "displayMultiple") {
          return (
            displays.filter((display) => display.workflowId === workflow.id && display.responseId !== null)
              .length === 0
          );
        } else {
          throw Error("Invalid displayOption");
        }
      });

      const attributeClasses = await getAttributeClasses(environmentId);

      // filter workflows that meet the attributeFilters criteria
      const potentialWorkflowsWithAttributes = workflows.filter((workflow) => {
        const attributeFilters = workflow.attributeFilters;
        if (attributeFilters.length === 0) {
          return true;
        }
        // check if meets all attribute filters criterias
        return attributeFilters.every((attributeFilter) => {
          const attributeClassName = attributeClasses.find(
            (attributeClass) => attributeClass.id === attributeFilter.attributeClassId
          )?.name;
          if (!attributeClassName) {
            throw Error("Invalid attribute filter class");
          }
          const personAttributeValue = person.attributes[attributeClassName];
          if (attributeFilter.condition === "equals") {
            return personAttributeValue === attributeFilter.value;
          } else if (attributeFilter.condition === "notEquals") {
            return personAttributeValue !== attributeFilter.value;
          } else {
            throw Error("Invalid attribute filter condition");
          }
        });
      });

      const latestDisplay = displays[0];

      // filter workflows that meet the recontactDays criteria
      workflows = potentialWorkflowsWithAttributes.filter((workflow) => {
        if (!latestDisplay) {
          return true;
        } else if (workflow.recontactDays !== null) {
          const lastDisplayWorkflow = displays.filter((display) => display.workflowId === workflow.id)[0];
          if (!lastDisplayWorkflow) {
            return true;
          }
          return diffInDays(new Date(), new Date(lastDisplayWorkflow.createdAt)) >= workflow.recontactDays;
        } else if (product.recontactDays !== null) {
          return diffInDays(new Date(), new Date(latestDisplay.createdAt)) >= product.recontactDays;
        } else {
          return true;
        }
      });

      if (!workflows) {
        throw new ResourceNotFoundError("Workflow", environmentId);
      }
      return workflows;
    },
    [`getSyncWorkflows-${environmentId}-${person.userId}`],
    {
      tags: [
        personCache.tag.byEnvironmentIdAndUserId(environmentId, person.userId),
        displayCache.tag.byPersonId(person.id),
        workflowCache.tag.byEnvironmentId(environmentId),
        productCache.tag.byEnvironmentId(environmentId),
      ],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return workflows.map((workflow) => formatDateFields(workflow, ZWorkflow));
};

export const getWorkflowByResultShareKey = async (resultShareKey: string): Promise<string | null> => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        resultShareKey,
      },
    });

    if (!workflow) {
      return null;
    }

    return workflow.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
