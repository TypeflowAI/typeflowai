import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@typeflowai/database";
import { ZOptionalNumber } from "@typeflowai/types/common";
import {
  TDisplay,
  TDisplayCreateInput,
  TDisplayUpdateInput,
  ZDisplay,
  ZDisplayCreateInput,
  ZDisplayUpdateInput,
} from "@typeflowai/types/displays";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TPerson } from "@typeflowai/types/people";

import { ITEMS_PER_PAGE, SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { createPerson, getPersonByUserId } from "../person/service";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { displayCache } from "./cache";

const selectDisplay = {
  id: true,
  createdAt: true,
  updatedAt: true,
  workflowId: true,
  responseId: true,
  personId: true,
};

export const getDisplay = async (displayId: string): Promise<TDisplay | null> => {
  const display = await unstable_cache(
    async () => {
      validateInputs([displayId, ZId]);

      try {
        const display = await prisma.response.findUnique({
          where: {
            id: displayId,
          },
          select: selectDisplay,
        });

        return display;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getDisplay-${displayId}`],
    {
      tags: [displayCache.tag.byId(displayId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return display ? formatDateFields(display, ZDisplay) : null;
};

export const updateDisplay = async (
  displayId: string,
  displayInput: TDisplayUpdateInput
): Promise<TDisplay> => {
  validateInputs([displayInput, ZDisplayUpdateInput.partial()]);

  let person: TPerson | null = null;
  if (displayInput.userId) {
    person = await getPersonByUserId(displayInput.environmentId, displayInput.userId);
    if (!person) {
      throw new ResourceNotFoundError("Person", displayInput.userId);
    }
  }

  try {
    const data = {
      ...(person?.id && {
        person: {
          connect: {
            id: person.id,
          },
        },
      }),
      ...(displayInput.responseId && {
        responseId: displayInput.responseId,
      }),
    };
    const display = await prisma.display.update({
      where: {
        id: displayId,
      },
      data,
      select: selectDisplay,
    });

    displayCache.revalidate({
      id: display.id,
      workflowId: display.workflowId,
    });

    return display;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const createDisplay = async (displayInput: TDisplayCreateInput): Promise<TDisplay> => {
  validateInputs([displayInput, ZDisplayCreateInput]);

  const { environmentId, userId, workflowId } = displayInput;

  try {
    let person;
    if (userId) {
      person = await getPersonByUserId(environmentId, userId);
      if (!person) {
        person = await createPerson(environmentId, userId);
      }
    }
    const display = await prisma.display.create({
      data: {
        workflow: {
          connect: {
            id: workflowId,
          },
        },

        ...(person && {
          person: {
            connect: {
              id: person.id,
            },
          },
        }),
      },
      select: selectDisplay,
    });

    displayCache.revalidate({
      id: display.id,
      personId: display.personId,
      workflowId: display.workflowId,
    });

    return display;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getDisplaysByPersonId = async (personId: string, page?: number): Promise<TDisplay[]> => {
  const displays = await unstable_cache(
    async () => {
      validateInputs([personId, ZId], [page, ZOptionalNumber]);

      try {
        const displays = await prisma.display.findMany({
          where: {
            personId: personId,
          },
          select: selectDisplay,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
          orderBy: {
            createdAt: "desc",
          },
        });

        return displays;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getDisplaysByPersonId-${personId}-${page}`],
    {
      tags: [displayCache.tag.byPersonId(personId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
  return displays.map((display) => formatDateFields(display, ZDisplay));
};

export const deleteDisplayByResponseId = async (
  responseId: string,
  workflowId: string
): Promise<TDisplay | null> => {
  validateInputs([responseId, ZId], [workflowId, ZId]);

  try {
    const display = await prisma.display.delete({
      where: {
        responseId,
      },
      select: selectDisplay,
    });

    displayCache.revalidate({
      id: display.id,
      personId: display.personId,
      workflowId,
    });

    return display;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const getDisplayCountByWorkflowId = async (workflowId: string): Promise<number> =>
  unstable_cache(
    async () => {
      validateInputs([workflowId, ZId]);

      try {
        const displayCount = await prisma.display.count({
          where: {
            workflowId: workflowId,
          },
        });
        return displayCount;
      } catch (error) {
        throw error;
      }
    },
    [`getDisplayCountByWorkflowId-${workflowId}`],
    {
      tags: [displayCache.tag.byWorkflowId(workflowId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
