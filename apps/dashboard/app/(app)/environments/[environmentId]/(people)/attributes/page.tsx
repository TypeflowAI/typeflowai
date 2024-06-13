import { PeopleSecondaryNavigation } from "@/app/(app)/environments/[environmentId]/(people)/people/components/PeopleSecondaryNavigation";
import { CircleHelpIcon } from "lucide-react";
import { Metadata } from "next";

import { getAttributeClasses } from "@typeflowai/lib/attributeClass/service";
import { Button } from "@typeflowai/ui/Button";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

import { AttributeClassesTable } from "./components/AttributeClassesTable";

export const metadata: Metadata = {
  title: "Attributes",
};

export default async function AttributesPage({ params }) {
  let attributeClasses = await getAttributeClasses(params.environmentId);

  const HowToAddAttributesButton = (
    <Button
      size="sm"
      href="https://typeflowai.com/docs/app-workflows/user-identification#setting-custom-user-attributes"
      variant="secondary"
      target="_blank"
      EndIcon={CircleHelpIcon}>
      How to add attributes
    </Button>
  );

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Attributes" cta={HowToAddAttributesButton}>
        <PeopleSecondaryNavigation activeId="attributes" environmentId={params.environmentId} />
      </PageHeader>
      <AttributeClassesTable attributeClasses={attributeClasses} />
    </PageContentWrapper>
  );
}
