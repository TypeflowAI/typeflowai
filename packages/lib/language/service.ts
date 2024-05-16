import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ValidationError } from "@typeflowai/types/errors";
import {
  TLanguage,
  TLanguageInput,
  TLanguageUpdate,
  ZLanguageInput,
  ZLanguageUpdate,
} from "@typeflowai/types/product";

import { productCache } from "../product/cache";
import { validateInputs } from "../utils/validate";
import { workflowCache } from "../workflow/cache";

const languageSelect = {
  id: true,
  code: true,
  alias: true,
  productId: true,
  createdAt: true,
  updatedAt: true,
};

export const createLanguage = async (
  productId: string,
  environmentId: string,
  languageInput: TLanguageInput
): Promise<TLanguage> => {
  try {
    validateInputs([productId, ZId], [environmentId, ZId], [languageInput, ZLanguageInput]);
    if (!languageInput.code) {
      throw new ValidationError("Language code is required");
    }

    const language = await prisma.language.create({
      data: {
        ...languageInput,
        product: {
          connect: { id: productId },
        },
      },
      select: languageSelect,
    });

    productCache.revalidate({
      id: productId,
      environmentId,
    });

    return language;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const getWorkflowsUsingGivenLanguage = async (languageId: string): Promise<string[]> => {
  try {
    // Check if the language is used in any workflow
    const workflows = await prisma.workflowLanguage.findMany({
      where: {
        languageId: languageId,
      },
      select: {
        workflow: {
          select: {
            name: true,
          },
        },
      },
    });

    // Extracting workflow names
    const workflowNames = workflows.map((s) => s.workflow.name);
    return workflowNames;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const deleteLanguage = async (environmentId: string, languageId: string): Promise<TLanguage> => {
  try {
    validateInputs([languageId, ZId]);

    const prismaLanguage = await prisma.language.delete({
      where: { id: languageId },
      select: { ...languageSelect, workflowLanguages: { select: { workflowId: true } } },
    });

    productCache.revalidate({
      id: prismaLanguage.productId,
      environmentId,
    });

    // revalidate cache of all connected workflows
    prismaLanguage.workflowLanguages.forEach((workflowLanguage) => {
      workflowCache.revalidate({
        id: workflowLanguage.workflowId,
        environmentId,
      });
    });

    // delete unused workflowLanguages
    const language = { ...prismaLanguage, workflowLanguages: undefined };

    return language;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const updateLanguage = async (
  environmentId: string,
  languageId: string,
  languageInput: TLanguageUpdate
): Promise<TLanguage> => {
  try {
    validateInputs([languageId, ZId], [languageInput, ZLanguageUpdate]);

    const prismaLanguage = await prisma.language.update({
      where: { id: languageId },
      data: { ...languageInput, updatedAt: new Date() },
      select: { ...languageSelect, workflowLanguages: { select: { workflowId: true } } },
    });

    productCache.revalidate({
      id: prismaLanguage.productId,
      environmentId,
    });

    // revalidate cache of all connected workflows
    prismaLanguage.workflowLanguages.forEach((workflowLanguage) => {
      workflowCache.revalidate({
        id: workflowLanguage.workflowId,
        environmentId,
      });
    });

    // delete unused workflowLanguages
    const language = { ...prismaLanguage, workflowLanguages: undefined };

    return language;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};
