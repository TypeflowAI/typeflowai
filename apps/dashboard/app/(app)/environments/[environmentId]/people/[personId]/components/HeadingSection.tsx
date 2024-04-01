import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getPerson } from "@typeflowai/lib/person/service";
import { getPersonIdentifier } from "@typeflowai/lib/person/util";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import GoBackButton from "@typeflowai/ui/GoBackButton";

import { DeletePersonButton } from "./DeletePersonButton";

interface HeadingSectionProps {
  environmentId: string;
  personId: string;
}

export default async function HeadingSection({ environmentId, personId }: HeadingSectionProps) {
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

  const person = await getPerson(personId);
  const team = await getTeamByEnvironmentId(environmentId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  if (!person) {
    throw new Error("No such person found");
  }
  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);

  return (
    <>
      <GoBackButton />
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-6 pt-4">
        <h1 className="ph-no-capture text-4xl font-bold tracking-tight text-slate-900">
          <span>{getPersonIdentifier(person)}</span>
        </h1>
        {!isViewer && (
          <div className="flex items-center space-x-3">
            <DeletePersonButton
              environmentId={environmentId}
              personId={personId}
              membershipRole={currentUserMembership?.role}
            />
          </div>
        )}
      </div>
    </>
  );
}
