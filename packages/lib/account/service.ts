import { Prisma } from "@prisma/client";

import { prisma } from "@typeflowai/database";
import { TAccount, TAccountInput, ZAccountInput } from "@typeflowai/types/account";
import { DatabaseError } from "@typeflowai/types/errors";

import { validateInputs } from "../utils/validate";
import { filterAccountInputData } from "./utils";

export const createAccount = async (accountData: TAccountInput): Promise<TAccount> => {
  validateInputs([accountData, ZAccountInput]);

  try {
    const supportedAccountData = filterAccountInputData(accountData);
    const account = await prisma.account.create({
      data: supportedAccountData,
    });
    return account;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }

    throw error;
  }
};
