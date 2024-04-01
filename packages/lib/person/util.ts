import { TPerson } from "@typeflowai/types/people";

export const getPersonIdentifier = (person: TPerson): string | number | null => {
  return person?.userId || person?.attributes?.userId || person?.attributes?.email || person?.id || null;
};
