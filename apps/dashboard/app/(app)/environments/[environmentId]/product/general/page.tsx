import { ProductConfigNavigation } from "@/app/(app)/environments/[environmentId]/product/components/ProductConfigNavigation";
import { getServerSession } from "next-auth";

// import { getMultiLanguagePermission } from "@typeflowai/ee/lib/service";
import { authOptions } from "@typeflowai/lib/authOptions";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { PageContentWrapper } from "@typeflowai/ui/PageContentWrapper";
import { PageHeader } from "@typeflowai/ui/PageHeader";
import { SettingsId } from "@typeflowai/ui/SettingsId";

import SettingsCard from "../../settings/components/SettingsCard";
import DeleteProduct from "./components/DeleteProduct";
import { EditProductNameForm } from "./components/EditProductNameForm";
import { EditWaitingTimeForm } from "./components/EditWaitingTimeForm";

export default async function ProfileSettingsPage({ params }: { params: { environmentId: string } }) {
  const [, product, session, team] = await Promise.all([
    getEnvironment(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
    getServerSession(authOptions),
    getTeamByEnvironmentId(params.environmentId),
  ]);

  if (!product) {
    throw new Error("Product not found");
  }
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (!team) {
    throw new Error("Team not found");
  }

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isDeveloper, isViewer } = getAccessFlags(currentUserMembership?.role);
  const isProductNameEditDisabled = isDeveloper ? true : isViewer;

  if (isViewer) {
    return <ErrorComponent />;
  }

  // const isMultiLanguageAllowed = await getMultiLanguagePermission(team);
  const isMultiLanguageAllowed = false;

  return (
    <PageContentWrapper>
      <PageHeader pageTitle="Configuration">
        <ProductConfigNavigation
          environmentId={params.environmentId}
          activeId="general"
          isMultiLanguageAllowed={isMultiLanguageAllowed}
        />
      </PageHeader>

      <SettingsCard title="Product Name" description="Change your products name.">
        <EditProductNameForm
          environmentId={params.environmentId}
          product={product}
          isProductNameEditDisabled={isProductNameEditDisabled}
        />
      </SettingsCard>
      <SettingsCard
        title="Recontact Waiting Time"
        description="Control how frequently users can be workflowed across all workflows.">
        <EditWaitingTimeForm environmentId={params.environmentId} product={product} />
      </SettingsCard>
      <SettingsCard
        title="Delete Product"
        description="Delete product with all workflows, responses, people, actions and attributes. This cannot be undone.">
        <DeleteProduct environmentId={params.environmentId} product={product} />
      </SettingsCard>
      <SettingsId title="Product" id={product.id}></SettingsId>
    </PageContentWrapper>
  );
}
