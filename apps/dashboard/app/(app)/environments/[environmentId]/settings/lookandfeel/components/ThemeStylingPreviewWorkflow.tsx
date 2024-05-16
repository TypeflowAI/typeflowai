"use client";

import Modal from "@/app/(app)/environments/[environmentId]/workflows/components/Modal";
import { MediaBackground } from "@/app/s/[workflowId]/components/MediaBackground";
import { Variants, motion } from "framer-motion";
import { useRef, useState } from "react";

import type { TProduct } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowType } from "@typeflowai/types/workflows";
import { ClientLogo } from "@typeflowai/ui/ClientLogo";
import { ResetProgressButton } from "@typeflowai/ui/ResetProgressButton";
import { WorkflowInline } from "@typeflowai/ui/Workflow";

interface ThemeStylingPreviewWorkflowProps {
  workflow: TWorkflow;
  setQuestionId: (_: string) => void;
  product: TProduct;
  webAppUrl: string;
  previewType: TWorkflowType;
  setPreviewType: (type: TWorkflowType) => void;
}

const previewParentContainerVariant: Variants = {
  expanded: {
    position: "fixed",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(15px)",
    left: 0,
    top: 0,
    zIndex: 1040,
    transition: {
      ease: "easeIn",
      duration: 0.001,
    },
  },
  shrink: {
    display: "none",
    position: "fixed",
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0,
    },
    zIndex: -1,
  },
};

export const ThemeStylingPreviewWorkflow = ({
  workflow,
  product,
  webAppUrl,
  previewType,
  setPreviewType,
  setQuestionId,
}: ThemeStylingPreviewWorkflowProps) => {
  const [isFullScreenPreview] = useState(false);
  const [previewPosition] = useState("relative");
  const ContentRef = useRef<HTMLDivElement | null>(null);
  const [shrink] = useState(false);

  const { productOverwrites } = workflow || {};

  const previewScreenVariants: Variants = {
    expanded: {
      right: "5%",
      bottom: "10%",
      top: "12%",
      width: "40%",
      position: "fixed",
      height: "80%",
      zIndex: 1050,
      boxShadow: "0px 4px 5px 4px rgba(169, 169, 169, 0.25)",
      transition: {
        ease: "easeInOut",
        duration: shrink ? 0.3 : 0,
      },
    },
    expanded_with_fixed_positioning: {
      zIndex: 1050,
      position: "fixed",
      top: "5%",
      right: "5%",
      bottom: "10%",
      width: "90%",
      height: "90%",
      transition: {
        ease: "easeOut",
        duration: 0.4,
      },
    },
    shrink: {
      display: "relative",
      width: ["83.33%"],
      height: ["95%"],
    },
  };

  const { placement: workflowPlacement } = productOverwrites || {};
  const { darkOverlay: workflowDarkOverlay } = productOverwrites || {};
  const { clickOutsideClose: workflowClickOutsideClose } = productOverwrites || {};

  const placement = workflowPlacement || product.placement;
  const darkOverlay = workflowDarkOverlay ?? product.darkOverlay;
  const clickOutsideClose = workflowClickOutsideClose ?? product.clickOutsideClose;

  const highlightBorderColor = product.styling.highlightBorderColor?.light;

  function resetQuestionProgress() {
    setQuestionId(workflow?.questions[0]?.id);
  }

  const onFileUpload = async (file: File) => file.name;

  const isAppWorkflow = previewType === "app" || previewType === "website";

  const scrollToEditLogoSection = () => {
    const editLogoSection = document.getElementById("edit-logo");
    if (editLogoSection) {
      editLogoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-items-center">
      <motion.div
        variants={previewParentContainerVariant}
        className="fixed hidden h-[95%] w-5/6"
        animate={isFullScreenPreview ? "expanded" : "shrink"}
      />
      <motion.div
        layout
        variants={previewScreenVariants}
        animate={
          isFullScreenPreview
            ? previewPosition === "relative"
              ? "expanded"
              : "expanded_with_fixed_positioning"
            : "shrink"
        }
        className="relative flex h-[95] max-h-[95%] w-5/6 items-center justify-center rounded-lg border border-slate-300 bg-slate-200">
        <div className="flex h-full w-5/6 flex-1 flex-col">
          <div className="flex h-8 w-full items-center rounded-t-lg bg-slate-100">
            <div className="ml-6 flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            </div>
            <div className="ml-4 flex w-full justify-between font-mono text-sm text-slate-400">
              <p>{isAppWorkflow ? "Your web app" : "Preview"}</p>

              <div className="flex items-center">
                <ResetProgressButton onClick={resetQuestionProgress} />
              </div>
            </div>
          </div>

          {isAppWorkflow ? (
            <Modal
              isOpen
              placement={placement}
              highlightBorderColor={highlightBorderColor}
              clickOutsideClose={clickOutsideClose}
              darkOverlay={darkOverlay}
              previewMode="desktop"
              background={product.styling.cardBackgroundColor?.light}
              borderRadius={product.styling.roundness ?? 8}>
              <WorkflowInline
                workflow={workflow}
                webAppUrl={webAppUrl}
                isBrandingEnabled={product.inAppWorkflowBranding}
                isRedirectDisabled={true}
                onFileUpload={onFileUpload}
                styling={product.styling}
                isCardBorderVisible={!highlightBorderColor}
                languageCode="default"
                getSetQuestionId={(f: (value: string) => void) => {
                  setQuestionId = f;
                }}
              />
            </Modal>
          ) : (
            <MediaBackground workflow={workflow} product={product} ContentRef={ContentRef} isEditorView>
              {!product.styling?.isLogoHidden && (
                <div className="absolute left-5 top-5" onClick={scrollToEditLogoSection}>
                  <ClientLogo product={product} previewWorkflow />
                </div>
              )}
              <div
                className={`${product.logo?.url && !product.styling.isLogoHidden && !isFullScreenPreview ? "mt-12" : ""} z-0  w-full max-w-md rounded-lg p-4`}>
                <WorkflowInline
                  workflow={workflow}
                  webAppUrl={webAppUrl}
                  isBrandingEnabled={product.linkWorkflowBranding}
                  isRedirectDisabled={true}
                  onFileUpload={onFileUpload}
                  responseCount={42}
                  styling={product.styling}
                  languageCode="default"
                  getSetQuestionId={(f: (value: string) => void) => {
                    setQuestionId = f;
                  }}
                />
              </div>
            </MediaBackground>
          )}
        </div>
      </motion.div>

      {/* for toggling between mobile and desktop mode  */}
      <div className="mt-2 flex rounded-full border-2 border-slate-300 p-1">
        <div
          className={`${previewType === "link" ? "rounded-full bg-slate-200" : ""} cursor-pointer px-3 py-1 text-sm`}
          onClick={() => setPreviewType("link")}>
          Link workflow
        </div>

        <div
          className={`${isAppWorkflow ? "rounded-full bg-slate-200" : ""} cursor-pointer px-3 py-1 text-sm`}
          onClick={() => setPreviewType("app")}>
          App workflow
        </div>
      </div>
    </div>
  );
};
