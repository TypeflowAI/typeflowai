"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@typeflowai/lib/cn";
import { TPlacement } from "@typeflowai/types/common";
import { TProduct, TProductUpdateInput } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { Label } from "@typeflowai/ui/Label";
import { getPlacementStyle } from "@typeflowai/ui/PreviewWorkflow/lib/utils";
import { RadioGroup, RadioGroupItem } from "@typeflowai/ui/RadioGroup";

import { updateProductAction } from "../actions";

const placements = [
  { name: "Bottom Right", value: "bottomRight", disabled: false },
  { name: "Top Right", value: "topRight", disabled: false },
  { name: "Top Left", value: "topLeft", disabled: false },
  { name: "Bottom Left", value: "bottomLeft", disabled: false },
  { name: "Centered Modal", value: "center", disabled: false },
];

interface EditPlacementProps {
  product: TProduct;
  environmentId: string;
}

export function EditPlacement({ product }: EditPlacementProps) {
  const [currentPlacement, setCurrentPlacement] = useState<TPlacement>(product.placement);
  const [overlay, setOverlay] = useState(product.darkOverlay ? "darkOverlay" : "lightOverlay");
  const [clickOutside, setClickOutside] = useState(product.clickOutsideClose ? "allow" : "disallow");
  const [updatingPlacement, setUpdatingPlacement] = useState(false);
  const overlayStyle =
    currentPlacement === "center" && overlay === "darkOverlay" ? "bg-gray-700/80" : "bg-slate-200";

  const handleUpdatePlacement = async () => {
    try {
      setUpdatingPlacement(true);
      let inputProduct: Partial<TProductUpdateInput> = {
        placement: currentPlacement,
        darkOverlay: overlay === "darkOverlay",
        clickOutsideClose: clickOutside === "allow",
      };

      await updateProductAction(product.id, inputProduct);

      toast.success("Placement updated successfully.");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setUpdatingPlacement(false);
    }
  };

  return (
    <div className="w-full items-center">
      <div className="flex">
        <RadioGroup onValueChange={(e) => setCurrentPlacement(e as TPlacement)} value={currentPlacement}>
          {placements.map((placement) => (
            <div key={placement.value} className="flex items-center space-x-2 whitespace-nowrap">
              <RadioGroupItem id={placement.value} value={placement.value} disabled={placement.disabled} />
              <Label htmlFor={placement.value} className="text-slate-900">
                {placement.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div
          className={cn(
            clickOutside === "disallow" ? "cursor-not-allowed" : "",
            "relative ml-8 h-40 w-full rounded",
            overlayStyle
          )}>
          <div
            className={cn(
              "absolute h-16 w-16 cursor-default rounded bg-slate-700",
              getPlacementStyle(currentPlacement)
            )}></div>
        </div>
      </div>

      {currentPlacement === "center" && (
        <>
          <div className="mt-6 space-y-2">
            <Label className="font-semibold">Centered modal overlay color</Label>
            <RadioGroup onValueChange={(e) => setOverlay(e)} value={overlay} className="flex space-x-4">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <RadioGroupItem id="lightOverlay" value="lightOverlay" />
                <Label htmlFor="lightOverlay" className="text-slate-900">
                  Light Overlay
                </Label>
              </div>
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <RadioGroupItem id="darkOverlay" value="darkOverlay" />
                <Label htmlFor="darkOverlay" className="text-slate-900">
                  Dark Overlay
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="mt-6 space-y-2">
            <Label className="font-semibold">Allow users to exit by clicking outside the study</Label>
            <RadioGroup
              onValueChange={(e) => setClickOutside(e)}
              value={clickOutside}
              className="flex space-x-4">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <RadioGroupItem id="disallow" value="disallow" />
                <Label htmlFor="disallow" className="text-slate-900">
                  Don&apos;t Allow
                </Label>
              </div>
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <RadioGroupItem id="allow" value="allow" />
                <Label htmlFor="allow" className="text-slate-900">
                  Allow
                </Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
      <Button variant="darkCTA" className="mt-4" loading={updatingPlacement} onClick={handleUpdatePlacement}>
        Save
      </Button>
    </div>
  );
}
