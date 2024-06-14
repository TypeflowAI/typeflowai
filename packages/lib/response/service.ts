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
  TResponseUpdateInput,
  TWorkflowMetaFieldFilter,
  TWorkflowPersonAttributes,
  ZResponseFilterCriteria,
  ZResponseInput,
  ZResponseUpdateInput,
} from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflowSummary } from "@typeflowai/types/workflows";

import { getAttributes } from "../attribute/service";
import { getAttributeClasses } from "../attributeClass/service";
import { cache } from "../cache";
import { ITEMS_PER_PAGE, WEBAPP_URL } from "../constants";
import { displayCache } from "../display/cache";
import { deleteDisplayByResponseId, getDisplayCountByWorkflowId } from "../display/service";
import { createPerson, getPersonByUserId } from "../person/service";
import { responseNoteCache } from "../responseNote/cache";
import { getResponseNotes } from "../responseNote/service";
import { putFile } from "../storage/service";
import { captureTelemetry } from "../telemetry";
import { convertToCsv, convertToXlsxBuffer } from "../utils/fileConversion";
import { replaceHeadlineRecall } from "../utils/recall";
import { validateInputs } from "../utils/validate";
import { getWorkflow } from "../workflow/service";
import { responseCache } from "./cache";
import {
  buildWhereClause,
  calculateTtcTotal,
  extractWorkflowDetails,
  getQuestionWiseSummary,
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

export const getResponsesByPersonId = (personId: string, page?: number): Promise<Array<TResponse> | null> =>
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

        let responses: Array<TResponse> = [];

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

    const responsePrisma = await prisma.response.create({
      data: {
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
      },
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

export const getResponsePersonAttributes = (workflowId: string): Promise<TWorkflowPersonAttributes> =>
  cache(
    async () => {
      validateInputs([workflowId, ZId]);

      try {
        let attributes: TWorkflowPersonAttributes = {};
        const responseAttributes = await prisma.response.findMany({
          where: {
            workflowId: workflowId,
          },
          select: {
            personAttributes: true,
          },
        });

        responseAttributes.forEach((response) => {
          Object.keys(response.personAttributes ?? {}).forEach((key) => {
            if (response.personAttributes && attributes[key]) {
              attributes[key].push(response.personAttributes[key].toString());
            } else if (response.personAttributes) {
              attributes[key] = [response.personAttributes[key].toString()];
            }
          });
        });

        Object.keys(attributes).forEach((key) => {
          attributes[key] = Array.from(new Set(attributes[key]));
        });

        return attributes;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponsePersonAttributes-${workflowId}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
    }
  )();

export const getResponseMeta = (workflowId: string): Promise<TWorkflowMetaFieldFilter> =>
  cache(
    async () => {
      validateInputs([workflowId, ZId]);

      try {
        const responseMeta = await prisma.response.findMany({
          where: {
            workflowId: workflowId,
          },
          select: {
            meta: true,
          },
        });

        const meta: { [key: string]: Set<string> } = {};

        responseMeta.forEach((response) => {
          Object.entries(response.meta).forEach(([key, value]) => {
            // skip url
            if (key === "url") return;

            // Handling nested objects (like userAgent)
            if (typeof value === "object" && value !== null) {
              Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                if (typeof nestedValue === "string" && nestedValue) {
                  if (!meta[nestedKey]) {
                    meta[nestedKey] = new Set();
                  }
                  meta[nestedKey].add(nestedValue);
                }
              });
            } else if (typeof value === "string" && value) {
              if (!meta[key]) {
                meta[key] = new Set();
              }
              meta[key].add(value);
            }
          });
        });

        // Convert Set to Array
        const result = Object.fromEntries(
          Object.entries(meta).map(([key, valueSet]) => [key, Array.from(valueSet)])
        );

        return result;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getResponseMeta-${workflowId}`],
    {
      tags: [responseCache.tag.byWorkflowId(workflowId)],
    }
  )();

export const getResponses = (
  workflowId: string,
  page?: number,
  batchSize?: number,
  filterCriteria?: TResponseFilterCriteria
): Promise<TResponse[]> =>
  cache(
    async () => {
      validateInputs(
        [workflowId, ZId],
        [page, ZOptionalNumber],
        [batchSize, ZOptionalNumber],
        [filterCriteria, ZResponseFilterCriteria.optional()]
      );
      batchSize = batchSize ?? RESPONSES_PER_PAGE;
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
          take: page ? batchSize : undefined,
          skip: page ? batchSize * (page - 1) : undefined,
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
    [`getResponses-${workflowId}-${page}-${batchSize}-${JSON.stringify(filterCriteria)}`],
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

        const attributeClasses = await getAttributeClasses(workflow.environmentId);

        const batchSize = 3000;
        const responseCount = await getResponseCountByWorkflowId(workflowId, filterCriteria);
        const pages = Math.ceil(responseCount / batchSize);

        const responsesArray = await Promise.all(
          Array.from({ length: pages }, (_, i) => {
            return getResponses(workflowId, i + 1, batchSize, filterCriteria);
          })
        );
        const responses = responsesArray.flat();

        const displayCount = await getDisplayCountByWorkflowId(workflowId, {
          createdAt: filterCriteria?.createdAt,
        });

        const dropOff = getWorkflowSummaryDropOff(workflow, responses, displayCount);
        const meta = getWorkflowSummaryMeta(responses, displayCount);
        const questionWiseSummary = getQuestionWiseSummary(
          replaceHeadlineRecall(workflow, "default", attributeClasses),
          responses,
          dropOff
        );

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
        return getResponses(workflowId, i + 1, batchSize, filterCriteria);
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

export const getResponsesByEnvironmentId = (environmentId: string, page?: number): Promise<TResponse[]> =>
  cache(
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
    [`getResponsesByEnvironmentId-${environmentId}-${page}`],
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
