"use client";

import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

interface SummaryHeaderProps {
  workflow: TWorkflow;
  product: TProduct;
}
const SummaryHeader = ({ workflow, product }: SummaryHeaderProps) => {
  return (
    <div className="mb-11 mt-6 flex flex-wrap items-center justify-between">
      <div>
        <p className="text-3xl font-bold text-slate-800">{workflow.name}</p>
        <span className="text-base font-extralight text-slate-600">{product.name}</span>
      </div>
    </div>
  );
};

export default SummaryHeader;
