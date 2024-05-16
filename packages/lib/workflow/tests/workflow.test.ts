import { prisma } from "../../__mocks__/database";

import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { testInputValidation } from "vitestSetup";

import { DatabaseError, ResourceNotFoundError } from "@typeflowai/types/errors";

import {
  createWorkflow,
  deleteWorkflow,
  duplicateWorkflow,
  getSyncWorkflows,
  getWorkflow,
  getWorkflowCount,
  getWorkflows,
  getWorkflowsByActionClassId,
  updateWorkflow,
} from "../service";
import {
  createWorkflowInput,
  mockActionClass,
  mockAttributeClass,
  mockDisplay,
  mockId,
  mockPrismaPerson,
  mockProduct,
  mockSyncWorkflowOutput,
  mockTeamOutput,
  mockTransformedSyncWorkflowOutput,
  mockTransformedWorkflowOutput,
  mockUser,
  mockWorkflowOutput,
  updateWorkflowInput,
} from "./__mock__/workflow.mock";

beforeEach(() => {
  prisma.workflow.count.mockResolvedValue(1);
});

describe("Tests for getWorkflow", () => {
  describe("Happy Path", () => {
    it("Returns a workflow", async () => {
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      const workflow = await getWorkflow(mockId);
      expect(workflow).toEqual(mockTransformedWorkflowOutput);
    });

    it("Returns null if workflow is not found", async () => {
      prisma.workflow.findUnique.mockResolvedValueOnce(null);
      const workflow = await getWorkflow(mockId);
      expect(workflow).toBeNull();
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getWorkflow, "123#");

    it("should throw a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });
      prisma.workflow.findUnique.mockRejectedValue(errToThrow);
      await expect(getWorkflow(mockId)).rejects.toThrow(DatabaseError);
    });

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.workflow.findUnique.mockRejectedValue(new Error(mockErrorMessage));
      await expect(getWorkflow(mockId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getWorkflowsByActionClassId", () => {
  describe("Happy Path", () => {
    it("Returns an array of workflows for a given actionClassId", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([mockWorkflowOutput]);
      const workflows = await getWorkflowsByActionClassId(mockId);
      expect(workflows).toEqual([mockTransformedWorkflowOutput]);
    });

    it("Returns an empty array if no workflows are found", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([]);
      const workflows = await getWorkflowsByActionClassId(mockId);
      expect(workflows).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getWorkflowsByActionClassId, "123#");

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.findMany.mockRejectedValue(new Error(mockErrorMessage));
      await expect(getWorkflowsByActionClassId(mockId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getWorkflows", () => {
  describe("Happy Path", () => {
    it("Returns an array of workflows for a given environmentId, limit(optional) and offset(optional)", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([mockWorkflowOutput]);
      const workflows = await getWorkflows(mockId);
      expect(workflows).toEqual([mockTransformedWorkflowOutput]);
    });

    it("Returns an empty array if no workflows are found", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([]);

      const workflows = await getWorkflows(mockId);
      expect(workflows).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getWorkflowsByActionClassId, "123#");

    it("should throw a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });

      prisma.workflow.findMany.mockRejectedValue(errToThrow);
      await expect(getWorkflows(mockId)).rejects.toThrow(DatabaseError);
    });

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.findMany.mockRejectedValue(new Error(mockErrorMessage));
      await expect(getWorkflows(mockId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for updateWorkflow", () => {
  beforeEach(() => {
    prisma.actionClass.findMany.mockResolvedValueOnce([mockActionClass]);
  });
  describe("Happy Path", () => {
    it("Updates a workflow successfully", async () => {
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.workflow.update.mockResolvedValueOnce(mockWorkflowOutput);
      const updatedWorkflow = await updateWorkflow(updateWorkflowInput);
      expect(updatedWorkflow).toEqual(mockTransformedWorkflowOutput);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(updateWorkflow, "123#");

    it("Throws ResourceNotFoundError if the workflow does not exist", async () => {
      prisma.workflow.findUnique.mockRejectedValueOnce(
        new ResourceNotFoundError("Workflow", updateWorkflowInput.id)
      );
      await expect(updateWorkflow(updateWorkflowInput)).rejects.toThrow(ResourceNotFoundError);
    });

    it("should throw a DatabaseError error if there is a PrismaClientKnownRequestError", async () => {
      const mockErrorMessage = "Mock error message";
      const errToThrow = new Prisma.PrismaClientKnownRequestError(mockErrorMessage, {
        code: "P2002",
        clientVersion: "0.0.1",
      });
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.workflow.update.mockRejectedValue(errToThrow);
      await expect(updateWorkflow(updateWorkflowInput)).rejects.toThrow(DatabaseError);
    });

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.workflow.update.mockRejectedValue(new Error(mockErrorMessage));
      await expect(updateWorkflow(updateWorkflowInput)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for deleteWorkflow", () => {
  describe("Happy Path", () => {
    it("Deletes a workflow successfully", async () => {
      prisma.workflow.delete.mockResolvedValueOnce(mockWorkflowOutput);
      const deletedWorkflow = await deleteWorkflow(mockId);
      expect(deletedWorkflow).toEqual(mockWorkflowOutput);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(deleteWorkflow, "123#");

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.workflow.delete.mockRejectedValue(new Error(mockErrorMessage));
      await expect(deleteWorkflow(mockId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for createWorkflow", () => {
  beforeEach(() => {
    prisma.actionClass.findMany.mockResolvedValueOnce([mockActionClass]);
  });

  describe("Happy Path", () => {
    it("Creates a workflow successfully", async () => {
      prisma.workflow.create.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.team.findFirst.mockResolvedValueOnce(mockTeamOutput);
      prisma.actionClass.findMany.mockResolvedValue([mockActionClass]);
      prisma.user.findMany.mockResolvedValueOnce([
        {
          ...mockUser,
          twoFactorSecret: null,
          backupCodes: null,
          password: null,
          identityProviderAccountId: null,
          groupId: null,
          role: "engineer",
        },
      ]);
      prisma.user.update.mockResolvedValueOnce({
        ...mockUser,
        twoFactorSecret: null,
        backupCodes: null,
        password: null,
        identityProviderAccountId: null,
        groupId: null,
        role: "engineer",
      });
      const createdWorkflow = await createWorkflow(mockId, createWorkflowInput);
      expect(createdWorkflow).toEqual(mockTransformedWorkflowOutput);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(createWorkflow, "123#", createWorkflowInput);

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.delete.mockRejectedValue(new Error(mockErrorMessage));
      await expect(createWorkflow(mockId, createWorkflowInput)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for duplicateWorkflow", () => {
  beforeEach(() => {
    prisma.actionClass.findMany.mockResolvedValueOnce([mockActionClass]);
  });

  describe("Happy Path", () => {
    it("Duplicates a workflow successfully", async () => {
      prisma.workflow.findUnique.mockResolvedValueOnce(mockWorkflowOutput);
      prisma.workflow.create.mockResolvedValueOnce(mockWorkflowOutput);
      const createdWorkflow = await duplicateWorkflow(mockId, mockId, mockId);
      expect(createdWorkflow).toEqual(mockWorkflowOutput);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(duplicateWorkflow, "123#", "123#");

    it("Throws ResourceNotFoundError if the workflow does not exist", async () => {
      prisma.workflow.findUnique.mockRejectedValueOnce(new ResourceNotFoundError("Workflow", mockId));
      await expect(duplicateWorkflow(mockId, mockId, mockId)).rejects.toThrow(ResourceNotFoundError);
    });

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.workflow.create.mockRejectedValue(new Error(mockErrorMessage));
      await expect(duplicateWorkflow(mockId, mockId, mockId)).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getSyncWorkflows", () => {
  describe("Happy Path", () => {
    beforeEach(() => {
      prisma.product.findFirst.mockResolvedValueOnce({
        ...mockProduct,
        brandColor: null,
        highlightBorderColor: null,
        logo: null,
      });
      prisma.display.findMany.mockResolvedValueOnce([mockDisplay]);
      prisma.attributeClass.findMany.mockResolvedValueOnce([mockAttributeClass]);
    });

    it("Returns synced workflows", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([mockSyncWorkflowOutput]);
      prisma.person.findUnique.mockResolvedValueOnce(mockPrismaPerson);
      const workflows = await getSyncWorkflows(mockId, mockPrismaPerson.id, "desktop", {
        version: "1.7.0",
      });
      expect(workflows).toEqual([mockTransformedSyncWorkflowOutput]);
    });

    it("Returns an empty array if no workflows are found", async () => {
      prisma.workflow.findMany.mockResolvedValueOnce([]);
      prisma.person.findUnique.mockResolvedValueOnce(mockPrismaPerson);
      const workflows = await getSyncWorkflows(mockId, mockPrismaPerson.id, "desktop", {
        version: "1.7.0",
      });
      expect(workflows).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getSyncWorkflows, "123#", {});

    it("does not find a Product", async () => {
      prisma.product.findFirst.mockResolvedValueOnce(null);

      await expect(
        getSyncWorkflows(mockId, mockPrismaPerson.id, "desktop", { version: "1.7.0" })
      ).rejects.toThrow(Error);
    });

    it("should throw an error if there is an unknown error", async () => {
      const mockErrorMessage = "Unknown error occurred";
      prisma.actionClass.findMany.mockResolvedValueOnce([mockActionClass]);
      prisma.workflow.create.mockRejectedValue(new Error(mockErrorMessage));
      await expect(
        getSyncWorkflows(mockId, mockPrismaPerson.id, "desktop", { version: "1.7.0" })
      ).rejects.toThrow(Error);
    });
  });
});

describe("Tests for getWorkflowCount service", () => {
  describe("Happy Path", () => {
    it("Counts the total number of workflows for a given environment ID", async () => {
      const count = await getWorkflowCount(mockId);
      expect(count).toEqual(1);
    });

    it("Returns zero count when there are no workflows for a given environment ID", async () => {
      prisma.workflow.count.mockResolvedValue(0);
      const count = await getWorkflowCount(mockId);
      expect(count).toEqual(0);
    });
  });

  describe("Sad Path", () => {
    testInputValidation(getWorkflowCount, "123#");

    it("Throws a generic Error for other unexpected issues", async () => {
      const mockErrorMessage = "Mock error message";
      prisma.workflow.count.mockRejectedValue(new Error(mockErrorMessage));

      await expect(getWorkflowCount(mockId)).rejects.toThrow(Error);
    });
  });
});
