import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/data";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

type Props = {
  params: { workflowId: string; environmentId: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const session = await getServerSession(authOptions);
  const workflow = await getWorkflow(params.workflowId);

  if (session) {
    const { responseCount } = await getAnalysisData(params.workflowId, params.environmentId);
    return {
      title: `${responseCount} Responses | ${workflow?.name} Results`,
    };
  }
  return {
    title: "",
  };
};

const WorkflowLayout = ({ children }) => {
  return <div>{children}</div>;
};

export default WorkflowLayout;
