import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError } from "@typeflowai/types/errors";
import { TTagsCount, TTagsOnResponses } from "@typeflowai/types/tags";

import { cache } from "../cache";
import { responseCache } from "../response/cache";
import { getResponse } from "../response/service";
import { validateInputs } from "../utils/validate";
import { tagOnResponseCache } from "./cache";

const selectTagsOnResponse = {
  tag: {
    select: {
      environmentId: true,
    },
  },
};

export const addTagToRespone = async (responseId: string, tagId: string): Promise<TTagsOnResponses> => {
  try {
    const response = await getResponse(responseId);
    const tagOnResponse = await prisma.tagsOnResponses.create({
      data: {
        responseId,
        tagId,
      },
      select: selectTagsOnResponse,
    });

    responseCache.revalidate({
      id: responseId,
      workflowId: response?.workflowId,
      personId: response?.person?.id,
    });

    tagOnResponseCache.revalidate({
      tagId,
      responseId,
      environmentId: tagOnResponse.tag.environmentId,
    });

    return {
      responseId,
      tagId,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const deleteTagOnResponse = async (responseId: string, tagId: string): Promise<TTagsOnResponses> => {
  try {
    const response = await getResponse(responseId);
    const deletedTag = await prisma.tagsOnResponses.delete({
      where: {
        responseId_tagId: {
          responseId,
          tagId,
        },
      },
      select: selectTagsOnResponse,
    });

    responseCache.revalidate({
      id: responseId,
      workflowId: response?.workflowId,
      personId: response?.person?.id,
    });

    tagOnResponseCache.revalidate({
      tagId,
      responseId,
      environmentId: deletedTag.tag.environmentId,
    });

    return {
      tagId,
      responseId,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const getTagsOnResponsesCount = async (environmentId: string): Promise<TTagsCount> =>
  cache(
    async () => {
      validateInputs([environmentId, ZId]);

      try {
        const tagsCount = await prisma.tagsOnResponses.groupBy({
          by: ["tagId"],
          where: {
            response: {
              workflow: {
                environment: {
                  id: environmentId,
                },
              },
            },
          },
          _count: {
            _all: true,
          },
        });

        return tagsCount.map((tagCount) => ({ tagId: tagCount.tagId, count: tagCount._count._all }));
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }
        throw error;
      }
    },
    [`getTagsOnResponsesCount-${environmentId}`],
    {
      tags: [tagOnResponseCache.tag.byEnvironmentId(environmentId)],
    }
  )();
