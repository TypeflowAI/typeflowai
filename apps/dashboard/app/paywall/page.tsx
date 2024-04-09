import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";

import Paywall from "./components/Paywall";
import { plansAndFeatures } from "./plans";

export default async function PaywallPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }
  const userId = session?.user.id;
  const environment = await getFirstEnvironmentByUserId(userId);

  if (!environment) {
    throw new Error("No environment found for user");
  }

  const user = await getUser(userId);
  const product = await getProductByEnvironmentId(environment?.id!);

  if (!environment || !user || !product) {
    throw new Error("Failed to get environment, user, or product");
  }

  let team;
  try {
    team = await getTeamByEnvironmentId(environment.id);
    if (!team) {
      throw new Error("Team not found");
    }
  } catch (error) {
    console.error("error getting team", error);
  }

  if (team.billing.subscriptionStatus !== "inactive") {
    return redirect(`/`);
  }

  return <Paywall team={team} environmentId={environment.id} plansAndFeatures={plansAndFeatures} />;
}
