"use server";

import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { TActionClass, TActionClassInput, ZActionClassInput } from "@typeflowai/types/actionClasses";
import { ZOptionalNumber, ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";

import { cache } from "../cache";
import { ITEMS_PER_PAGE } from "../constants";
import { structuredClone } from "../pollyfills/structuredClone";
import { validateInputs } from "../utils/validate";
import { actionClassCache } from "./cache";

const select = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  description: true,
  type: true,
  noCodeConfig: true,
  environmentId: true,
};

export const getActionClasses = (environmentId: string, page?: number): Promise<TActionClass[]> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId], [page, ZOptionalNumber]);

      try {
        return await prisma.actionClass.findMany({
          where: {
            environmentId: environmentId,
          },
          select,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
          orderBy: {
            createdAt: "asc",
          },
        });
      } catch (error) {
        throw new DatabaseError(`Database error when fetching actions for environment ${environmentId}`);
      }
    },
    [`getActionClasses-${environmentId}-${page}`],
    {
      tags: [actionClassCache.tag.byEnvironmentId(environmentId)],
    }
  )();

export const getActionClassByEnvironmentIdAndName = (
  environmentId: string,
  name: string
): Promise<TActionClass | null> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId], [name, ZString]);

      try {
        const actionClass = await prisma.actionClass.findFirst({
          where: {
            name,
            environmentId,
          },
          select,
        });

        return actionClass;
      } catch (error) {
        throw new DatabaseError(`Database error when fetching action`);
      }
    },
    [`getActionClassByEnvironmentIdAndName-${environmentId}-${name}`],
    {
      tags: [actionClassCache.tag.byNameAndEnvironmentId(name, environmentId)],
    }
  )();

export const getActionClass = (actionClassId: string): Promise<TActionClass | null> =>
  cache(
    async () => {
      validateInputs([actionClassId, ZId]);

      try {
        const actionClass = await prisma.actionClass.findUnique({
          where: {
            id: actionClassId,
          },
          select,
        });

        return actionClass;
      } catch (error) {
        throw new DatabaseError(`Database error when fetching action`);
      }
    },
    [`getActionClass-${actionClassId}`],
    {
      tags: [actionClassCache.tag.byId(actionClassId)],
    }
  )();

export const deleteActionClass = async (
  environmentId: string,
  actionClassId: string
): Promise<TActionClass> => {
  validateInputs([environmentId, ZId], [actionClassId, ZId]);

  try {
    const actionClass = await prisma.actionClass.delete({
      where: {
        id: actionClassId,
      },
      select,
    });
    if (actionClass === null) throw new ResourceNotFoundError("Action", actionClassId);

    actionClassCache.revalidate({
      environmentId,
      id: actionClassId,
      name: actionClass.name,
    });

    return actionClass;
  } catch (error) {
    throw new DatabaseError(
      `Database error when deleting an action with id ${actionClassId} for environment ${environmentId}`
    );
  }
};

export const createActionClass = async (
  environmentId: string,
  actionClass: TActionClassInput
): Promise<TActionClass> => {
  validateInputs([environmentId, ZId], [actionClass, ZActionClassInput]);

  try {
    const actionClassPrisma = await prisma.actionClass.create({
      data: {
        name: actionClass.name,
        description: actionClass.description,
        type: actionClass.type,
        noCodeConfig: actionClass.noCodeConfig ? structuredClone(actionClass.noCodeConfig) : undefined,
        environment: { connect: { id: environmentId } },
      },
      select,
    });

    actionClassCache.revalidate({
      name: actionClassPrisma.name,
      environmentId: actionClassPrisma.environmentId,
      id: actionClassPrisma.id,
    });

    return actionClassPrisma;
  } catch (error) {
    console.error(error);
    throw new DatabaseError(`Database error when creating an action for environment ${environmentId}`);
  }
};

export const updateActionClass = async (
  environmentId: string,
  actionClassId: string,
  inputActionClass: Partial<TActionClassInput>
): Promise<TActionClass> => {
  validateInputs([environmentId, ZId], [actionClassId, ZId], [inputActionClass, ZActionClassInput.partial()]);

  try {
    const result = await prisma.actionClass.update({
      where: {
        id: actionClassId,
      },
      data: {
        name: inputActionClass.name,
        description: inputActionClass.description,
        type: inputActionClass.type,
        noCodeConfig: inputActionClass.noCodeConfig
          ? structuredClone(inputActionClass.noCodeConfig)
          : undefined,
      },
      select,
    });

    // revalidate cache
    actionClassCache.revalidate({
      environmentId: result.environmentId,
      name: result.name,
      id: result.id,
    });

    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};
