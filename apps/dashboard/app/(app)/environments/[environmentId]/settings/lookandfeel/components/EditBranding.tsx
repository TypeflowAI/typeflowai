"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { TProduct, TProductUpdateInput } from "@typeflowai/types/product";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";
import { UpgradePlanNotice } from "@typeflowai/ui/UpgradePlanNotice";

import { updateProductAction } from "../actions";

interface EditTypeflowAIBrandingProps {
  type: "linkWorkflow" | "inAppWorkflow";
  product: TProduct;
  canRemoveBranding: boolean;
  environmentId: string;
}

export function EditTypeflowAIBranding({
  type,
  product,
  canRemoveBranding,
  environmentId,
}: EditTypeflowAIBrandingProps) {
  const [isBrandingEnabled, setIsBrandingEnabled] = useState(
    type === "linkWorkflow" ? product.linkWorkflowBranding : product.inAppWorkflowBranding
  );
  const [updatingBranding, setUpdatingBranding] = useState(false);

  const toggleBranding = async () => {
    try {
      setUpdatingBranding(true);
      const newBrandingState = !isBrandingEnabled;
      setIsBrandingEnabled(newBrandingState);
      let inputProduct: Partial<TProductUpdateInput> = {
        [type === "linkWorkflow" ? "linkWorkflowBranding" : "inAppWorkflowBranding"]: newBrandingState,
      };
      await updateProductAction(product.id, inputProduct);
      toast.success(newBrandingState ? "TypeflowAI branding is shown." : "TypeflowAI branding is hidden.");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setUpdatingBranding(false);
    }
  };

  return (
    <div className="w-full items-center space-y-4">
      <div className="mb-4 flex items-center space-x-2">
        <Switch
          id={`branding-${type}`}
          checked={isBrandingEnabled}
          onCheckedChange={toggleBranding}
          disabled={!canRemoveBranding || updatingBranding}
        />
        <Label htmlFor={`branding-${type}`}>
          Show TypeflowAI Branding in {type === "linkWorkflow" ? "Link" : "In-App"} Workflows
        </Label>
      </div>
      {!canRemoveBranding && (
        <div>
          {type === "linkWorkflow" && (
            <div className="mb-8">
              <UpgradePlanNotice
                message="To remove the TypeflowAI branding from Link Workflows, please"
                textForUrl="upgrade your plan."
                url={`/environments/${environmentId}/settings/billing`}
              />
            </div>
          )}
          {type !== "linkWorkflow" && (
            <UpgradePlanNotice
              message="To remove the TypeflowAI branding from In-app Workflows, please"
              textForUrl="upgrade your plan."
              url={`/environments/${environmentId}/settings/billing`}
            />
          )}
        </div>
      )}
    </div>
  );
}
