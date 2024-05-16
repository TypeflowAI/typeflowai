import { PrismaClient } from "@prisma/client";
import { beforeEach, vi } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

export const prisma = mockDeep<PrismaClient>();

vi.mock("@typeflowai/database", () => ({
  __esModule: true,
  prisma,
}));

beforeEach(() => {
  mockReset(prisma);
});
