import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@typeflowai/database";
import { ZOptionalNumber, ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TPerson } from "@typeflowai/types/people";
import {
  TResponse,
  TResponseInput,
  TResponseUpdateInput,
  ZResponse,
  ZResponseInput,
  ZResponseNote,
  ZResponseUpdateInput,
} from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";

import { ITEMS_PER_PAGE, SERVICES_REVALIDATION_INTERVAL } from "../constants";
import { deleteDisplayByResponseId } from "../display/service";
import { createPerson, getPersonByUserId, transformPrismaPerson } from "../person/service";
import { calculateTtcTotal } from "../response/util";
import { responseNoteCache } from "../responseNote/cache";
import { getResponseNotes } from "../responseNote/service";
import { captureTelemetry } from "../telemetry";
import { formatDateFields } from "../utils/datetime";
import { validateInputs } from "../utils/validate";
import { responseCache } from "./cache";

export const responseSelection = {
  id: true,
  createdAt: true,
  updatedAt: true,
  workflowId: true,
  finished: true,
  data: true,
  meta: true,
  ttc: true,
  personAttributes: true,
  singleUseId: true,
  person: {
    select: {
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      environmentId: true,
      attributes: {
        select: {
          value: true,
          attributeClass: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          environmentId: true,
        },
      },
    },
  },
  notes: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      text: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      isResolved: true,
      isEdited: true,
    },
  },
};

export const getResponsesByPersonId = async (
  personId: string,
  page?: number
): Promise<Array<TResponse> | null> => {
  const responses = await unstable_cache(
    async () => {
      validateInputs([personId, ZId], [page, ZOptionalNumber]);

      try {
        const responsePrisma = await prisma.response.findMany({
          where: {
            personId,
          },
          select: responseSelection,
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });

        if (!responsePrisma) {
          throw new ResourceNotFoundError("Response from PersonId", personId);
        }

        let responses: Array<TResponse> = [];

        await Promise.all(
          responsePrisma.map(async (response) => {
            const responseNotes = await getResponseNotes(response.id);
            responses.push({
              ...response,
              notes: responseNotes,
              person: response.person ? transformPrismaPerson(response.person) : null,
              tags: response.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
            });
          })
        );

        return responses;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponsesByPersonId-${personId}-${page}`],
    {
      tags: [responseCache.tag.byPersonId(personId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return responses.map((response) => ({
    ...formatDateFields(response, ZResponse),
    notes: response.notes.map((note) => formatDateFields(note, ZResponseNote)),
  }));
};

export const getResponseBySingleUseId = async (
  workflowId: string,
  singleUseId: string
): Promise<TResponse | null> => {
  const response = await unstable_cache(
    async () => {
      validateInputs([workflowId, ZId], [singleUseId, ZString]);

      try {
        const responsePrisma = await prisma.response.findUnique({
          where: {
            workflowId_singleUseId: { workflowId, singleUseId },
          },
          select: responseSelection,
        });

        if (!responsePrisma) {
          return null;
        }

        const response: TResponse = {
          ...responsePrisma,
          person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
          tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
        };

        return response;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponseBySingleUseId-${workflowId}-${singleUseId}`],
    {
      tags: [responseCache.tag.bySingleUseId(workflowId, singleUseId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return response
    ? {
        ...formatDateFields(response, ZResponse),
        notes: response.notes.map((note) => formatDateFields(note, ZResponseNote)),
      }
    : null;
};

export const createResponse = async (responseInput: TResponseInput): Promise<TResponse> => {
  validateInputs([responseInput, ZResponseInput]);
  captureTelemetry("response created");

  const { environmentId, userId, workflowId, finished, data, meta, singleUseId } = responseInput;

  try {
    let person: TPerson | null = null;

    if (userId) {
      person = await getPersonByUserId(environmentId, userId);
      if (!person) {
        // create person if it does not exist
        person = await createPerson(environmentId, userId);
      }
    }

    const responsePrisma = await prisma.response.create({
      data: {
        workflow: {
          connect: {
            id: workflowId,
          },
        },
        finished: finished,
        data: data,
        ...(person?.id && {
          person: {
            connect: {
              id: person.id,
            },
          },
          personAttributes: person?.attributes,
        }),
        ...(meta && ({ meta } as Prisma.JsonObject)),
        singleUseId,
      },
      select: responseSelection,
    });

    const response: TResponse = {
      ...responsePrisma,
      person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    responseCache.revalidate({
      id: response.id,
      personId: response.person?.id,
      workflowId: response.workflowId,
    });

    responseNoteCache.revalidate({
      responseId: response.id,
    });

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getResponse = async (responseId: string): Promise<TResponse | null> => {
  const response = await unstable_cache(
    async () => {
      validateInputs([responseId, ZId]);

      try {
        const responsePrisma = await prisma.response.findUnique({
          where: {
            id: responseId,
          },
          select: responseSelection,
        });

        if (!responsePrisma) {
          throw new ResourceNotFoundError("Response", responseId);
        }

        const response: TResponse = {
          ...responsePrisma,
          person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
          tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
        };

        return response;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponse-${responseId}`],
    {
      tags: [responseCache.tag.byId(responseId), responseNoteCache.tag.byResponseId(responseId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return {
    ...formatDateFields(response, ZResponse),
    notes: response.notes.map((note) => formatDateFields(note, ZResponseNote)),
  } as TResponse;
};

export const getResponses = async (workflowId: string, page?: number): Promise<TResponse[]> => {
  const responses = await unstable_cache(
    async () => {
      validateInputs([workflowId, ZId], [page, ZOptionalNumber]);

      try {
        const responses = await prisma.response.findMany({
          where: {
            workflowId,
          },
          select: responseSelection,
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });

        const transformedResponses: TResponse[] = await Promise.all(
          responses.map(async (responsePrisma) => {
            return {
              ...responsePrisma,
              person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
              tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
            };
          })
        );

        return transformedResponses;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponses-${workflowId}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return responses.map((response) => ({
    ...formatDateFields(response, ZResponse),
    notes: response.notes.map((note) => formatDateFields(note, ZResponseNote)),
  }));
};

export const getResponsesByEnvironmentId = async (
  environmentId: string,
  page?: number
): Promise<TResponse[]> => {
  const responses = await unstable_cache(
    async () => {
      validateInputs([environmentId, ZId], [page, ZOptionalNumber]);

      try {
        const responses = await prisma.response.findMany({
          where: {
            workflow: {
              environmentId,
            },
          },
          select: responseSelection,
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          take: page ? ITEMS_PER_PAGE : undefined,
          skip: page ? ITEMS_PER_PAGE * (page - 1) : undefined,
        });

        const transformedResponses: TResponse[] = await Promise.all(
          responses.map(async (responsePrisma) => {
            return {
              ...responsePrisma,
              person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
              tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
            };
          })
        );

        return transformedResponses;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponsesByEnvironmentId-${environmentId}`],
    {
      tags: [responseCache.tag.byEnvironmentId(environmentId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();

  return responses.map((response) => ({
    ...formatDateFields(response, ZResponse),
    notes: response.notes.map((note) => formatDateFields(note, ZResponseNote)),
  }));
};

export const updateResponse = async (
  responseId: string,
  responseInput: TResponseUpdateInput
): Promise<TResponse> => {
  validateInputs([responseId, ZId], [responseInput, ZResponseUpdateInput]);
  try {
    // const currentResponse = await getResponse(responseId);

    // use direct prisma call to avoid cache issues
    const currentResponse = await prisma.response.findUnique({
      where: {
        id: responseId,
      },
      select: responseSelection,
    });

    if (!currentResponse) {
      throw new ResourceNotFoundError("Response", responseId);
    }

    // merge data object
    const data = {
      ...currentResponse.data,
      ...responseInput.data,
    };
    const ttc = responseInput.ttc
      ? responseInput.finished
        ? calculateTtcTotal(responseInput.ttc)
        : responseInput.ttc
      : {};

    const responsePrisma = await prisma.response.update({
      where: {
        id: responseId,
      },
      data: {
        finished: responseInput.finished,
        data,
        ttc,
      },
      select: responseSelection,
    });

    const response: TResponse = {
      ...responsePrisma,
      person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    responseCache.revalidate({
      id: response.id,
      personId: response.person?.id,
      workflowId: response.workflowId,
    });

    responseNoteCache.revalidate({
      responseId: response.id,
    });

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const deleteResponse = async (responseId: string): Promise<TResponse> => {
  validateInputs([responseId, ZId]);
  try {
    const responsePrisma = await prisma.response.delete({
      where: {
        id: responseId,
      },
      select: responseSelection,
    });

    const responseNotes = await getResponseNotes(responsePrisma.id);
    const response: TResponse = {
      ...responsePrisma,
      notes: responseNotes,
      person: responsePrisma.person ? transformPrismaPerson(responsePrisma.person) : null,
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    deleteDisplayByResponseId(responseId, response.workflowId);

    responseCache.revalidate({
      id: response.id,
      personId: response.person?.id,
      workflowId: response.workflowId,
    });

    responseNoteCache.revalidate({
      responseId: response.id,
    });

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getResponseCountByWorkflowId = async (workflowId: string): Promise<number> =>
  unstable_cache(
    async () => {
      validateInputs([workflowId, ZId]);

      try {
        const responseCount = await prisma.response.count({
          where: {
            workflowId: workflowId,
          },
        });
        return responseCount;
      } catch (error) {
        throw error;
      }
    },
    [`getResponseCountByWorkflowId-${workflowId}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
      revalidate: SERVICES_REVALIDATION_INTERVAL,
    }
  )();
