import { ProductConfigNavigation } from "@/app/(app)/environments/[environmentId]/product/components/ProductConfigNavigation";
// import SettingsCard from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import { notFound } from "next/navigation";
// import EditLanguage from "@typeflowai/ee/multi-language/components/edit-language";
// import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeam } from "@typeflowai/lib/team/service";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";

export default async function LanguageSettingsPage({ params }: { params: { environmentId: string } }) {
  const product = await getProductByEnvironmentId(params.environmentId);

  if (!product) {
    throw new Error("Product not found");
  }

  const team = await getTeam(product?.teamId);

  if (!team) {
    throw new Error("Team not found");
  }

  // const isMultiLanguageAllowed = await getIsPaidSubscription(team);
  const isMultiLanguageAllowed = false;

  if (!isMultiLanguageAllowed) {
    notFound();
  }

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Configuration">
        <ProductConfigNavigation
          environmentId={params.environmentId}
          activeId="languages"
          isMultiLanguageAllowed={isMultiLanguageAllowed}
        />
      </PageHeader>
      {/* <SettingsCard
        title="Multi-language workflows"
        description="Add languages to create multi-language workflows.">
        <EditLanguage product={product} environmentId={params.environmentId} />
      </SettingsCard> */}
    </PageContentWrapper>
  );
}
