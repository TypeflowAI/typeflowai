import WebhookOverviewTab from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookOverviewTab";
import WebhookSettingsTab from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookSettingsTab";
import { Webhook } from "lucide-react";

import { TWebhook } from "@typeflowai/types/webhooks";
import { TWorkflow } from "@typeflowai/types/workflows";
import { ModalWithTabs } from "@typeflowai/ui/ModalWithTabs";

interface WebhookModalProps {
  environmentId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  webhook: TWebhook;
  workflows: TWorkflow[];
}

export default function WebhookModal({
  environmentId,
  open,
  setOpen,
  webhook,
  workflows,
}: WebhookModalProps) {
  const tabs = [
    {
      title: "Overview",
      children: <WebhookOverviewTab webhook={webhook} workflows={workflows} />,
    },
    {
      title: "Settings",
      children: (
        <WebhookSettingsTab
          environmentId={environmentId}
          webhook={webhook}
          workflows={workflows}
          setOpen={setOpen}
        />
      ),
    },
  ];

  return (
    <>
      <ModalWithTabs
        open={open}
        setOpen={setOpen}
        tabs={tabs}
        icon={<Webhook />}
        label={webhook.name ? webhook.name : webhook.url}
        description={""}
      />
    </>
  );
}
