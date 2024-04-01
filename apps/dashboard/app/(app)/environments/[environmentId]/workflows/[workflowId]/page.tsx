import { redirect } from "next/navigation";

export default function EnvironmentPage({ params }) {
  return redirect(`/environments/${params.environmentId}/workflows/${params.workflowId}/summary`);
}
