import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getRemoveInAppBrandingPermission,
  getRemoveLinkBrandingPermission,
} from "@typeflowai/ee/lib/service";
import { DEFAULT_BRAND_COLOR, IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

import SettingsCard from "../components/SettingsCard";
import SettingsTitle from "../components/SettingsTitle";
import { EditBrandColor } from "./components/EditBrandColor";
import { EditTypeflowAIBranding } from "./components/EditBranding";
import { EditHighlightBorder } from "./components/EditHighlightBorder";
import { EditPlacement } from "./components/EditPlacement";

export default async function ProfileSettingsPage({ params }: { params: { environmentId: string } }) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  const [team, product] = await Promise.all([
    getTeamByEnvironmentId(params.environmentId),
    getProductByEnvironmentId(params.environmentId),
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

  const canRemoveInAppBranding = getRemoveInAppBrandingPermission(team);
  const canRemoveLinkBranding = getRemoveLinkBrandingPermission(team);

  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isDeveloper, isViewer } = getAccessFlags(currentUserMembership?.role);
  const isBrandColorEditDisabled = isDeveloper ? true : isViewer;

  if (isViewer) {
    return <ErrorComponent />;
  }

  return (
    <div>
      <SettingsTitle title="Look & Feel" />
      <SettingsCard title="Brand Color" description="Match the workflows with your user interface.">
        <EditBrandColor
          product={product}
          isBrandColorDisabled={isBrandColorEditDisabled}
          environmentId={params.environmentId}
        />
      </SettingsCard>
      <SettingsCard
        title="In-app Workflow Placement"
        description="Change where workflows will be shown in your web app.">
        <EditPlacement product={product} environmentId={params.environmentId} />
      </SettingsCard>
      <SettingsCard
        noPadding
        title="Highlight Border"
        description="Make sure your users notice the workflow you display">
        <EditHighlightBorder
          product={product}
          defaultBrandColor={DEFAULT_BRAND_COLOR}
          environmentId={params.environmentId}
        />
      </SettingsCard>
      <SettingsCard
        title="TypeflowAI Branding"
        description="We love your support but understand if you toggle it off.">
        <EditTypeflowAIBranding
          type="linkWorkflow"
          product={product}
          canRemoveBranding={canRemoveLinkBranding}
          environmentId={params.environmentId}
        />
        <EditTypeflowAIBranding
          type="inAppWorkflow"
          product={product}
          canRemoveBranding={canRemoveInAppBranding}
          environmentId={params.environmentId}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
        />
      </SettingsCard>
    </div>
  );
}
