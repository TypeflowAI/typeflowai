"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { canUserAccessPerson } from "@typeflowai/lib/person/auth";
import { deletePerson } from "@typeflowai/lib/person/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const deletePersonAction = async (personId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessPerson(session.user.id, personId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  await deletePerson(personId);
};
