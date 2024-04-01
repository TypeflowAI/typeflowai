import { createServerClient } from "@supabase/ssr";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { getIsEnterpriseSubscription } from "@typeflowai/ee/lib/service";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

import SettingsNavbar from "./components/SettingsNavbar";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsLayout({ children, params }) {
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

  const [team, product] = await Promise.all([
    getTeamByEnvironmentId(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
  ]);
  if (!team) {
    throw new Error("Team not found");
  }
  if (!product) {
    throw new Error("Product not found");
  }

  if (!session) {
    throw new Error("Unauthenticated");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);

  const isEnterprise = getIsEnterpriseSubscription(team);

  return (
    <>
      <div className="sm:flex lg:ml-64">
        <SettingsNavbar
          environmentId={params.environmentId}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
          team={team}
          product={product}
          membershipRole={currentUserMembership?.role}
          isEnterprise={isEnterprise}
        />
        <div className="w-full md:ml-64">
          <div className="max-w-4xl px-20 pb-6 pt-14 md:pt-6">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
