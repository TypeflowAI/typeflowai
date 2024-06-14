import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { TAttributes } from "@typeflowai/types/attributes";
import { ZOptionalNumber, ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TPerson } from "@typeflowai/types/people";
import {
  TResponse,
  TResponseFilterCriteria,
  TResponseInput,
  TResponseLegacyInput,
  TResponseUpdateInput,
  ZResponseFilterCriteria,
  ZResponseInput,
  ZResponseLegacyInput,
  ZResponseUpdateInput,
} from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflowSummary } from "@typeflowai/types/workflows";

import { getAttributes } from "../attribute/service";
import { cache } from "../cache";
import { ITEMS_PER_PAGE, WEBAPP_URL } from "../constants";
import { displayCache } from "../display/cache";
import { deleteDisplayByResponseId, getDisplayCountByWorkflowId } from "../display/service";
import { createPerson, getPerson, getPersonByUserId } from "../person/service";
import { responseNoteCache } from "../responseNote/cache";
import { getResponseNotes } from "../responseNote/service";
import { putFile } from "../storage/service";
import { captureTelemetry } from "../telemetry";
import { convertToCsv, convertToXlsxBuffer } from "../utils/fileConversion";
import { validateInputs } from "../utils/validate";
import { getWorkflow } from "../workflow/service";
import { responseCache } from "./cache";
import {
  buildWhereClause,
  calculateTtcTotal,
  extractWorkflowDetails,
  getQuestionWiseSummary,
  getResponseHiddenFields,
  getResponseMeta,
  getResponsePersonAttributes,
  getResponsesFileName,
  getResponsesJson,
  getWorkflowSummaryDropOff,
  getWorkflowSummaryMeta,
} from "./utils";

const RESPONSES_PER_PAGE = 10;

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
  language: true,
  person: {
    select: {
      id: true,
      userId: true,
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

export const getResponsesByPersonId = (personId: string, page?: number): Promise<TResponse[] | null> =>
  cache(
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
          orderBy: {
            updatedAt: "asc",
          },
        });

        if (!responsePrisma) {
          throw new ResourceNotFoundError("Response from PersonId", personId);
        }

        let responses: TResponse[] = [];

        await Promise.all(
          responsePrisma.map(async (response) => {
            const responseNotes = await getResponseNotes(response.id);
            responses.push({
              ...response,
              notes: responseNotes,
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
    }
  )();

export const getResponseBySingleUseId = (
  workflowId: string,
  singleUseId: string
): Promise<TResponse | null> =>
  cache(
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
    }
  )();

export const createResponse = async (responseInput: TResponseInput): Promise<TResponse> => {
  validateInputs([responseInput, ZResponseInput]);
  captureTelemetry("response created");

  const {
    environmentId,
    language,
    userId,
    workflowId,
    finished,
    data,
    meta,
    singleUseId,
    ttc: initialTtc,
  } = responseInput;

  try {
    let person: TPerson | null = null;
    let attributes: TAttributes | null = null;

    if (userId) {
      person = await getPersonByUserId(environmentId, userId);
      if (!person) {
        // create person if it does not exist
        person = await createPerson(environmentId, userId);
      }
    }

    if (person?.id) {
      attributes = await getAttributes(person?.id as string);
    }

    const ttc = initialTtc ? (finished ? calculateTtcTotal(initialTtc) : initialTtc) : {};

    const prismaData: Prisma.ResponseCreateInput = {
      workflow: {
        connect: {
          id: workflowId,
        },
      },
      finished: finished,
      data: data,
      language: language,
      ...(person?.id && {
        person: {
          connect: {
            id: person.id,
          },
        },
        personAttributes: attributes,
      }),
      ...(meta && ({ meta } as Prisma.JsonObject)),
      singleUseId,
      ttc: ttc,
    };

    const responsePrisma = await prisma.response.create({
      data: prismaData,
      select: responseSelection,
    });

    const response: TResponse = {
      ...responsePrisma,
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    responseCache.revalidate({
      environmentId: environmentId,
      id: response.id,
      personId: response.person?.id,
      workflowId: response.workflowId,
      singleUseId: singleUseId ? singleUseId : undefined,
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

export const createResponseLegacy = async (responseInput: TResponseLegacyInput): Promise<TResponse> => {
  validateInputs([responseInput, ZResponseLegacyInput]);
  captureTelemetry("response created");

  try {
    let person: TPerson | null = null;
    let attributes: TAttributes | null = null;

    if (responseInput.personId) {
      person = await getPerson(responseInput.personId);
    }
    const ttcTemp = responseInput.ttc ?? {};
    const questionId = Object.keys(ttcTemp)[0];
    const ttc =
      responseInput.finished && responseInput.ttc
        ? {
            ...ttcTemp,
            _total: ttcTemp[questionId], // Add _total property with the same value
          }
        : ttcTemp;

    if (person?.id) {
      attributes = await getAttributes(person?.id as string);
    }

    const responsePrisma = await prisma.response.create({
      data: {
        workflow: {
          connect: {
            id: responseInput.workflowId,
          },
        },
        finished: responseInput.finished,
        data: responseInput.data,
        ttc,
        ...(responseInput.personId && {
          person: {
            connect: {
              id: responseInput.personId,
            },
          },
          personAttributes: attributes,
        }),

        ...(responseInput.meta && ({ meta: responseInput?.meta } as Prisma.JsonObject)),
        singleUseId: responseInput.singleUseId,
        language: responseInput.language,
      },
      select: responseSelection,
    });

    const response: TResponse = {
      ...responsePrisma,
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

export const getResponse = (responseId: string): Promise<TResponse | null> =>
  cache(
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
          return null;
        }

        const response: TResponse = {
          ...responsePrisma,
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
    }
  )();

export const getResponseFilteringValues = async (workflowId: string) =>
  cache(
    async () => {
      validateInputs([workflowId, ZId]);

      try {
        const workflow = await getWorkflow(workflowId);
        if (!workflow) {
          throw new ResourceNotFoundError("Workflow", workflowId);
        }

        const responses = await prisma.response.findMany({
          where: {
            workflowId,
          },
          select: {
            data: true,
            meta: true,
            personAttributes: true,
          },
        });

        const personAttributes = getResponsePersonAttributes(responses);
        const meta = getResponseMeta(responses);
        const hiddenFields = getResponseHiddenFields(workflow, responses);

        return { personAttributes, meta, hiddenFields };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponseFilteringValues-${workflowId}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
    }
  )();

export const getResponses = (
  workflowId: string,
  limit?: number,
  offset?: number,
  filterCriteria?: TResponseFilterCriteria
): Promise<TResponse[]> =>
  cache(
    async () => {
      validateInputs(
        [workflowId, ZId],
        [limit, ZOptionalNumber],
        [offset, ZOptionalNumber],
        [filterCriteria, ZResponseFilterCriteria.optional()]
      );

      limit = limit ?? RESPONSES_PER_PAGE;
      try {
        const responses = await prisma.response.findMany({
          where: {
            workflowId,
            ...buildWhereClause(filterCriteria),
          },
          select: responseSelection,
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          take: limit ? limit : undefined,
          skip: offset ? offset : undefined,
        });

        const transformedResponses: TResponse[] = await Promise.all(
          responses.map((responsePrisma) => {
            return {
              ...responsePrisma,
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
    [`getResponses-${workflowId}-${limit}-${offset}-${JSON.stringify(filterCriteria)}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
    }
  )();

export const getWorkflowSummary = (
  workflowId: string,
  filterCriteria?: TResponseFilterCriteria
): Promise<TWorkflowSummary> =>
  cache(
    async () => {
      validateInputs([workflowId, ZId], [filterCriteria, ZResponseFilterCriteria.optional()]);

      try {
        const workflow = await getWorkflow(workflowId);
        if (!workflow) {
          throw new ResourceNotFoundError("Workflow", workflowId);
        }

        const batchSize = 3000;
        const responseCount = await getResponseCountByWorkflowId(workflowId, filterCriteria);
        const pages = Math.ceil(responseCount / batchSize);

        const responsesArray = await Promise.all(
          Array.from({ length: pages }, (_, i) => {
            return getResponses(workflowId, batchSize, i * batchSize, filterCriteria);
          })
        );
        const responses = responsesArray.flat();

        const displayCount = await getDisplayCountByWorkflowId(workflowId, {
          createdAt: filterCriteria?.createdAt,
        });

        const dropOff = getWorkflowSummaryDropOff(workflow, responses, displayCount);
        const meta = getWorkflowSummaryMeta(responses, displayCount);
        const questionWiseSummary = getQuestionWiseSummary(workflow, responses, dropOff);

        return { meta, dropOff, summary: questionWiseSummary };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getWorkflowSummary-${workflowId}-${JSON.stringify(filterCriteria)}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId), displayCache.tag.byWorkflowId(workflowId)],
    }
  )();

export const getResponseDownloadUrl = async (
  workflowId: string,
  format: "csv" | "xlsx",
  filterCriteria?: TResponseFilterCriteria
): Promise<string> => {
  validateInputs([workflowId, ZId], [format, ZString], [filterCriteria, ZResponseFilterCriteria.optional()]);
  try {
    const workflow = await getWorkflow(workflowId);

    if (!workflow) {
      throw new ResourceNotFoundError("Workflow", workflowId);
    }

    const environmentId = workflow.environmentId as string;

    const accessType = "private";
    const batchSize = 3000;
    const responseCount = await getResponseCountByWorkflowId(workflowId, filterCriteria);
    const pages = Math.ceil(responseCount / batchSize);

    const responsesArray = await Promise.all(
      Array.from({ length: pages }, (_, i) => {
        return getResponses(workflowId, batchSize, i * batchSize, filterCriteria);
      })
    );
    const responses = responsesArray.flat();

    const { metaDataFields, questions, hiddenFields, userAttributes } = extractWorkflowDetails(
      workflow,
      responses
    );

    const headers = [
      "No.",
      "Response ID",
      "Timestamp",
      "Finished",
      "Workflow ID",
      "User ID",
      "Notes",
      "Tags",
      ...metaDataFields,
      ...questions,
      ...hiddenFields,
      ...userAttributes,
    ];

    const jsonData = getResponsesJson(workflow, responses, questions, userAttributes, hiddenFields);

    const fileName = getResponsesFileName(workflow?.name || "", format);
    let fileBuffer: Buffer;

    if (format === "xlsx") {
      fileBuffer = convertToXlsxBuffer(headers, jsonData);
    } else {
      const csvFile = await convertToCsv(headers, jsonData);
      fileBuffer = Buffer.from(csvFile);
    }

    await putFile(fileName, fileBuffer, accessType, environmentId);

    return `${WEBAPP_URL}/storage/${environmentId}/${accessType}/${fileName}`;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getResponsesByEnvironmentId = (
  environmentId: string,
  limit?: number,
  offset?: number
): Promise<TResponse[]> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId], [limit, ZOptionalNumber], [offset, ZOptionalNumber]);

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
          take: limit ? limit : undefined,
          skip: offset ? offset : undefined,
        });

        const transformedResponses: TResponse[] = await Promise.all(
          responses.map(async (responsePrisma) => {
            return {
              ...responsePrisma,
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
    [`getResponsesByEnvironmentId-${environmentId}-${limit}-${offset}`],
    {
      tags: [responseCache.tag.byEnvironmentId(environmentId)],
    }
  )();

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
    const language = responseInput.language;

    const responsePrisma = await prisma.response.update({
      where: {
        id: responseId,
      },
      data: {
        finished: responseInput.finished,
        data,
        ttc,
        language,
      },
      select: responseSelection,
    });

    const response: TResponse = {
      ...responsePrisma,
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
      tags: responsePrisma.tags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
    };

    deleteDisplayByResponseId(responseId, response.workflowId);

    const workflow = await getWorkflow(response.workflowId);

    responseCache.revalidate({
      environmentId: workflow?.environmentId,
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

export const getResponseCountByWorkflowId = (
  workflowId: string,
  filterCriteria?: TResponseFilterCriteria
): Promise<number> =>
  cache(
    async () => {
      validateInputs([workflowId, ZId], [filterCriteria, ZResponseFilterCriteria.optional()]);

      try {
        const responseCount = await prisma.response.count({
          where: {
            workflowId: workflowId,
            ...buildWhereClause(filterCriteria),
          },
        });
        return responseCount;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponseCountByWorkflowId-${workflowId}-${JSON.stringify(filterCriteria)}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
    }
  )();
