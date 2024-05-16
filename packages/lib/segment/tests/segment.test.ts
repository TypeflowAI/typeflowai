import { prisma } from "../../__mocks__/database";
import {
  getMockSegmentFilters,
  mockEnvironmentId,
  mockEvaluateSegmentUserData,
  mockSegment,
  mockSegmentCreateInput,
  mockSegmentId,
  mockSegmentPrisma,
  mockSegmentUpdateInput,
  mockWorkflowId,
} from "./__mocks__/segment.mock";

import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { testInputValidation } from "vitestSetup";

import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";

import {
  cloneSegment,
  createSegment,
  deleteSegment,
  evaluateSegment,
  getSegment,
  getSegments,
  updateSegment,
} from "../service";

function addOrSubractDays(date: Date, number: number) {
  return new Date(new Date().setDate(date.getDate() - number));
}

beforeEach(() => {
  prisma.segment.findUnique.mockResolvedValue(mockSegmentPrisma);
  prisma.segment.findMany.mockResolvedValue([mockSegmentPrisma]);
  prisma.segment.update.mockResolvedValue({
    ...mockSegmentPrisma,
    filters: getMockSegmentFilters("lastMonthCount", 5, "greaterEqual"),
  });
});

describe("Tests for evaluateSegment service", () => {
  describe("Happy Path", () => {
    it("Returns true when the user meets the segment criteria", async () => {
      prisma.action.count.mockResolvedValue(4);
      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("lastQuarterCount", 5, "lessThan")
      );
      expect(result).toBe(true);
    });

    it("Calculates the action count for the last month", async () => {
      prisma.action.count.mockResolvedValue(0);
      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("lastMonthCount", 5, "lessThan")
      );
      expect(result).toBe(true);
    });

    it("Calculates the action count for the last week", async () => {
      prisma.action.count.mockResolvedValue(6);
      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("lastWeekCount", 5, "greaterEqual")
      );
      expect(result).toBe(true);
    });

    it("Calculates the total occurences of action", async () => {
      prisma.action.count.mockResolvedValue(6);
      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("occuranceCount", 5, "greaterEqual")
      );
      expect(result).toBe(true);
    });

    it("Calculates the last occurence days ago of action", async () => {
      prisma.action.findFirst.mockResolvedValue({ createdAt: addOrSubractDays(new Date(), 5) } as any);

      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("lastOccurranceDaysAgo", 0, "greaterEqual")
      );
      expect(result).toBe(true);
    });

    it("Calculates the first occurence days ago of action", async () => {
      prisma.action.findFirst.mockResolvedValue({ createdAt: addOrSubractDays(new Date(), 5) } as any);

      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("firstOccurranceDaysAgo", 6, "lessThan")
      );
      expect(result).toBe(true);
    });
  });

  describe("Sad Path", () => {
    it("Returns false when the user does not meet the segment criteria", async () => {
      prisma.action.count.mockResolvedValue(0);
      const result = await evaluateSegment(
        mockEvaluateSegmentUserData,
        getMockSegmentFilters("lastQuarterCount", 5, "greaterThan")
      );
      expect(result).toBe(false);
    });
  });
});

describe("Tests for createSegment service", () => {
  describe("Happy Path", () => {
    it("Creates a new user segment", async () => {
      prisma.segment.create.mockResolvedValue(mockSegmentPrisma);
      const result = await createSegment(mockSegmentCreateInput);
      expect(result).toEqual(mockSegment);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(createSegment, { ...mockSegmentCreateInput, title: undefined });

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.create.mockRejectedValue(errToThrow);

      await expect(createSegment(mockSegmentCreateInput)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.create.mockRejectedValue(new Error(mockErrorMessage));

      await expect(createSegment(mockSegmentCreateInput)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getSegments service", () => {
  describe("Happy Path", () => {
    it("Returns all user segments", async () => {
      const result = await getSegments(mockEnvironmentId);
      expect(result).toEqual([mockSegment]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getSegments, "123#");

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.findMany.mockRejectedValue(errToThrow);

      await expect(getSegments(mockEnvironmentId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.findMany.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getSegments(mockEnvironmentId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getSegment service", () => {
  describe("Happy Path", () => {
    it("Returns a user segment", async () => {
      const result = await getSegment(mockSegmentId);
      expect(result).toEqual(mockSegment);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getSegment, "123#");

    it("Throws a ResourceNotFoundError error if the user segment does not exist", async () => {
      prisma.segment.findUnique.mockResolvedValue(null);
      await expect(getSegment(mockSegmentId)).rejects.toThrow(ResourceNotFoundError);
    });

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.findUnique.mockRejectedValue(errToThrow);

      await expect(getSegment(mockSegmentId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.findUnique.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getSegment(mockSegmentId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for updateSegment service", () => {
  describe("Happy Path", () => {
    it("Updates a user segment", async () => {
      const result = await updateSegment(mockSegmentId, mockSegmentUpdateInput);
      expect(result).toEqual({
        ...mockSegment,
        filters: getMockSegmentFilters("lastMonthCount", 5, "greaterEqual"),
      });
    });
  });

  describe("Sad Path", () => {
    testInputValidation(updateSegment, "123#", {});

    it("Throws a ResourceNotFoundError error if the user segment does not exist", async () => {
      prisma.segment.findUnique.mockResolvedValue(null);
      await expect(updateSegment(mockSegmentId, mockSegmentCreateInput)).rejects.toThrow(
        ResourceNotFoundError
      );
    });

    it("Throws a DatabaseError error if there is a PrismaClientKnownReuestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.update.mockRejectedValue(errToThrow);

      await expect(updateSegment(mockSegmentId, mockSegmentCreateInput)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.update.mockRejectedValue(new Error(mockErrorMessage));

      await expect(updateSegment(mockSegmentId, mockSegmentCreateInput)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for deleteSegment service", () => {
  describe("Happy Path", () => {
    it("Deletes a user segment", async () => {
      prisma.segment.delete.mockResolvedValue(mockSegmentPrisma);
      const result = await deleteSegment(mockSegmentId);
      expect(result).toEqual(mockSegment);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(deleteSegment, "123#");

    it("Throws a ResourceNotFoundError error if the user segment does not exist", async () => {
      prisma.segment.findUnique.mockResolvedValue(null);
      await expect(deleteSegment(mockSegmentId)).rejects.toThrow(ResourceNotFoundError);
    });

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.delete.mockRejectedValue(errToThrow);

      await expect(deleteSegment(mockSegmentId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.delete.mockRejectedValue(new Error(mockErrorMessage));

      await expect(deleteSegment(mockSegmentId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for cloneSegment service", () => {
  describe("Happy Path", () => {
    it("Clones a user segment", async () => {
      prisma.segment.create.mockResolvedValue({
        ...mockSegmentPrisma,
        title: `Copy of ${mockSegmentPrisma.title}`,
      });
      const result = await cloneSegment(mockSegmentId, mockWorkflowId);
      expect(result).toEqual({
        ...mockSegment,
        title: `Copy of ${mockSegment.title}`,
      });
    });
  });

  describe("Sad Path", () => {
    testInputValidation(cloneSegment, "123#", "123#");

    it("Throws a ResourceNotFoundError error if the user segment does not exist", async () => {
      prisma.segment.findUnique.mockResolvedValue(null);
      await expect(cloneSegment(mockSegmentId, mockWorkflowId)).rejects.toThrow(ResourceNotFoundError);
    });

    it("Throws a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.segment.create.mockRejectedValue(errToThrow);

      await expect(cloneSegment(mockSegmentId, mockWorkflowId)).rejects.toThrow(DatabaseError);
    });

    it("Throws a generic Error for unexpected exceptions", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.segment.create.mockRejectedValue(new Error(mockErrorMessage));

      await expect(cloneSegment(mockSegmentId, mockWorkflowId)).rejects.toThrow(Error);
    });
  });
});
