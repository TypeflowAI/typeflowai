import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { TAccount, TAccountInput, ZAccountInput } from "@typeflowai/types/account";
import { DatabaseError } from "@typeflowai/types/errors";

import { validateInputs } from "../utils/validate";

export const createAccount = async (accountData: TAccountInput): Promise<TAccount> => {
  validateInputs([accountData, ZAccountInput]);

  try {
    const account = await prisma.account.create({
      data: accountData,
    });
    return account;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
