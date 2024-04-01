import {
  getMockUpdateResponseInput,
  mockDisplay,
  mockEnvironmentId,
  mockMeta,
  mockPerson,
  mockResponse,
  mockResponseData,
  mockResponseNote,
  mockResponseWithMockPerson,
  mockSingleUseId,
  mockTags,
  mockUserId,
  mockWorkflowId,
} from "./__mocks__/data.mock";

import { Prisma } from "@prisma/client";

import { prismaMock } from "@typeflowai/database/src/jestClient";
import { DatabaseError, ResourceNotFoundError, ValidationError } from "@typeflowai/types/errors";
import { TResponse, TResponseInput } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";

import { selectPerson, transformPrismaPerson } from "../../person/service";
import {
  createResponse,
  deleteResponse,
  getResponse,
  getResponseBySingleUseId,
  getResponseCountByWorkflowId,
  getResponses,
  getResponsesByEnvironmentId,
  getResponsesByPersonId,
  updateResponse,
} from "../service";
import { constantsForTests } from "./constants";

const expectedResponseWithoutPerson: TResponse = {
  ...mockResponse,
  person: null,
  tags: mockTags.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
};

const expectedResponseWithPerson: TResponse = {
  ...mockResponse,
  person: transformPrismaPerson(mockPerson),
  tags: mockTags?.map((tagPrisma: { tag: TTag }) => tagPrisma.tag),
};

const mockResponseInputWithoutUserId: TResponseInput = {
  environmentId: mockEnvironmentId,
  workflowId: mockWorkflowId,
  singleUseId: mockSingleUseId,
  finished: constantsForTests.boolean,
  data: {},
  meta: mockMeta,
};

const mockResponseInputWithUserId: TResponseInput = {
  ...mockResponseInputWithoutUserId,
  userId: mockUserId,
};

beforeEach(() => {
  // @ts-expect-error
  prismaMock.response.create.mockImplementation(async (args) => {
    if (args.data.person && args.data.person.connect) {
      return {
        ...mockResponse,
        person: mockPerson,
      };
    }

    return mockResponse;
  });

  // mocking the person findFirst call as it is used in the transformPrismaPerson function
  prismaMock.person.findFirst.mockResolvedValue(mockPerson);
  prismaMock.responseNote.findMany.mockResolvedValue([mockResponseNote]);

  prismaMock.response.findUnique.mockResolvedValue(mockResponse);

  // @ts-expect-error
  prismaMock.response.update.mockImplementation(async (args) => {
    if (args.data.finished === true) {
      return {
        ...mockResponse,
        finished: true,
        data: mockResponseData,
      };
    }

    return {
      ...mockResponse,
      finished: false,
      data: mockResponseData,
    };
  });

  prismaMock.response.findMany.mockResolvedValue([mockResponse]);
  prismaMock.response.delete.mockResolvedValue(mockResponse);

  prismaMock.display.delete.mockResolvedValue({ ...mockDisplay, status: "seen" });

  prismaMock.response.count.mockResolvedValue(1);
});

// utility function to test input validation for all services
const testInputValidation = async (service: Function, ...args: any[]): Promise<void> => {
  it("it should throw a ValidationError if the inputs are invalid", async () => {
    await expect(service(...args)).rejects.toThrow(ValidationError);
  });
};

describe("Tests for getResponsesByPersonId", () => {
  describe("Happy Path", () => {
    it("Returns all responses associated with a given person ID", async () => {
      prismaMock.response.findMany.mockResolvedValue([mockResponseWithMockPerson]);

      const responses = await getResponsesByPersonId(mockPerson.id);
      expect(responses).toEqual([expectedResponseWithPerson]);
    });

    it("Returns an empty array when no responses are found for the given person ID", async () => {
      prismaMock.response.findMany.mockResolvedValue([]);

      const responses = await getResponsesByPersonId(mockPerson.id);
      expect(responses).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponsesByPersonId, "123", 1);

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.findMany.mockRejectedValue(errToThrow);

      await expect(getResponsesByPersonId(mockPerson.id)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.findMany.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponsesByPersonId(mockPerson.id)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getResponsesBySingleUseId", () => {
  describe("Happy Path", () => {
    it("Retrieves responses linked to a specific single-use ID", async () => {
      const responses = await getResponseBySingleUseId(mockWorkflowId, mockSingleUseId);
      expect(responses).toEqual(expectedResponseWithoutPerson);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponseBySingleUseId, "123", "123");

    it("Throws DatabaseError on PrismaClientKnownRequestError occurrence", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.findUnique.mockRejectedValue(errToThrow);

      await expect(getResponseBySingleUseId(mockWorkflowId, mockSingleUseId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for other exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.findUnique.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponseBySingleUseId(mockWorkflowId, mockSingleUseId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for createResponse service", () => {
  describe("Happy Path", () => {
    it("Creates a response linked to an existing user", async () => {
      const response = await createResponse(mockResponseInputWithUserId);
      expect(response).toEqual(expectedResponseWithPerson);
    });

    it("Creates a response without an associated user ID", async () => {
      const response = await createResponse(mockResponseInputWithoutUserId);
      expect(response).toEqual(expectedResponseWithoutPerson);
    });

    it("Creates a new person and response when the person does not exist", async () => {
      prismaMock.person.findFirst.mockResolvedValue(null);
      prismaMock.person.create.mockResolvedValue(mockPerson);
      const response = await createResponse(mockResponseInputWithUserId);

      expect(response).toEqual(expectedResponseWithPerson);

      expect(prismaMock.person.create).toHaveBeenCalledWith({
        data: {
          environment: { connect: { id: mockEnvironmentId } },
          userId: mockUserId,
        },
        select: selectPerson,
      });
    });
  });

  describe("Sad Path", () => {
    testInputValidation(createResponse, {
      ...mockResponseInputWithUserId,
      data: [],
    });

    it("Throws DatabaseError on PrismaClientKnownRequestError occurrence", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.create.mockRejectedValue(errToThrow);

      await expect(createResponse(mockResponseInputWithUserId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for other exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.create.mockRejectedValue(new Error(mockErrorMessage));

      await expect(createResponse(mockResponseInputWithUserId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getResponse service", () => {
  describe("Happy Path", () => {
    it("Retrieves a specific response by its ID", async () => {
      const response = await getResponse(mockResponse.id);
      expect(response).toEqual(expectedResponseWithoutPerson);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponse, "123");

    it("Throws ResourceNotFoundError if no response is found", async () => {
      prismaMock.response.findUnique.mockResolvedValue(null);
      await expect(getResponse(mockResponse.id)).rejects.toThrow(ResourceNotFoundError);
    });

    it("Throws DatabaseError on PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.findUnique.mockRejectedValue(errToThrow);

      await expect(getResponse(mockResponse.id)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for other unexpected issues", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.findUnique.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponse(mockResponse.id)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getResponses service", () => {
  describe("Happy Path", () => {
    it("Fetches all responses for a given workflow ID", async () => {
      const response = await getResponses(mockWorkflowId);
      expect(response).toEqual([expectedResponseWithoutPerson]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponses, mockWorkflowId, "1");

    it("Throws DatabaseError on PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.findMany.mockRejectedValue(errToThrow);

      await expect(getResponses(mockWorkflowId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected problems", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.findMany.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponses(mockWorkflowId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getResponsesByEnvironmentId", () => {
  describe("Happy Path", () => {
    it("Obtains all responses associated with a specific environment ID", async () => {
      const responses = await getResponsesByEnvironmentId(mockEnvironmentId);
      expect(responses).toEqual([expectedResponseWithoutPerson]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponsesByEnvironmentId, "123");

    it("Throws DatabaseError on PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.findMany.mockRejectedValue(errToThrow);

      await expect(getResponsesByEnvironmentId(mockEnvironmentId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for any other unhandled exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.findMany.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponsesByEnvironmentId(mockEnvironmentId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for updateResponse Service", () => {
  describe("Happy Path", () => {
    it("Updates a response (finished = true)", async () => {
      const response = await updateResponse(mockResponse.id, getMockUpdateResponseInput(true));
      expect(response).toEqual({
        ...expectedResponseWithoutPerson,
        data: mockResponseData,
      });
    });

    it("Updates a response (finished = false)", async () => {
      const response = await updateResponse(mockResponse.id, getMockUpdateResponseInput(false));
      expect(response).toEqual({
        ...expectedResponseWithoutPerson,
        finished: false,
        data: mockResponseData,
      });
    });
  });

  describe("Sad Path", () => {
    testInputValidation(updateResponse, "123", {});

    it("Throws ResourceNotFoundError if no response is found", async () => {
      prismaMock.response.findUnique.mockResolvedValue(null);
      await expect(updateResponse(mockResponse.id, getMockUpdateResponseInput())).rejects.toThrow(
        ResourceNotFoundError
      );
    });

    it("Throws DatabaseError on PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.update.mockRejectedValue(errToThrow);

      await expect(updateResponse(mockResponse.id, getMockUpdateResponseInput())).rejects.toThrow(
        DatabaseError
      );
    });

    it("Throws a generic Error for other unexpected issues", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.update.mockRejectedValue(new Error(mockErrorMessage));

      await expect(updateResponse(mockResponse.id, getMockUpdateResponseInput())).rejects.toThrow(Error);
    });
  });
});

describe("Tests for deleteResponse service", () => {
  describe("Happy Path", () => {
    it("Successfully deletes a response based on its ID", async () => {
      const response = await deleteResponse(mockResponse.id);
      expect(response).toEqual(expectedResponseWithoutPerson);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(deleteResponse, "123");

    it("Throws DatabaseError on PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prismaMock.response.delete.mockRejectedValue(errToThrow);

      await expect(deleteResponse(mockResponse.id)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for any unhandled exception during deletion", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.delete.mockRejectedValue(new Error(mockErrorMessage));

      await expect(deleteResponse(mockResponse.id)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getResponseCountByWorkflowId service", () => {
  describe("Happy Path", () => {
    it("Counts the total number of responses for a given workflow ID", async () => {
      const count = await getResponseCountByWorkflowId(mockWorkflowId);
      expect(count).toEqual(1);
    });

    it("Returns zero count when there are no responses for a given workflow ID", async () => {
      prismaMock.response.count.mockResolvedValue(0);
      const count = await getResponseCountByWorkflowId(mockWorkflowId);
      expect(count).toEqual(0);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getResponseCountByWorkflowId, "123");

    it("Throws a generic Error for other unexpected issues", async () => {
      const mockErrorMessage = "Mock error message";
      prismaMock.response.count.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getResponseCountByWorkflowId(mockWorkflowId)).rejects.toThrow(Error);
    });
  });
});
