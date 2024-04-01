import ActionsAttributesTabs from "@/app/(app)/environments/[environmentId]/(actionsAndAttributes)/attributes/components/ActionsAttributesTabs";

import ContentWrapper from "@typeflowai/ui/ContentWrapper";

export default function ActionsAndAttributesLayout({ params, children }) {
  return (
    <>
      <div className="lg:ml-64">
        <ActionsAttributesTabs activeId="attributes" environmentId={params.environmentId} />
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
}
