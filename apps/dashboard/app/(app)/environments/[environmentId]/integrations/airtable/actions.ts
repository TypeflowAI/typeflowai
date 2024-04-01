"use server";

import { getAirtableTables } from "@typeflowai/lib/airtable/service";

export async function refreshTablesAction(environmentId: string) {
  return await getAirtableTables(environmentId);
}
