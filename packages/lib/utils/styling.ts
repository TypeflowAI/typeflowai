import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

export const getStyling = (product: TProduct, workflow: TWorkflow) => {
  // allow style overwrite is disabled from the product
  if (!product.styling.allowStyleOverwrite) {
    return product.styling;
  }

  // allow style overwrite is enabled from the product
  if (product.styling.allowStyleOverwrite) {
    // workflow style overwrite is disabled
    if (!workflow.styling?.overwriteThemeStyling) {
      return product.styling;
    }

    // workflow style overwrite is enabled
    return workflow.styling;
  }

  return product.styling;
};
