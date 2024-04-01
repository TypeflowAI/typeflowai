"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { TProduct, TProductUpdateInput } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { ColorPicker } from "@typeflowai/ui/ColorPicker";
import { Label } from "@typeflowai/ui/Label";

import { updateProductAction } from "../actions";

interface EditBrandColorProps {
  product: TProduct;
  isBrandColorDisabled: boolean;
  environmentId: string;
}

export function EditBrandColor({ product, isBrandColorDisabled }: EditBrandColorProps) {
  const [color, setColor] = useState(product.brandColor);
  const [updatingColor, setUpdatingColor] = useState(false);

  const handleUpdateBrandColor = async () => {
    try {
      if (isBrandColorDisabled) {
        throw new Error("Only Owners, Admins and Editors can perform this action.");
      }
      setUpdatingColor(true);
      let inputProduct: Partial<TProductUpdateInput> = {
        brandColor: color,
      };
      await updateProductAction(product.id, inputProduct);
      toast.success("Brand color updated successfully.");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setUpdatingColor(false);
    }
  };

  return !isBrandColorDisabled ? (
    <div className="w-full max-w-sm items-center">
      <Label htmlFor="brandcolor">Color (HEX)</Label>
      <ColorPicker color={color} onChange={setColor} />
      <Button variant="darkCTA" className="mt-4" loading={updatingColor} onClick={handleUpdateBrandColor}>
        Save
      </Button>
    </div>
  ) : (
    <p className="text-sm text-red-700">Only Owners, Admins and Editors can perform this action.</p>
  );
}
