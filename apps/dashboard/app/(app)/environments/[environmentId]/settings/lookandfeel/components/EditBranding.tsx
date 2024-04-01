"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { TProduct, TProductUpdateInput } from "@typeflowai/types/product";
import { Alert, AlertDescription } from "@typeflowai/ui/Alert";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

import { updateProductAction } from "../actions";

interface EditTypeflowAIBrandingProps {
  type: "linkWorkflow" | "inAppWorkflow";
  product: TProduct;
  canRemoveBranding: boolean;
  environmentId: string;
  isTypeflowAICloud?: boolean;
}

export function EditTypeflowAIBranding({
  type,
  product,
  canRemoveBranding,
  environmentId,
  isTypeflowAICloud,
}: EditTypeflowAIBrandingProps) {
  const [isBrandingEnabled, setIsBrandingEnabled] = useState(
    type === "linkWorkflow" ? product.linkWorkflowBranding : product.inAppWorkflowBranding
  );
  const [updatingBranding, setUpdatingBranding] = useState(false);

  const getTextFromType = (type) => {
    if (type === "linkWorkflow") return "Link Workflows";
    if (type === "inAppWorkflow") return "In App Workflows";
  };

  const toggleBranding = async () => {
    try {
      setUpdatingBranding(true);
      const newBrandingState = !isBrandingEnabled;
      setIsBrandingEnabled(newBrandingState);
      let inputProduct: Partial<TProductUpdateInput> = {
        [type === "linkWorkflow" ? "linkWorkflowBranding" : "inAppWorkflowBranding"]: newBrandingState,
      };
      await updateProductAction(product.id, inputProduct);
      toast.success(
        newBrandingState ? "TypeflowAI branding will be shown." : "TypeflowAI branding will now be hidden."
      );
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setUpdatingBranding(false);
    }
  };

  return (
    <div className="w-full items-center">
      {!canRemoveBranding && (
        <div className="mb-4">
          <Alert>
            <AlertDescription>
              To remove the TypeflowAI branding from the&nbsp;
              <span className="font-semibold">{getTextFromType(type)}</span>, please&nbsp;
              {type === "linkWorkflow" ? (
                <span className="underline">
                  <Link href={`/environments/${environmentId}/settings/billing`}>upgrade your plan.</Link>
                </span>
              ) : (
                <span className="underline">
                  {isTypeflowAICloud ? (
                    <Link href={`/environments/${environmentId}/settings/billing`}>upgrade your plan.</Link>
                  ) : (
                    <a href="mailto:support@typeflowai.com">
                      get a self-hosted license (free to get started).
                    </a>
                  )}
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="mb-6 flex items-center space-x-2">
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
    </div>
  );
}
