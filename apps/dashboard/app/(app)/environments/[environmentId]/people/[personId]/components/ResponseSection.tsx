import ResponseTimeline from "@/app/(app)/environments/[environmentId]/people/[personId]/components/ResponseTimeline";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getResponsesByPersonId } from "@typeflowai/lib/response/service";
import { getUser } from "@typeflowai/lib/user/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TEnvironment } from "@typeflowai/types/environment";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflow } from "@typeflowai/types/workflows";

export default async function ResponseSection({
  environment,
  personId,
  environmentTags,
}: {
  environment: TEnvironment;
  personId: string;
  environmentTags: TTag[];
}) {
  const responses = await getResponsesByPersonId(personId);
  const workflowIds = responses?.map((response) => response.workflowId) || [];
  const workflows: TWorkflow[] = workflowIds.length === 0 ? [] : (await getWorkflows(environment.id)) ?? [];
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("No session found");
  }

  const currentUser = session && session.user ? await getUser(session.user.id) : null;

  if (!currentUser) {
    throw new Error("User not available");
  }

  return (
    <>
      {responses && currentUser && (
        <ResponseTimeline
          user={currentUser}
          workflows={workflows}
          responses={responses}
          environment={environment}
          environmentTags={environmentTags}
        />
      )}
    </>
  );
}
