import { ResponseTimeline } from "@/app/(app)/environments/[environmentId]/(people)/people/[personId]/components/ResponseTimeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getResponsesByPersonId } from "@typeflowai/lib/response/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TTag } from "@typeflowai/types/tags";
import { TWorkflow } from "@typeflowai/types/workflows";

interface ResponseSectionProps {
  environment: TEnvironment;
  personId: string;
  environmentTags: TTag[];
  attributeClasses: TAttributeClass[];
}

export const ResponseSection = async ({
  environment,
  personId,
  environmentTags,
  attributeClasses,
}: ResponseSectionProps) => {
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
      attributeClasses={attributeClasses}
    />
  );
};
