import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getIsEngineLimited } from "@typeflowai/ee/lib/service";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";

import TemplateContainerWithPreview from "./TemplateContainer";

export default async function WorkflowTemplatesPage({ params }) {
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

  const currentUser = session && session.user ? await getUser(session.user.id) : null;

  if (!currentUser) {
    throw new Error("User not available");
  }

  const environmentId = params.environmentId;

  const [environment, product, team] = await Promise.all([
    getEnvironment(environmentId),
    getProductByEnvironmentId(environmentId),
    getTeamByEnvironmentId(environmentId),
  ]);

  if (!session) {
    throw new Error("Session not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (!environment) {
    throw new Error("Environment not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const isEngineLimited = await getIsEngineLimited(team);

  return (
    <TemplateContainerWithPreview
      environmentId={environmentId}
      user={currentUser}
      environment={environment}
      product={product}
      webAppUrl={WEBAPP_URL}
      isEngineLimited={isEngineLimited}
    />
  );
}
