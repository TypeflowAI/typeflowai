import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { ZString } from "@typeflowai/types/common";
import { ZId } from "@typeflowai/types/environment";
import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";
import { TResponseNote } from "@typeflowai/types/responses";

import { cache } from "../cache";
import { responseCache } from "../response/cache";
import { validateInputs } from "../utils/validate";
import { responseNoteCache } from "./cache";

export const responseNoteSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  text: true,
  isEdited: true,
  isResolved: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  response: {
    select: {
      id: true,
      workflowId: true,
    },
  },
};

export const createResponseNote = async (
  responseId: string,
  userId: string,
  text: string
): Promise<TResponseNote> => {
  validateInputs([responseId, ZId], [userId, ZId], [text, ZString]);

  try {
    const responseNote = await prisma.responseNote.create({
      data: {
        responseId: responseId,
        userId: userId,
        text: text,
      },
      select: responseNoteSelect,
    });

    responseCache.revalidate({
      id: responseNote.response.id,
      workflowId: responseNote.response.workflowId,
    });

    responseNoteCache.revalidate({
      id: responseNote.id,
      responseId: responseNote.response.id,
    });
    return responseNote;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const getResponseNote = (responseNoteId: string): Promise<TResponseNote | null> =>
  cache(
    async () => {
      try {
        const responseNote = await prisma.responseNote.findUnique({
          where: {
            id: responseNoteId,
          },
          select: responseNoteSelect,
        });
        return responseNote;
      } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponseNote-${responseNoteId}`],
    {
      tags: [responseNoteCache.tag.byId(responseNoteId)],
    }
  )();

export const getResponseNotes = (responseId: string): Promise<TResponseNote[]> =>
  cache(
    async () => {
      try {
        validateInputs([responseId, ZId]);

        const responseNotes = await prisma.responseNote.findMany({
          where: {
            responseId,
          },
          select: responseNoteSelect,
        });
        if (!responseNotes) {
          throw new ResourceNotFoundError("Response Notes by ResponseId", responseId);
        }
        return responseNotes;
      } catch (error) {
        console.error(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new DatabaseError(error.message);
        }

        throw error;
      }
    },
    [`getResponseNotes-${responseId}`],
    {
      tags: [responseNoteCache.tag.byResponseId(responseId)],
    }
  )();

export const updateResponseNote = async (responseNoteId: string, text: string): Promise<TResponseNote> => {
  validateInputs([responseNoteId, ZString], [text, ZString]);

  try {
    const updatedResponseNote = await prisma.responseNote.update({
      where: {
        id: responseNoteId,
      },
      data: {
        text: text,
        updatedAt: new Date(),
        isEdited: true,
      },
      select: responseNoteSelect,
    });

    responseCache.revalidate({
      id: updatedResponseNote.response.id,
      workflowId: updatedResponseNote.response.workflowId,
    });

    responseNoteCache.revalidate({
      id: updatedResponseNote.id,
      responseId: updatedResponseNote.response.id,
    });

    return updatedResponseNote;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};

export const resolveResponseNote = async (responseNoteId: string): Promise<TResponseNote> => {
  validateInputs([responseNoteId, ZString]);

  try {
    const responseNote = await prisma.responseNote.update({
      where: {
        id: responseNoteId,
      },
      data: {
        updatedAt: new Date(),
        isResolved: true,
      },
      select: responseNoteSelect,
    });

    responseCache.revalidate({
      id: responseNote.response.id,
      workflowId: responseNote.response.workflowId,
    });

    responseNoteCache.revalidate({
      id: responseNote.id,
      responseId: responseNote.response.id,
    });

    return responseNote;
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
