"use client";

import AddWebhookModal from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/AddWebhookModal";
import WebhookModal from "@/app/(app)/environments/[environmentId]/integrations/webhooks/components/WebhookDetailModal";
import { Webhook } from "lucide-react";
import { useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TWebhook } from "@typeflowai/types/webhooks";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";

export default function WebhookTable({
  environment,
  webhooks,
  workflows,
  children: [TableHeading, webhookRows],
}: {
  environment: TEnvironment;
  webhooks: TWebhook[];
  workflows: TWorkflow[];
  children: [JSX.Element, JSX.Element[]];
}) {
  const [isWebhookDetailModalOpen, setWebhookDetailModalOpen] = useState(false);
  const [isAddWebhookModalOpen, setAddWebhookModalOpen] = useState(false);

  const [activeWebhook, setActiveWebhook] = useState<TWebhook>({
    environmentId: environment.id,
    id: "",
    name: "",
    url: "",
    source: "user",
    triggers: [],
    workflowIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleOpenWebhookDetailModalClick = (e, webhook: TWebhook) => {
    e.preventDefault();
    setActiveWebhook(webhook);
    setWebhookDetailModalOpen(true);
  };

  return (
    <>
      <div className="mb-6 text-right">
        <Button
          variant="darkCTA"
          onClick={() => {
            setAddWebhookModalOpen(true);
          }}>
          <Webhook className="mr-2 h-5 w-5 text-white" />
          Add Webhook
        </Button>
      </div>

      {webhooks.length === 0 ? (
        <EmptySpaceFiller
          type="table"
          environment={environment}
          noWidgetRequired={true}
          emptyMessage="Your webhooks will appear here as soon as you add them. ⏲️"
        />
      ) : (
        <div className="rounded-lg border border-slate-200">
          {TableHeading}
          <div className="grid-cols-7">
            {webhooks.map((webhook, index) => (
              <button
                onClick={(e) => {
                  handleOpenWebhookDetailModalClick(e, webhook);
                }}
                className="w-full"
                key={webhook.id}>
                {webhookRows[index]}
              </button>
            ))}
          </div>
        </div>
      )}

      <WebhookModal
        environmentId={environment.id}
        open={isWebhookDetailModalOpen}
        setOpen={setWebhookDetailModalOpen}
        webhook={activeWebhook}
        workflows={workflows}
      />
      <AddWebhookModal
        environmentId={environment.id}
        workflows={workflows}
        open={isAddWebhookModalOpen}
        setOpen={setAddWebhookModalOpen}
      />
    </>
  );
}
