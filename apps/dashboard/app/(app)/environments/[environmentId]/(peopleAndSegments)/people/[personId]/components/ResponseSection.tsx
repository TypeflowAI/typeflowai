import ResponseTimeline from "@/app/(app)/environments/[environmentId]/(peopleAndSegments)/people/[personId]/components/ResponseTimeline";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getResponsesByPersonId } from "@typeflowai/lib/response/service";
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
  if (!responses) {
    throw new Error("No responses found");
  }

  return (
    <ResponseTimeline
      user={session.user}
      workflows={workflows}
      responses={responses}
      environment={environment}
      environmentTags={environmentTags}
    />
  );
}
