"use client";

import { Webhook } from "lucide-react";
import { useState } from "react";

import { TEnvironment } from "@typeflowai/types/environment";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";

import AddWebhookModal from "./AddWebhookModal";

interface AddWebhookButtonProps {
  environment: TEnvironment;
  workflows: TWorkflow[];
}

export const AddWebhookButton = ({ environment, workflows }: AddWebhookButtonProps) => {
  const [isAddWebhookModalOpen, setAddWebhookModalOpen] = useState(false);
  return (
    <>
      <Button
        variant="darkCTA"
        size="sm"
        onClick={() => {
          setAddWebhookModalOpen(true);
        }}>
        <Webhook className="mr-2 h-5 w-5 text-white" />
        Add Webhook
      </Button>
      <AddWebhookModal
        environmentId={environment.id}
        workflows={workflows}
        open={isAddWebhookModalOpen}
        setOpen={setAddWebhookModalOpen}
      />
    </>
  );
};
