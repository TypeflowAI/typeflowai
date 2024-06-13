import { validateWorkflowSingleUseId } from "@/app/lib/singleUseWorkflows";
import LegalFooter from "@/app/s/[workflowId]/components/LegalFooter";
import LinkWorkflow from "@/app/s/[workflowId]/components/LinkWorkflow";
import PinScreen from "@/app/s/[workflowId]/components/PinScreen";
import WorkflowInactive from "@/app/s/[workflowId]/components/WorkflowInactive";
import { getMetadataForLinkWorkflow } from "@/app/s/[workflowId]/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getIsPaidSubscription } from "@typeflowai/ee/subscription/lib/service";
import { IMPRINT_URL, IS_TYPEFLOWAI_CLOUD, PRIVACY_URL, WEBAPP_URL } from "@typeflowai/lib/constants";
import { createPerson, getPersonByUserId } from "@typeflowai/lib/person/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseBySingleUseId, getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { ZId } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { MediaBackground } from "@typeflowai/ui/MediaBackground";

import { getEmailVerificationDetails } from "./lib/helpers";

interface LinkWorkflowPageProps {
  params: {
    workflowId: string;
  };
  searchParams: {
    suId?: string;
    userId?: string;
    verify?: string;
    lang?: string;
  };
}

export async function generateMetadata({ params }: LinkWorkflowPageProps): Promise<Metadata> {
  const validId = ZId.safeParse(params.workflowId);
  if (!validId.success) {
    notFound();
  }

  return getMetadataForLinkWorkflow(params.workflowId);
}

export default async function LinkWorkflowPage({ params, searchParams }: LinkWorkflowPageProps) {
  const validId = ZId.safeParse(params.workflowId);
  if (!validId.success) {
    notFound();
  }
  const workflow = await getWorkflow(params.workflowId);

  const suId = searchParams.suId;
  const langParam = searchParams.lang; //can either be language code or alias
  const isSingleUseWorkflow = workflow?.singleUse?.enabled;
  const isSingleUseWorkflowEncrypted = workflow?.singleUse?.isEncrypted;

  if (!workflow || workflow.type !== "link" || workflow.status === "draft") {
    notFound();
  }

  const team = await getTeamByEnvironmentId(workflow?.environmentId);
  if (!team) {
    throw new Error("Team not found");
  }
  const isMultiLanguageAllowed = await getIsPaidSubscription(team);

  if (workflow && workflow.status !== "inProgress") {
    return (
      <WorkflowInactive
        status={workflow.status}
        workflowClosedMessage={workflow.workflowClosedMessage ? workflow.workflowClosedMessage : undefined}
      />
    );
  }

  let singleUseId: string | undefined = undefined;
  if (isSingleUseWorkflow) {
    // check if the single use id is present for single use workflows
    if (!suId) {
      return <WorkflowInactive status="link invalid" />;
    }

    // if encryption is enabled, validate the single use id
    let validatedSingleUseId: string | undefined = undefined;
    if (isSingleUseWorkflowEncrypted) {
      validatedSingleUseId = validateWorkflowSingleUseId(suId);
      if (!validatedSingleUseId) {
        return <WorkflowInactive status="link invalid" />;
      }
    }
    // if encryption is disabled, use the suId as is
    singleUseId = validatedSingleUseId ?? suId;
  }

  let singleUseResponse: TResponse | undefined = undefined;
  if (isSingleUseWorkflow) {
    try {
      singleUseResponse = singleUseId
        ? (await getResponseBySingleUseId(workflow.id, singleUseId)) ?? undefined
        : undefined;
    } catch (error) {
      singleUseResponse = undefined;
    }
  }

  // verify email: Check if the workflow requires email verification
  let emailVerificationStatus: string = "";
  let verifiedEmail: string | undefined = undefined;

  if (workflow.verifyEmail) {
    const token =
      searchParams && Object.keys(searchParams).length !== 0 && searchParams.hasOwnProperty("verify")
        ? searchParams.verify
        : undefined;

    if (token) {
      const emailVerificationDetails = await getEmailVerificationDetails(workflow.id, token);
      emailVerificationStatus = emailVerificationDetails.status;
      verifiedEmail = emailVerificationDetails.email;
    }
  }

  // get product and person
  const product = await getProductByEnvironmentId(workflow.environmentId);
  if (!product) {
    throw new Error("Product not found");
  }

  const getLanguageCode = (): string => {
    if (!langParam || !isMultiLanguageAllowed) return "default";
    else {
      const selectedLanguage = workflow.languages.find((workflowLanguage) => {
        return (
          workflowLanguage.language.code === langParam.toLowerCase() ||
          workflowLanguage.language.alias?.toLowerCase() === langParam.toLowerCase()
        );
      });
      if (selectedLanguage?.default || !selectedLanguage?.enabled) {
        return "default";
      }
      return selectedLanguage ? selectedLanguage.language.code : "default";
    }
  };

  const languageCode = getLanguageCode();

  const userId = searchParams.userId;
  if (userId) {
    // make sure the person exists or get's created
    const person = await getPersonByUserId(workflow.environmentId, userId);
    if (!person) {
      await createPerson(workflow.environmentId, userId);
    }
  }

  const isWorkflowPinProtected = Boolean(!!workflow && workflow.pin);
  const responseCount = await getResponseCountByWorkflowId(workflow.id);

  if (isWorkflowPinProtected) {
    return (
      <PinScreen
        workflowId={workflow.id}
        product={product}
        userId={userId}
        emailVerificationStatus={emailVerificationStatus}
        singleUseId={isSingleUseWorkflow ? singleUseId : undefined}
        singleUseResponse={singleUseResponse ? singleUseResponse : undefined}
        webAppUrl={WEBAPP_URL}
        IMPRINT_URL={IMPRINT_URL}
        PRIVACY_URL={PRIVACY_URL}
        IS_TYPEFLOWAI_CLOUD={IS_TYPEFLOWAI_CLOUD}
        verifiedEmail={verifiedEmail}
        languageCode={languageCode}
      />
    );
  }

  return workflow ? (
    <div className="relative">
      <MediaBackground workflow={workflow} product={product}>
        <LinkWorkflow
          workflow={workflow}
          product={product}
          userId={userId}
          emailVerificationStatus={emailVerificationStatus}
          singleUseId={isSingleUseWorkflow ? singleUseId : undefined}
          singleUseResponse={singleUseResponse ? singleUseResponse : undefined}
          webAppUrl={WEBAPP_URL}
          responseCount={workflow.welcomeCard.showResponseCount ? responseCount : undefined}
          verifiedEmail={verifiedEmail}
          languageCode={languageCode}
        />
        <LegalFooter
          IMPRINT_URL={IMPRINT_URL}
          PRIVACY_URL={PRIVACY_URL}
          IS_TYPEFLOWAI_CLOUD={IS_TYPEFLOWAI_CLOUD}
          workflowUrl={WEBAPP_URL + "/s/" + workflow.id}
        />
      </MediaBackground>
    </div>
  ) : null;
}
