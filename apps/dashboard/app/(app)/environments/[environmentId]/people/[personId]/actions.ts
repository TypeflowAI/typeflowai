"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { canUserAccessPerson } from "@typeflowai/lib/person/auth";
import { deletePerson } from "@typeflowai/lib/person/service";
import { AuthorizationError } from "@typeflowai/types/errors";

export const deletePersonAction = async (personId: string) => {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  if (!session) throw new AuthorizationError("Not authorized");

  const isAuthorized = await canUserAccessPerson(session.user.id, personId);
  if (!isAuthorized) throw new AuthorizationError("Not authorized");

  await deletePerson(personId);
};
