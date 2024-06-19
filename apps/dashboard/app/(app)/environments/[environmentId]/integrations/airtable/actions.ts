"use server";

import { getAirtableTables } from "@typeflowai/lib/airtable/service";

export const refreshTablesAction = async (environmentId: string) => {
  return await getAirtableTables(environmentId);
};
