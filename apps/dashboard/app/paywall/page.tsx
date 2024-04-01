import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";

import Paywall from "./components/Paywall";
import { plansAndFeatures } from "./plans";

export default async function PaywallPage() {
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
