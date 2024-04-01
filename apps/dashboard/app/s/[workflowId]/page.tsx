import { validateWorkflowSingleUseId } from "@/app/lib/singleUseWorkflows";
import LegalFooter from "@/app/s/[workflowId]/components/LegalFooter";
import LinkWorkflow from "@/app/s/[workflowId]/components/LinkWorkflow";
import { MediaBackground } from "@/app/s/[workflowId]/components/MediaBackground";
import PinScreen from "@/app/s/[workflowId]/components/PinScreen";
import WorkflowInactive from "@/app/s/[workflowId]/components/WorkflowInactive";
import { checkValidity } from "@/app/s/[workflowId]/lib/prefilling";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IMPRINT_URL, PRIVACY_URL } from "@typeflowai/lib/constants";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { createPerson, getPersonByUserId } from "@typeflowai/lib/person/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getResponseBySingleUseId } from "@typeflowai/lib/response/service";
import { getResponseCountByWorkflowId } from "@typeflowai/lib/response/service";
import { getWorkflow } from "@typeflowai/lib/workflow/service";
import { ZId } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";

import { getEmailVerificationStatus } from "./lib/helpers";

interface LinkWorkflowPageProps {
  params: {
    workflowId: string;
  };
  searchParams: {
    suId?: string;
    userId?: string;
    verify?: string;
  };
}

export async function generateMetadata({ params }: LinkWorkflowPageProps): Promise<Metadata> {
  const validId = ZId.safeParse(params.workflowId);
  if (!validId.success) {
    notFound();
  }

  const workflow = await getWorkflow(params.workflowId);

  if (!workflow || workflow.type !== "link" || workflow.status === "draft") {
    notFound();
  }

  const product = await getProductByEnvironmentId(workflow.environmentId);

  if (!product) {
    throw new Error("Product not found");
  }

  function getNameForURL(string) {
    return string.replace(/ /g, "%20");
  }

  function getBrandColorForURL(string) {
    return string.replace(/#/g, "%23");
  }

  const brandColor = getBrandColorForURL(product.brandColor);
  const workflowName = getNameForURL(workflow.name);

  const ogImgURL = `/api/v1/og?brandColor=${brandColor}&name=${workflowName}`;

  return {
    title: workflow.name,
    metadataBase: new URL(WEBAPP_URL),
    openGraph: {
      title: workflow.name,
      description: "Create your own workflow like this with TypeflowAI' open source workflow suite.",
      url: `/s/${workflow.id}`,
      siteName: "",
      images: [ogImgURL],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: workflow.name,
      description: "Create your own workflow like this with TypeflowAI' open source workflow suite.",
      images: [ogImgURL],
    },
  };
}

export default async function LinkWorkflowPage({ params, searchParams }: LinkWorkflowPageProps) {
  const validId = ZId.safeParse(params.workflowId);
  if (!validId.success) {
    notFound();
  }
  const workflow = await getWorkflow(params.workflowId);

  const suId = searchParams.suId;
  const isSingleUseWorkflow = workflow?.singleUse?.enabled;
  const isSingleUseWorkflowEncrypted = workflow?.singleUse?.isEncrypted;

  if (!workflow || workflow.type !== "link" || workflow.status === "draft") {
    notFound();
  }

  // question pre filling: Check if the first question is prefilled and if it is valid
  const prefillAnswer = searchParams[workflow.questions[0].id];
  const isPrefilledAnswerValid = prefillAnswer ? checkValidity(workflow!.questions[0], prefillAnswer) : false;

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
  let emailVerificationStatus: string | undefined = undefined;
  if (workflow.verifyEmail) {
    const token =
      searchParams && Object.keys(searchParams).length !== 0 && searchParams.hasOwnProperty("verify")
        ? searchParams.verify
        : undefined;

    if (token) {
      emailVerificationStatus = await getEmailVerificationStatus(workflow.id, token);
    }
  }

  // get product and person
  const product = await getProductByEnvironmentId(workflow.environmentId);
  if (!product) {
    throw new Error("Product not found");
  }

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
        prefillAnswer={isPrefilledAnswerValid ? prefillAnswer : null}
        singleUseId={isSingleUseWorkflow ? singleUseId : undefined}
        singleUseResponse={singleUseResponse ? singleUseResponse : undefined}
        webAppUrl={WEBAPP_URL}
        IMPRINT_URL={IMPRINT_URL}
        PRIVACY_URL={PRIVACY_URL}
      />
    );
  }

  return workflow ? (
    <div>
      <MediaBackground workflow={workflow}>
        <LinkWorkflow
          workflow={workflow}
          product={product}
          userId={userId}
          emailVerificationStatus={emailVerificationStatus}
          prefillAnswer={isPrefilledAnswerValid ? prefillAnswer : null}
          singleUseId={isSingleUseWorkflow ? singleUseId : undefined}
          singleUseResponse={singleUseResponse ? singleUseResponse : undefined}
          webAppUrl={WEBAPP_URL}
          responseCount={workflow.welcomeCard.showResponseCount ? responseCount : undefined}
        />
      </MediaBackground>
      <LegalFooter
        bgColor={workflow.styling?.background?.bg || "#ffff"}
        IMPRINT_URL={IMPRINT_URL}
        PRIVACY_URL={PRIVACY_URL}
      />
    </div>
  ) : null;
}
