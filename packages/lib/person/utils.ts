import { TAttributes } from "@typeflowai/types/attributes";
import { TResponsePerson } from "@typeflowai/types/responses";

export const getPersonIdentifier = (
  person: TResponsePerson | null,
  personAttributes: TAttributes | null
): string => {
  return personAttributes?.email || person?.userId || "";
};
