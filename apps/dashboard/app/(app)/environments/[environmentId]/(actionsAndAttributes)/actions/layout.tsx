import ActionsAttributesTabs from "@/app/(app)/environments/[environmentId]/(actionsAndAttributes)/attributes/components/ActionsAttributesTabs";
import EnvironmentAlert from "@/app/(app)/environments/[environmentId]/components/EnvironmentAlert";

import { getEnvironment } from "@typeflowai/lib/environment/service";
import ContentWrapper from "@typeflowai/ui/ContentWrapper";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

export default async function ActionsAndAttributesLayout({ params, children }) {
  const environment = await getEnvironment(params.environmentId);

  if (!environment) {
    return <ErrorComponent />;
  }

  return (
    <>
      <div className="lg:ml-64">
        <EnvironmentAlert environment={environment} />
        <ActionsAttributesTabs activeId="actions" environmentId={params.environmentId} />
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
}
