import WebhookRowData from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookRowData";
import WebhookTable from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookTable";
import WebhookTableHeading from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookTableHeading";

import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getWebhooks } from "@typeflowai/lib/webhook/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import GoBackButton from "@typeflowai/ui/GoBackButton";

export default async function CustomWebhookPage({ params }) {
  const [webhooksUnsorted, workflows, environment] = await Promise.all([
    getWebhooks(params.environmentId),
    getWorkflows(params.environmentId),
    getEnvironment(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }
  const webhooks = webhooksUnsorted.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });
  return (
    <>
      <GoBackButton />
      <WebhookTable environment={environment} webhooks={webhooks} workflows={workflows}>
        <WebhookTableHeading />
        {webhooks.map((webhook) => (
          <WebhookRowData key={webhook.id} webhook={webhook} workflows={workflows} />
        ))}
      </WebhookTable>
    </>
  );
}
