import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

type Props = {
  params: { workflowId: string; environmentId: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const session = await getServerSession(authOptions);
  const workflow = await getWorkflow(params.workflowId);
  const responseCount = await getResponseCountByWorkflowId(params.workflowId);

  if (session) {
    return {
      title: `${responseCount} Responses | ${workflow?.name} Results`,
    };
  }
  return {
    title: "",
  };
};

export default async function WorkflowLayout({ children }) {
  return <>{children}</>;
}
