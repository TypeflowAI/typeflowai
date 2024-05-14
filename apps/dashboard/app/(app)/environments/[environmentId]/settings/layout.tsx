import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { getIsEnterpriseSubscription } from "@typeflowai/ee/subscription/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";

import SettingsNavbar from "./components/SettingsNavbar";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsLayout({ children, params }) {
  const [team, product, session] = await Promise.all([
    getTeamByEnvironmentId(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
    getServerSession(authOptions),
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
