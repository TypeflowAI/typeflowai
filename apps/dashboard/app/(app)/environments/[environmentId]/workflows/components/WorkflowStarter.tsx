"use client";

import type { TEnvironment } from "@typeflowai/types/environment";
import type { TProduct } from "@typeflowai/types/product";
import { TUser } from "@typeflowai/types/user";
import { TemplateList } from "@typeflowai/ui/TemplateList";

export default function WorkflowStarter({
  environmentId,
  environment,
  product,
  user,
  isEngineLimited,
}: {
  environmentId: string;
  environment: TEnvironment;
  product: TProduct;
  user: TUser;
  isEngineLimited: boolean;
}) {
  return (
    <>
      <h1 className="px-6 text-3xl font-extrabold text-slate-700">
        You&apos;re all set! Time to create your first workflow.
      </h1>

      <TemplateList
        environmentId={environmentId}
        /* onTemplateClick={(template) => {
              newWorkflowFromTemplate(template);
            }} */
        environment={environment}
        product={product}
        user={user}
        isEngineLimited={isEngineLimited}
      />
    </>
  );
}
