import { getAnalysisData } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/(analysis)/data";
import { createServerClient } from "@supabase/ssr";
import { Metadata } from "next";
import { cookies } from "next/headers";

import { getWorkflow } from "@typeflowai/lib/workflow/service";

type Props = {
  params: { workflowId: string; environmentId: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
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
