import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getFirstEnvironmentByUserId } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getUser } from "@typeflowai/lib/user/service";

import Onboarding from "./components/Onboarding";

export default async function OnboardingPage() {
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

  return <Onboarding session={session} environmentId={environment.id} user={user} product={product} />;
}
