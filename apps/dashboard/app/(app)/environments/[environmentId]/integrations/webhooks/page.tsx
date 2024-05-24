import { AddWebhookButton } from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/AddWebhookButton";
import WebhookRowData from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookRowData";
import WebhookTable from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookTable";
import WebhookTableHeading from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookTableHeading";

import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getWebhooks } from "@typeflowai/lib/webhook/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import { GoBackButton } from "@typeflowai/ui/GoBackButton";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function CustomWebhookPage({ params }) {
  const [webhooksUnsorted, workflows, environment] = await Promise.all([
    getWebhooks(params.environmentId),
    getWorkflows(params.environmentId, 200), // HOTFIX: not getting all workflows for now since it's maxing out the prisma accelerate limit
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

  const renderAddWebhookButton = () => <AddWebhookButton environment={environment} workflows={workflows} />;

  return (
    <PageContentWrapper>
      <GoBackButton />
      <PageHeader pageTitle="Webhooks" cta={renderAddWebhookButton()} />
      <WebhookTable environment={environment} webhooks={webhooks} workflows={workflows}>
        <WebhookTableHeading />
        {webhooks.map((webhook) => (
          <WebhookRowData key={webhook.id} webhook={webhook} workflows={workflows} />
        ))}
      </WebhookTable>
    </PageContentWrapper>
  );
}
