"use client";

import Modal from "@/app/(app)/environments/[environmentId]/workflows/components/Modal";
import TabOption from "@/app/(app)/environments/[environmentId]/workflows/components/TabOption";
import { MediaBackground } from "@/app/s/[workflowId]/components/MediaBackground";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import { Variants, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { TEnvironment } from "@typeflowai/types/environment";
import type { TProduct } from "@typeflowai/types/product";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { WorkflowInline } from "@typeflowai/ui/Workflow";

type TPreviewType = "modal" | "fullwidth" | "email";

interface PreviewWorkflowProps {
  workflow: TWorkflow;
  webAppUrl: string;
  setActiveQuestionId: (id: string | null) => void;
  activeQuestionId?: string | null;
  previewType?: TPreviewType;
  product: TProduct;
  environment: TEnvironment;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
}

let workflowNameTemp;

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
export default function PreviewWorkflow({
  setActiveQuestionId,
  activeQuestionId,
  workflow,
  webAppUrl,
  previewType,
  product,
  environment,
  onFileUpload,
}: PreviewWorkflowProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [widgetSetupCompleted, setWidgetSetupCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [previewPosition, setPreviewPosition] = useState("relative");
  const ContentRef = useRef<HTMLDivElement | null>(null);
  const [shrink, setshrink] = useState(false);

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

  const {
    brandColor: workflowBrandColor,
    highlightBorderColor: workflowHighlightBorderColor,
    placement: workflowPlacement,
  } = productOverwrites || {};

  const brandColor = workflowBrandColor || product.brandColor;
  const placement = workflowPlacement || product.placement;
  const highlightBorderColor = workflowHighlightBorderColor || product.highlightBorderColor;

  useEffect(() => {
    // close modal if there are no questions left
    if (workflow.type === "web" && !workflow.thankYouCard.enabled) {
      if (activeQuestionId === "end") {
        setIsModalOpen(false);
        setTimeout(() => {
          setActiveQuestionId(workflow.questions[0]?.id);
          setIsModalOpen(true);
        }, 500);
      }
    }
  }, [activeQuestionId, workflow.type, workflow, setActiveQuestionId]);

  // this useEffect is fo refreshing the workflow preview only if user is switching between templates on workflow templates page and hence we are checking for workflow.id === "someUniqeId1" which is a common Id for all templates
  useEffect(() => {
    if (workflow.name !== workflowNameTemp && workflow.id === "someUniqueId1") {
      resetQuestionProgress();
      workflowNameTemp = workflow.name;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  function resetQuestionProgress() {
    let storePreviewMode = previewMode;
    setPreviewMode("null");
    setTimeout(() => {
      setPreviewMode(storePreviewMode);
    }, 10);

    setActiveQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id);
  }

  function animationTrigger() {
    let storePreviewMode = previewMode;
    setPreviewMode("null");
    setTimeout(() => {
      setPreviewMode(storePreviewMode);
    }, 10);
  }

  useEffect(() => {
    if (workflow.styling?.background?.bgType === "animation") {
      animationTrigger();
    }
  }, [workflow.styling?.background?.bg]);

  useEffect(() => {
    if (environment && environment.widgetSetupCompleted) {
      setWidgetSetupCompleted(true);
    } else {
      setWidgetSetupCompleted(false);
    }
  }, [environment]);

  if (!previewType) {
    previewType = widgetSetupCompleted ? "modal" : "fullwidth";

    if (!activeQuestionId) {
      return <></>;
    }
  }

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
        {previewMode === "mobile" && (
          <>
            <p className="absolute left-0 top-0 m-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-400">
              Preview
            </p>
            <div className="absolute right-0 top-0 m-2">
              <ResetProgressButton resetQuestionProgress={resetQuestionProgress} />
            </div>
            <MediaBackground workflow={workflow} ContentRef={ContentRef} isMobilePreview>
              {previewType === "modal" ? (
                <Modal
                  isOpen={isModalOpen}
                  placement={placement}
                  highlightBorderColor={highlightBorderColor}
                  previewMode="mobile">
                  <WorkflowInline
                    workflow={workflow}
                    webAppUrl={webAppUrl}
                    brandColor={brandColor}
                    activeQuestionId={activeQuestionId || undefined}
                    isBrandingEnabled={product.linkWorkflowBranding}
                    onActiveQuestionChange={setActiveQuestionId}
                    isRedirectDisabled={true}
                    onFileUpload={onFileUpload}
                    isPreview={true}
                  />
                </Modal>
              ) : (
                <div className="px-4">
                  <div className="no-scrollbar z-10 max-h-[500px] w-full max-w-md overflow-y-auto rounded-lg border border-transparent">
                    <WorkflowInline
                      workflow={workflow}
                      webAppUrl={webAppUrl}
                      brandColor={brandColor}
                      activeQuestionId={activeQuestionId || undefined}
                      isBrandingEnabled={product.linkWorkflowBranding}
                      onActiveQuestionChange={setActiveQuestionId}
                      onFileUpload={onFileUpload}
                      responseCount={42}
                      isPreview={true}
                    />
                  </div>
                </div>
              )}
            </MediaBackground>
          </>
        )}
        {previewMode === "desktop" && (
          <div className="flex h-full w-5/6 flex-1 flex-col">
            <div className="flex h-8 w-full items-center rounded-t-lg bg-slate-100">
              <div className="ml-6 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              </div>
              <p className="ml-4 flex w-full justify-between font-mono text-sm text-slate-400">
                {previewType === "modal" ? "Your web app" : "Preview"}
                <div className="flex items-center">
                  {isFullScreenPreview ? (
                    <ArrowsPointingInIcon
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => {
                        setshrink(true);
                        setPreviewPosition("relative");
                        setTimeout(() => setIsFullScreenPreview(false), 300);
                      }}
                    />
                  ) : (
                    <ArrowsPointingOutIcon
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => {
                        setshrink(false);
                        setIsFullScreenPreview(true);
                        setTimeout(() => setPreviewPosition("fixed"), 300);
                      }}
                    />
                  )}
                  <ResetProgressButton resetQuestionProgress={resetQuestionProgress} />
                </div>
              </p>
            </div>

            {previewType === "modal" ? (
              <Modal
                isOpen={isModalOpen}
                placement={placement}
                highlightBorderColor={highlightBorderColor}
                previewMode="desktop">
                <WorkflowInline
                  workflow={workflow}
                  webAppUrl={webAppUrl}
                  brandColor={brandColor}
                  activeQuestionId={activeQuestionId || undefined}
                  isBrandingEnabled={product.linkWorkflowBranding}
                  onActiveQuestionChange={setActiveQuestionId}
                  isRedirectDisabled={true}
                  onFileUpload={onFileUpload}
                  isPreview={true}
                />
              </Modal>
            ) : (
              <MediaBackground workflow={workflow} ContentRef={ContentRef} isEditorView>
                <div className="z-0 w-full  max-w-md rounded-lg p-4">
                  <WorkflowInline
                    workflow={workflow}
                    webAppUrl={webAppUrl}
                    brandColor={brandColor}
                    activeQuestionId={activeQuestionId || undefined}
                    isBrandingEnabled={product.linkWorkflowBranding}
                    onActiveQuestionChange={setActiveQuestionId}
                    isRedirectDisabled={true}
                    onFileUpload={onFileUpload}
                    responseCount={42}
                    isPreview={true}
                  />
                </div>
              </MediaBackground>
            )}
          </div>
        )}
      </motion.div>

      {/* for toggling between mobile and desktop mode  */}
      <div className="mt-2 flex rounded-full border-2 border-slate-300 p-1">
        <TabOption
          active={previewMode === "mobile"}
          icon={<DevicePhoneMobileIcon className="mx-4 my-2 h-4 w-4 text-slate-700" />}
          onClick={() => setPreviewMode("mobile")}
        />
        <TabOption
          active={previewMode === "desktop"}
          icon={<ComputerDesktopIcon className="mx-4 my-2 h-4 w-4 text-slate-700" />}
          onClick={() => setPreviewMode("desktop")}
        />
      </div>
    </div>
  );
}

function ResetProgressButton({ resetQuestionProgress }) {
  return (
    <Button
      variant="minimal"
      className="py-0.2 mr-2 bg-white px-2 font-sans text-sm text-slate-500"
      onClick={resetQuestionProgress}>
      Restart
      <ArrowPathRoundedSquareIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
