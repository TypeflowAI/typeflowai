import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/data";
import ResponsePage from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/responses/components/ResponsePage";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { RESPONSES_PER_PAGE, WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTagsByEnvironmentId } from "@typeflowai/lib/tag/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";

export default async function Page({ params }) {
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
    throw new Error("Unauthorized");
  }
  const [{ responses, workflow }, environment] = await Promise.all([
    getAnalysisData(params.workflowId, params.environmentId),
    getEnvironment(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }
  const product = await getProductByEnvironmentId(environment.id);
  if (!product) {
    throw new Error("Product not found");
  }

  const user = await getUser(session.user.id);
  if (!user) {
    throw new Error("User not found");
  }
  const tags = await getTagsByEnvironmentId(params.environmentId);
  const team = await getTeamByEnvironmentId(params.environmentId);
  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);

  return (
    <>
      <div className="lg:ml-64">
        <ResponsePage
          environment={environment}
          responses={responses}
          workflow={workflow}
          workflowId={params.workflowId}
          webAppUrl={WEBAPP_URL}
          product={product}
          environmentTags={tags}
          user={user}
          responsesPerPage={RESPONSES_PER_PAGE}
          membershipRole={currentUserMembership?.role}
        />
      </div>
    </>
  );
}
