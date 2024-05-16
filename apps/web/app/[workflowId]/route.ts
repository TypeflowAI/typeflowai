export async function GET(_: Request, { params }: { params: { workflowId: string } }) {
  const workflowId = params.workflowId;
  // redirect to TypeflowAI Cloud
  return Response.redirect(`https://dashboard.typeflowai.com/s/${workflowId}`, 301);
}
