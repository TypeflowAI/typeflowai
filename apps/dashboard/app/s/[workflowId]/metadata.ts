import { Metadata } from "next";
import { notFound } from "next/navigation";

import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { COLOR_DEFAULTS } from "@typeflowai/lib/styling/constants";
import { getWorkflow } from "@typeflowai/lib/workflow/service";

export const getMetadataForLinkWorkflow = async (workflowId: string): Promise<Metadata> => {
  const workflow = await getWorkflow(workflowId);

  if (!workflow || workflow.type !== "link" || workflow.status === "draft") {
    notFound();
  }

  const product = await getProductByEnvironmentId(workflow.environmentId);

  if (!product) {
    throw new Error("Product not found");
  }

  const brandColor = getBrandColorForURL(workflow.styling?.brandColor?.light || COLOR_DEFAULTS.brandColor);
  const workflowName = getNameForURL(workflow.name);

  const ogImgURL = `/api/v1/og?brandColor=${brandColor}&name=${workflowName}`;

  return {
    title: workflow.name,
    metadataBase: new URL(WEBAPP_URL),
    openGraph: {
      title: workflow.name,
      description: "Thanks a lot for your time 🙏",
      url: `/s/${workflow.id}`,
      siteName: "",
      images: [ogImgURL],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: workflow.name,
      description: "Thanks a lot for your time 🙏",
      images: [ogImgURL],
    },
  };
};

const getNameForURL = (url: string) => url.replace(/ /g, "%20");

const getBrandColorForURL = (url: string) => url.replace(/#/g, "%23");
