import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { ZOptionalNumber } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, InvalidInputError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TLegacyWorkflow } from "@typeflowai/types/legacyWorkflow";
import { TPerson } from "@typeflowai/types/people";
import { TSegment, ZSegmentFilters } from "@typeflowai/types/segment";
import { TWorkflow, TWorkflowFilterCriteria, TWorkflowInput, ZWorkflow } from "@typeflowai/types/workflows";

import { getActionsByPersonId } from "../action/service";
import { getActionClasses } from "../actionClass/service";
import { attributeCache } from "../attribute/cache";
import { getAttributes } from "../attribute/service";
import { cache } from "../cache";
import { ITEMS_PER_PAGE } from "../constants";
import { displayCache } from "../display/cache";
import { getDisplaysByPersonId } from "../display/service";
import { reverseTranslateWorkflow } from "../i18n/reverseTranslation";
import { personCache } from "../person/cache";
import { getPerson } from "../person/service";
import { structuredClone } from "../pollyfills/structuredClone";
import { productCache } from "../product/cache";
import { getProductByEnvironmentId } from "../product/service";
import { responseCache } from "../response/cache";
import { segmentCache } from "../segment/cache";
import { createSegment, deleteSegment, evaluateSegment, getSegment, updateSegment } from "../segment/service";
import { transformSegmentFiltersToAttributeFilters } from "../segment/utils";
import { subscribeTeamMembersToWorkflowResponses } from "../team/service";
import { diffInDays } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { workflowCache } from "./cache";
import {
  anyWorkflowHasFilters,
  buildOrderByClause,
  buildWhereClause,
  transformPrismaWorkflow,
} from "./utils";

interface TriggerUpdate {
  create?: Array<{ actionClassId: string }>;
  deleteMany?: {
    actionClassId: {
      in: string[];
    };
  };
}

export const selectWorkflow = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  type: true,
  environmentId: true,
  createdBy: true,
  status: true,
  welcomeCard: true,
  questions: true,
  prompt: true,
  thankYouCard: true,
  hiddenFields: true,
  displayOption: true,
  recontactDays: true,
  displayLimit: true,
  autoClose: true,
  runOnDate: true,
  closeOnDate: true,
  delay: true,
  displayPercentage: true,
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
  languages: {
    select: {
      default: true,
      enabled: true,
      language: {
        select: {
          id: true,
          code: true,
          alias: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  },
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
          key: true,
          noCodeConfig: true,
        },
      },
    },
  },
  segment: {
    include: {
      workflows: {
        select: {
          id: true,
        },
      },
    },
  },
};

const checkTriggersValidity = (triggers: TWorkflow["triggers"], actionClasses: TActionClass[]) => {
  if (!triggers) return;

  // check if all the triggers are valid
  triggers.forEach((trigger) => {
    if (!actionClasses.find((actionClass) => actionClass.id === trigger.actionClass.id)) {
      throw new InvalidInputError("Invalid trigger id");
    }
  });

  // check if all the triggers are unique
  const triggerIds = triggers.map((trigger) => trigger.actionClass.id);

  if (new Set(triggerIds).size !== triggerIds.length) {
    throw new InvalidInputError("Duplicate trigger id");
  }
};

const handleTriggerUpdates = (
  updatedTriggers: TWorkflow["triggers"],
  currentTriggers: TWorkflow["triggers"],
  actionClasses: TActionClass[]
) => {
  console.log("updatedTriggers", updatedTriggers, currentTriggers);
  if (!updatedTriggers) return {};
  checkTriggersValidity(updatedTriggers, actionClasses);

  const currentTriggerIds = currentTriggers.map((trigger) => trigger.actionClass.id);
  const updatedTriggerIds = updatedTriggers.map((trigger) => trigger.actionClass.id);

  // added triggers are triggers that are not in the current triggers and are there in the new triggers
  const addedTriggers = updatedTriggers.filter(
    (trigger) => !currentTriggerIds.includes(trigger.actionClass.id)
  );

  // deleted triggers are triggers that are not in the new triggers and are there in the current triggers
  const deletedTriggers = currentTriggers.filter(
    (trigger) => !updatedTriggerIds.includes(trigger.actionClass.id)
  );

  // Construct the triggers update object
  const triggersUpdate: TriggerUpdate = {};

  if (addedTriggers.length > 0) {
    triggersUpdate.create = addedTriggers.map((trigger) => ({
      actionClassId: trigger.actionClass.id,
    }));
  }

  if (deletedTriggers.length > 0) {
    // disconnect the public triggers from the workflow
    triggersUpdate.deleteMany = {
      actionClassId: {
        in: deletedTriggers.map((trigger) => trigger.actionClass.id),
      },
    };
  }

  [...addedTriggers, ...deletedTriggers].forEach((trigger) => {
    workflowCache.revalidate({
      actionClassId: trigger.actionClass.id,
    });
  });

  return triggersUpdate;
};

export const getWorkflow = (workflowId: string): Promise<TWorkflow | null> =>
  cache(
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

      return transformPrismaWorkflow(workflowPrisma);
    },
    [`getWorkflow-${workflowId}`],
    {
      tags: [workflowCache.tag.byId(workflowId)],
    }
  )();

export const getWorkflowsByActionClassId = (actionClassId: string, page?: number): Promise<TWorkflow[]> =>
  cache(
    async () => {
      validateInputs([actionClassId, ZId], [page, ZOptionalNumber]);

      let workflowsPrisma;
      try {
        workflowsPrisma = await prisma.workflow.findMany({
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
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }

      const workflows: TWorkflow[] = [];

      for (const workflowPrisma of workflowsPrisma) {
        const transformedWorkflow = transformPrismaWorkflow(workflowPrisma);
        workflows.push(transformedWorkflow);
      }

      return workflows;
    },
    [`getWorkflowsByActionClassId-${actionClassId}-${page}`],
    {
      tags: [workflowCache.tag.byActionClassId(actionClassId)],
    }
  )();

export const getWorkflows = (
  environmentId: string,
  limit?: number,
  offset?: number,
  filterCriteria?: TWorkflowFilterCriteria
): Promise<TWorkflow[]> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId], [limit, ZOptionalNumber], [offset, ZOptionalNumber]);
      let workflowsPrisma;

      try {
        workflowsPrisma = await prisma.workflow.findMany({
          where: {
            environmentId,
            ...buildWhereClause(filterCriteria),
          },
          select: selectWorkflow,
          orderBy: buildOrderByClause(filterCriteria?.sortBy),
          take: limit ? limit : undefined,
          skip: offset ? offset : undefined,
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
        const transformedWorkflow = transformPrismaWorkflow(workflowPrisma);
        workflows.push(transformedWorkflow);
      }
      return workflows;
    },
    [`getWorkflows-${environmentId}-${limit}-${offset}-${JSON.stringify(filterCriteria)}`],
    {
      tags: [workflowCache.tag.byEnvironmentId(environmentId)],
    }
  )();

export const transformToLegacyWorkflow = async (
  workflow: TWorkflow,
  languageCode?: string
): Promise<TLegacyWorkflow> => {
  const targetLanguage = languageCode ?? "default";
  const transformedWorkflow = reverseTranslateWorkflow(workflow, targetLanguage);

  return transformedWorkflow;
};

export const getWorkflowCount = async (environmentId: string): Promise<number> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);
      try {
        const workflowCount = await prisma.workflow.count({
          where: {
            environmentId: environmentId,
          },
        });

        return workflowCount;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getWorkflowCount-${environmentId}`],
    {
      tags: [workflowCache.tag.byEnvironmentId(environmentId)],
    }
  )();

export const updateWorkflow = async (updatedWorkflow: TWorkflow): Promise<TWorkflow> => {
  validateInputs([updatedWorkflow, ZWorkflow]);

  try {
    const workflowId = updatedWorkflow.id;
    let data: any = {};

    const actionClasses = await getActionClasses(updatedWorkflow.environmentId);
    const currentWorkflow = await getWorkflow(workflowId);

    if (!currentWorkflow) {
      throw new ResourceNotFoundError("Workflow", workflowId);
    }

    const { triggers, environmentId, segment, questions, languages, type, ...workflowData } = updatedWorkflow;

    if (languages) {
      // Process languages update logic here
      // Extract currentLanguageIds and updatedLanguageIds
      const currentLanguageIds = currentWorkflow.languages
        ? currentWorkflow.languages.map((l) => l.language.id)
        : [];
      const updatedLanguageIds =
        languages.length > 1 ? updatedWorkflow.languages.map((l) => l.language.id) : [];
      const enabledLanguageIds = languages.map((language) => {
        if (language.enabled) return language.language.id;
      });

      // Determine languages to add and remove
      const languagesToAdd = updatedLanguageIds.filter((id) => !currentLanguageIds.includes(id));
      const languagesToRemove = currentLanguageIds.filter((id) => !updatedLanguageIds.includes(id));

      const defaultLanguageId = updatedWorkflow.languages.find((l) => l.default)?.language.id;

      // Prepare data for Prisma update
      data.languages = {};

      // Update existing languages for default value changes
      data.languages.updateMany = currentWorkflow.languages.map((workflowLanguage) => ({
        where: { languageId: workflowLanguage.language.id },
        data: {
          default: workflowLanguage.language.id === defaultLanguageId,
          enabled: enabledLanguageIds.includes(workflowLanguage.language.id),
        },
      }));

      // Add new languages
      if (languagesToAdd.length > 0) {
        data.languages.create = languagesToAdd.map((languageId) => ({
          languageId: languageId,
          default: languageId === defaultLanguageId,
          enabled: enabledLanguageIds.includes(languageId),
        }));
      }

      // Remove languages no longer associated with the workflow
      if (languagesToRemove.length > 0) {
        data.languages.deleteMany = languagesToRemove.map((languageId) => ({
          languageId: languageId,
          enabled: enabledLanguageIds.includes(languageId),
        }));
      }
    }

    if (triggers) {
      data.triggers = handleTriggerUpdates(triggers, currentWorkflow.triggers, actionClasses);
    }

    // if the workflow body has type other than "app" but has a private segment, we delete that segment, and if it has a public segment, we disconnect from to the workflow
    if (segment) {
      if (type === "app") {
        // parse the segment filters:
        const parsedFilters = ZSegmentFilters.safeParse(segment.filters);
        if (!parsedFilters.success) {
          throw new InvalidInputError("Invalid user segment filters");
        }

        try {
          await updateSegment(segment.id, segment);
        } catch (error) {
          console.error(error);
          throw new Error("Error updating workflow");
        }
      } else {
        if (segment.isPrivate) {
          await deleteSegment(segment.id);
        } else {
          await prisma.workflow.update({
            where: {
              id: workflowId,
            },
            data: {
              segment: {
                disconnect: true,
              },
            },
          });
        }
      }

      segmentCache.revalidate({
        id: segment.id,
        environmentId: segment.environmentId,
      });
    }
    data.questions = questions.map((question) => {
      const { isDraft, ...rest } = question;
      return rest;
    });

    workflowData.updatedAt = new Date();

    data = {
      ...workflowData,
      ...data,
      type,
    };

    // Remove scheduled status when runOnDate is not set
    if (data.status === "scheduled" && data.runOnDate === null) {
      data.status = "inProgress";
    }
    // Set scheduled status when runOnDate is set and in the future on completed workflows
    if (
      (data.status === "completed" || data.status === "paused" || data.status === "inProgress") &&
      data.runOnDate &&
      data.runOnDate > new Date()
    ) {
      data.status = "scheduled";
    }

    const prismaWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data,
      select: selectWorkflow,
    });

    let workflowSegment: TSegment | null = null;
    if (prismaWorkflow.segment) {
      workflowSegment = {
        ...prismaWorkflow.segment,
        workflows: prismaWorkflow.segment.workflows.map((workflow) => workflow.id),
      };
    }

    // TODO: Fix this, this happens because the workflow type "web" is no longer in the zod types but its required in the schema for migration
    // @ts-expect-error
    const modifiedWorkflow: TWorkflow = {
      ...prismaWorkflow, // Properties from prismaWorkflow
      displayPercentage: Number(prismaWorkflow.displayPercentage) || null,
      segment: workflowSegment,
    };

    workflowCache.revalidate({
      id: modifiedWorkflow.id,
      environmentId: modifiedWorkflow.environmentId,
      segmentId: modifiedWorkflow.segment?.id,
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

  try {
    const deletedWorkflow = await prisma.workflow.delete({
      where: {
        id: workflowId,
      },
      select: selectWorkflow,
    });

    if (deletedWorkflow.type === "app" && deletedWorkflow.segment?.isPrivate) {
      const deletedSegment = await prisma.segment.delete({
        where: {
          id: deletedWorkflow.segment.id,
        },
      });

      if (deletedSegment) {
        segmentCache.revalidate({
          id: deletedSegment.id,
          environmentId: deletedWorkflow.environmentId,
        });
      }
    }

    responseCache.revalidate({
      workflowId,
      environmentId: deletedWorkflow.environmentId,
    });
    workflowCache.revalidate({
      id: deletedWorkflow.id,
      environmentId: deletedWorkflow.environmentId,
    });

    if (deletedWorkflow.segment?.id) {
      segmentCache.revalidate({
        id: deletedWorkflow.segment.id,
        environmentId: deletedWorkflow.environmentId,
      });
    }

    // Revalidate public triggers by actionClassId
    deletedWorkflow.triggers.forEach((trigger) => {
      workflowCache.revalidate({
        actionClassId: trigger.actionClass.id,
      });
    });

    return deletedWorkflow;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }

    throw error;
  }
}

export const createWorkflow = async (
  environmentId: string,
  workflowBody: TWorkflowInput
): Promise<TWorkflow> => {
  validateInputs([environmentId, ZId]);

  try {
    const createdBy = workflowBody.createdBy;
    delete workflowBody.createdBy;

    const actionClasses = await getActionClasses(environmentId);
    const data: Omit<Prisma.WorkflowCreateInput, "environment"> = {
      ...workflowBody,
      // TODO: Create with attributeFilters
      triggers: workflowBody.triggers
        ? handleTriggerUpdates(workflowBody.triggers, [], actionClasses)
        : undefined,
      attributeFilters: undefined,
    };

    if ((workflowBody.type === "website" || workflowBody.type === "app") && data.thankYouCard) {
      data.thankYouCard.buttonLabel = undefined;
      data.thankYouCard.buttonLink = undefined;
    }

    if (createdBy) {
      data.creator = {
        connect: {
          id: createdBy,
        },
      };
    }

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

    // if the workflow created is an "app" workflow, we also create a private segment for it.
    if (workflow.type === "app") {
      const newSegment = await createSegment({
        environmentId,
        workflowId: workflow.id,
        filters: [],
        title: workflow.id,
        isPrivate: true,
      });

      await prisma.workflow.update({
        where: {
          id: workflow.id,
        },
        data: {
          segment: {
            connect: {
              id: newSegment.id,
            },
          },
        },
      });

      segmentCache.revalidate({
        id: newSegment.id,
        environmentId: workflow.environmentId,
      });
    }

    // TODO: Fix this, this happens because the workflow type "web" is no longer in the zod types but its required in the schema for migration
    // @ts-expect-error
    const transformedWorkflow: TWorkflow = {
      ...workflow,
      ...(workflow.segment && {
        segment: {
          ...workflow.segment,
          workflows: workflow.segment.workflows.map((workflow) => workflow.id),
        },
      }),
    };

    await subscribeTeamMembersToWorkflowResponses(environmentId, workflow.id);

    workflowCache.revalidate({
      id: workflow.id,
      environmentId: workflow.environmentId,
    });

    return transformedWorkflow;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const duplicateWorkflow = async (environmentId: string, workflowId: string, userId: string) => {
  validateInputs([environmentId, ZId], [workflowId, ZId]);

  try {
    const existingWorkflow = await getWorkflow(workflowId);
    const currentDate = new Date();
    if (!existingWorkflow) {
      throw new ResourceNotFoundError("Workflow", workflowId);
    }

    const defaultLanguageId = existingWorkflow.languages.find((l) => l.default)?.language.id;

    // create new workflow with the data of the existing workflow
    const newWorkflow = await prisma.workflow.create({
      data: {
        ...existingWorkflow,
        id: undefined, // id is auto-generated
        environmentId: undefined, // environmentId is set below
        createdAt: currentDate,
        updatedAt: currentDate,
        createdBy: undefined,
        name: `${existingWorkflow.name} (copy)`,
        status: "draft",
        questions: structuredClone(existingWorkflow.questions),
        thankYouCard: structuredClone(existingWorkflow.thankYouCard),
        languages: {
          create: existingWorkflow.languages?.map((workflowLanguage) => ({
            languageId: workflowLanguage.language.id,
            default: workflowLanguage.language.id === defaultLanguageId,
          })),
        },
        triggers: {
          create: existingWorkflow.triggers.map((trigger) => ({
            actionClassId: trigger.actionClass.id,
          })),
        },
        environment: {
          connect: {
            id: environmentId,
          },
        },
        creator: {
          connect: {
            id: userId,
          },
        },
        workflowClosedMessage: existingWorkflow.workflowClosedMessage
          ? structuredClone(existingWorkflow.workflowClosedMessage)
          : Prisma.JsonNull,
        singleUse: existingWorkflow.singleUse ? structuredClone(existingWorkflow.singleUse) : Prisma.JsonNull,
        productOverwrites: existingWorkflow.productOverwrites
          ? structuredClone(existingWorkflow.productOverwrites)
          : Prisma.JsonNull,
        styling: existingWorkflow.styling ? structuredClone(existingWorkflow.styling) : Prisma.JsonNull,
        verifyEmail: existingWorkflow.verifyEmail
          ? structuredClone(existingWorkflow.verifyEmail)
          : Prisma.JsonNull,
        // we'll update the segment later
        segment: undefined,
      },
    });

    // if the existing workflow has an inline segment, we copy the filters and create a new inline segment and connect it to the new workflow
    if (existingWorkflow.segment) {
      if (existingWorkflow.segment.isPrivate) {
        const newInlineSegment = await createSegment({
          environmentId,
          title: `${newWorkflow.id}`,
          isPrivate: true,
          workflowId: newWorkflow.id,
          filters: existingWorkflow.segment.filters,
        });

        await prisma.workflow.update({
          where: {
            id: newWorkflow.id,
          },
          data: {
            segment: {
              connect: {
                id: newInlineSegment.id,
              },
            },
          },
        });

        segmentCache.revalidate({
          id: newInlineSegment.id,
          environmentId: newWorkflow.environmentId,
        });
      } else {
        await prisma.workflow.update({
          where: {
            id: newWorkflow.id,
          },
          data: {
            segment: {
              connect: {
                id: existingWorkflow.segment.id,
              },
            },
          },
        });

        segmentCache.revalidate({
          id: existingWorkflow.segment.id,
          environmentId: newWorkflow.environmentId,
        });
      }
    }

    workflowCache.revalidate({
      id: newWorkflow.id,
      environmentId: newWorkflow.environmentId,
    });

    existingWorkflow.triggers.forEach((trigger) => {
      workflowCache.revalidate({
        actionClassId: trigger.actionClass.id,
      });
    });

    return newWorkflow;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getSyncWorkflows = (
  environmentId: string,
  personId: string,
  deviceType: "phone" | "desktop" = "desktop",
  options?: {
    version?: string;
  }
): Promise<TWorkflow[] | TLegacyWorkflow[]> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);
      try {
        const product = await getProductByEnvironmentId(environmentId);

        if (!product) {
          throw new Error("Product not found");
        }

        const person = personId === "legacy" ? ({ id: "legacy" } as TPerson) : await getPerson(personId);

        if (!person) {
          throw new Error("Person not found");
        }

        let workflows: TWorkflow[] | TLegacyWorkflow[] = await getWorkflows(environmentId);

        // filtered workflows for running and web
        workflows = workflows.filter(
          (workflow) => workflow.status === "inProgress" && workflow.type === "app"
        );

        // if no workflows are left, return an empty array
        if (workflows.length === 0) {
          return [];
        }

        const displays = await getDisplaysByPersonId(person.id);

        // filter workflows that meet the displayOption criteria
        workflows = workflows.filter((workflow) => {
          switch (workflow.displayOption) {
            case "respondMultiple":
              return true;
            case "displayOnce":
              return displays.filter((display) => display.workflowId === workflow.id).length === 0;
            case "displayMultiple":
              return (
                displays
                  .filter((display) => display.workflowId === workflow.id)
                  .filter((display) => display.responseId).length === 0
              );
            case "displaySome":
              if (workflow.displayLimit === null) {
                return true;
              }

              if (
                displays
                  .filter((display) => display.workflowId === workflow.id)
                  .some((display) => display.responseId)
              ) {
                return false;
              }

              return (
                displays.filter((display) => display.workflowId === workflow.id).length <
                workflow.displayLimit
              );
            default:
              throw Error("Invalid displayOption");
          }
        });

        const latestDisplay = displays[0];

        // filter workflows that meet the recontactDays criteria
        workflows = workflows.filter((workflow) => {
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

        // if no workflows are left, return an empty array
        if (workflows.length === 0) {
          return [];
        }

        // if no workflows have segment filters, return the workflows
        if (!anyWorkflowHasFilters(workflows)) {
          return workflows;
        }

        const personActions = await getActionsByPersonId(person.id);
        const personActionClassIds = Array.from(
          new Set(personActions?.map((action) => action.actionClass?.id ?? ""))
        );

        const attributes = await getAttributes(person.id);
        const personUserId = person.userId;

        // the workflows now have segment filters, so we need to evaluate them
        const workflowPromises = workflows.map(async (workflow) => {
          const { segment } = workflow;
          // if the workflow has no segment, or the segment has no filters, we return the workflow
          if (!segment || !segment.filters?.length) {
            return workflow;
          }

          // backwards compatibility for older versions of the js package
          // if the version is not provided, we will use the old method of evaluating the segment, which is attribute filters
          // transform the segment filters to attribute filters and evaluate them
          if (!options?.version) {
            const attributeFilters = transformSegmentFiltersToAttributeFilters(segment.filters);

            // if the attribute filters are null, it means the segment filters don't match the expected format for attribute filters, so we skip this workflow
            if (attributeFilters === null) {
              return null;
            }

            // if there are no attribute filters, we return the workflow
            if (!attributeFilters.length) {
              return workflow;
            }

            // we check if the person meets the attribute filters for all the attribute filters
            const isEligible = attributeFilters.every((attributeFilter) => {
              const personAttributeValue = attributes[attributeFilter.attributeClassName];
              if (!personAttributeValue) {
                return false;
              }

              if (attributeFilter.operator === "equals") {
                return personAttributeValue === attributeFilter.value;
              } else if (attributeFilter.operator === "notEquals") {
                return personAttributeValue !== attributeFilter.value;
              } else {
                // if the operator is not equals or not equals, we skip the workflow, this means that new segment filter options are being used
                return false;
              }
            });

            return isEligible ? workflow : null;
          }

          // Evaluate the segment filters
          const result = await evaluateSegment(
            {
              attributes: attributes ?? {},
              actionIds: personActionClassIds,
              deviceType,
              environmentId,
              personId: person.id,
              userId: personUserId,
            },
            segment.filters
          );

          return result ? workflow : null;
        });

        const resolvedWorkflows = await Promise.all(workflowPromises);
        workflows = resolvedWorkflows.filter((workflow) => !!workflow) as TWorkflow[];

        if (!workflows) {
          throw new ResourceNotFoundError("Workflow", environmentId);
        }
        return workflows;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(error);
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getSyncWorkflows-${environmentId}-${personId}`],
    {
      tags: [
        personCache.tag.byEnvironmentId(environmentId),
        personCache.tag.byId(personId),
        displayCache.tag.byPersonId(personId),
        workflowCache.tag.byEnvironmentId(environmentId),
        productCache.tag.byEnvironmentId(environmentId),
        attributeCache.tag.byPersonId(personId),
      ],
    }
  )();

export const getWorkflowIdByResultShareKey = async (resultShareKey: string): Promise<string | null> => {
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        resultShareKey,
      },
      select: {
        id: true,
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

export const loadNewSegmentInWorkflow = async (
  workflowId: string,
  newSegmentId: string
): Promise<TWorkflow> => {
  validateInputs([workflowId, ZId], [newSegmentId, ZId]);
  try {
    const currentWorkflow = await getWorkflow(workflowId);
    if (!currentWorkflow) {
      throw new ResourceNotFoundError("workflow", workflowId);
    }

    const currentSegment = await getSegment(newSegmentId);
    if (!currentSegment) {
      throw new ResourceNotFoundError("segment", newSegmentId);
    }

    const prismaWorkflow = await prisma.workflow.update({
      where: {
        id: workflowId,
      },
      select: selectWorkflow,
      data: {
        segment: {
          connect: {
            id: newSegmentId,
          },
        },
      },
    });

    segmentCache.revalidate({ id: newSegmentId });
    workflowCache.revalidate({ id: workflowId });

    let workflowSegment: TSegment | null = null;
    if (prismaWorkflow.segment) {
      workflowSegment = {
        ...prismaWorkflow.segment,
        workflows: prismaWorkflow.segment.workflows.map((workflow) => workflow.id),
      };
    }

    // TODO: Fix this, this happens because the workflow type "web" is no longer in the zod types but its required in the schema for migration
    // @ts-expect-error
    const modifiedWorkflow: TWorkflow = {
      ...prismaWorkflow, // Properties from prismaWorkflow
      segment: workflowSegment,
    };

    return modifiedWorkflow;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getWorkflowsBySegmentId = (segmentId: string): Promise<TWorkflow[]> =>
  cache(
    async () => {
      try {
        const workflowsPrisma = await prisma.workflow.findMany({
          where: { segmentId },
          select: selectWorkflow,
        });

        const workflows: TWorkflow[] = [];

        for (const workflowPrisma of workflowsPrisma) {
          const transformedWorkflow = transformPrismaWorkflow(workflowPrisma);
          workflows.push(transformedWorkflow);
        }

        return workflows;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getWorkflowsBySegmentId-${segmentId}`],
    {
      tags: [workflowCache.tag.bySegmentId(segmentId), segmentCache.tag.byId(segmentId)],
    }
  )();
