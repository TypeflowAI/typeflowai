// import SettingsCard from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import SettingsTitle from "@/app/(app)/environments/[environmentId]/settings/components/SettingsTitle";
import { notFound } from "next/navigation";

// import EditLanguage from "@typeflowai/ee/multiLanguage/components/EditLanguage";
import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeam } from "@typeflowai/lib/team/service";

export default async function LanguageSettingsPage({ params }: { params: { environmentId: string } }) {
  const product = await getProductByEnvironmentId(params.environmentId);

  if (!product) {
    throw new Error("Product not found");
  }

  const team = await getTeam(product?.teamId);

  if (!team) {
    throw new Error("Team not found");
  }

  const isMultiLanguageAllowed = await getIsPaidSubscription(team);

  if (!isMultiLanguageAllowed) {
    notFound();
  }

  return (
    <div>
      <SettingsTitle title="Workflow Languages" />
      {/* <SettingsCard
        title="Multi-language workflows"
        description="Add languages to create multi-language workflows.">
        <EditLanguage product={product} environmentId={params.environmentId} />
      </SettingsCard> */}
    </div>
  );
}
