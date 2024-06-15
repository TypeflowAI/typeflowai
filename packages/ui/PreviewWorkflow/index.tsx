"use client";

import { Variants, motion } from "framer-motion";
import { ExpandIcon, MonitorIcon, ShrinkIcon, SmartphoneIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TEnvironment } from "@typeflowai/types/environment";
import type { TProduct } from "@typeflowai/types/product";
import { TProductStyling } from "@typeflowai/types/product";
import { TUploadFileConfig } from "@typeflowai/types/storage";
import { TWorkflow, TWorkflowStyling } from "@typeflowai/types/workflows";
import { ClientLogo } from "../ClientLogo";
import { MediaBackground } from "../MediaBackground";
import { ResetProgressButton } from "../ResetProgressButton";
import { WorkflowInline } from "../Workflow";
import { Modal } from "./components/Modal";
import { TabOption } from "./components/TabOption";

type TPreviewType = "modal" | "fullwidth" | "email";

interface PreviewWorkflowProps {
  workflow: TWorkflow;
  webAppUrl: string;
  questionId?: string | null;
  previewType?: TPreviewType;
  product: TProduct;
  environment: TEnvironment;
  languageCode: string;
  onFileUpload: (file: File, config?: TUploadFileConfig) => Promise<string>;
}

let workflowNameTemp: string;

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

let setQuestionId = (_: string) => {};

export const PreviewWorkflow = ({
  questionId,
  workflow,
  webAppUrl,
  previewType,
  product,
  environment,
  languageCode,
  onFileUpload,
}: PreviewWorkflowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [widgetSetupCompleted, setWidgetSetupCompleted] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [previewPosition, setPreviewPosition] = useState("relative");
  const ContentRef = useRef<HTMLDivElement | null>(null);
  const [shrink, setShrink] = useState(false);
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

  const styling: TWorkflowStyling | TProductStyling = useMemo(() => {
    // allow style overwrite is disabled from the product
    if (!product.styling.allowStyleOverwrite) {
      return product.styling;
    }

    // allow style overwrite is enabled from the product
    if (product.styling.allowStyleOverwrite) {
      // workflow style overwrite is disabled
      if (!workflow.styling?.overwriteThemeStyling) {
        return product.styling;
      }

      // workflow style overwrite is enabled
      return workflow.styling;
    }

    return product.styling;
  }, [product.styling, workflow.styling]);

  const updateQuestionId = useCallback(
    (newQuestionId: string) => {
      if (!newQuestionId || newQuestionId === "hidden" || newQuestionId === "multiLanguage") return;
      if (newQuestionId === "start" && !workflow.welcomeCard.enabled) return;
      setQuestionId(newQuestionId);
    },
    [workflow.welcomeCard.enabled]
  );

  useEffect(() => {
    if (questionId) {
      updateQuestionId(questionId);
    }
  }, [questionId, updateQuestionId]);

  const onFinished = () => {
    // close modal if there are no questions left
    if ((workflow.type === "website" || workflow.type === "app") && !workflow.thankYouCard.enabled) {
      setIsModalOpen(false);
      setTimeout(() => {
        setQuestionId(workflow.questions[0]?.id);
        setIsModalOpen(true);
      }, 500);
    }
  };

  // this useEffect is for refreshing the workflow preview only if user is switching between templates on workflow templates page and hence we are checking for workflow.id === "someUniqeId1" which is a common Id for all templates
  useEffect(() => {
    if (workflow.name !== workflowNameTemp && workflow.id === "someUniqueId1") {
      resetQuestionProgress();
      workflowNameTemp = workflow.name;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const resetQuestionProgress = () => {
    let storePreviewMode = previewMode;
    setPreviewMode("null");
    setTimeout(() => {
      setPreviewMode(storePreviewMode);
    }, 10);

    setQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id);
  };

  useEffect(() => {
    if (environment && environment.widgetSetupCompleted) {
      setWidgetSetupCompleted(true);
    } else {
      setWidgetSetupCompleted(false);
    }
  }, [environment]);

  const handlePreviewModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setQuestionId(workflow.welcomeCard.enabled ? "start" : workflow?.questions[0]?.id);
      setIsModalOpen(true);
    }, 1000);
  };

  if (!previewType) {
    previewType = widgetSetupCompleted ? "modal" : "fullwidth";

    if (!questionId) {
      return <></>;
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-items-center" id="workflow-preview">
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
        className="relative flex h-[95%] max-h-[95%] w-5/6 items-center justify-center rounded-lg border border-slate-300 bg-slate-200">
        {previewMode === "mobile" && (
          <>
            <p className="absolute left-0 top-0 m-2 rounded bg-slate-100 px-2 py-1 text-xs text-slate-400">
              Preview
            </p>
            <div className="absolute right-0 top-0 m-2">
              <ResetProgressButton onClick={resetQuestionProgress} />
            </div>
            <MediaBackground workflow={workflow} product={product} ContentRef={ContentRef} isMobilePreview>
              {previewType === "modal" ? (
                <Modal
                  isOpen={isModalOpen}
                  placement={placement}
                  previewMode="mobile"
                  darkOverlay={darkOverlay}
                  clickOutsideClose={clickOutsideClose}
                  borderRadius={styling?.roundness ?? 8}
                  background={styling?.cardBackgroundColor?.light}>
                  <WorkflowInline
                    workflow={workflow}
                    webAppUrl={webAppUrl}
                    isBrandingEnabled={product.inAppWorkflowBranding}
                    isRedirectDisabled={true}
                    languageCode={languageCode}
                    onFileUpload={onFileUpload}
                    isPreview={true}
                    styling={styling}
                    isCardBorderVisible={!styling.highlightBorderColor?.light}
                    onClose={handlePreviewModalClose}
                    getSetQuestionId={(f: (value: string) => void) => {
                      setQuestionId = f;
                    }}
                    onFinished={onFinished}
                  />
                </Modal>
              ) : (
                <div className="flex h-full w-full flex-col justify-end">
                  <div className="absolute left-5 top-5">
                    {!styling.isLogoHidden && (
                      <ClientLogo environmentId={environment.id} product={product} previewWorkflow />
                    )}
                  </div>
                  <div className=" z-10 w-full max-w-md rounded-lg border border-transparent">
                    <WorkflowInline
                      workflow={{ ...workflow, type: "link" }}
                      webAppUrl={webAppUrl}
                      isBrandingEnabled={product.linkWorkflowBranding}
                      onFileUpload={onFileUpload}
                      languageCode={languageCode}
                      responseCount={42}
                      isPreview={true}
                      styling={styling}
                      getSetQuestionId={(f: (value: string) => void) => {
                        setQuestionId = f;
                      }}
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
              <div className="ml-4 flex w-full justify-between font-mono text-sm text-slate-400">
                <p>{previewType === "modal" ? "Your web app" : "Preview"}</p>

                <div className="flex items-center">
                  {isFullScreenPreview ? (
                    <ShrinkIcon
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => {
                        setShrink(true);
                        setPreviewPosition("relative");
                        setTimeout(() => setIsFullScreenPreview(false), 300);
                      }}
                    />
                  ) : (
                    <ExpandIcon
                      className="mr-2 h-4 w-4 cursor-pointer"
                      onClick={() => {
                        setShrink(false);
                        setIsFullScreenPreview(true);
                        setTimeout(() => setPreviewPosition("fixed"), 300);
                      }}
                    />
                  )}
                  <ResetProgressButton onClick={resetQuestionProgress} />
                </div>
              </div>
            </div>

            {previewType === "modal" ? (
              <Modal
                isOpen={isModalOpen}
                placement={placement}
                clickOutsideClose={clickOutsideClose}
                darkOverlay={darkOverlay}
                previewMode="desktop"
                borderRadius={styling.roundness ?? 8}
                background={styling.cardBackgroundColor?.light}>
                <WorkflowInline
                  workflow={workflow}
                  webAppUrl={webAppUrl}
                  isBrandingEnabled={product.inAppWorkflowBranding}
                  isRedirectDisabled={true}
                  languageCode={languageCode}
                  onFileUpload={onFileUpload}
                  isPreview={true}
                  styling={styling}
                  isCardBorderVisible={!styling.highlightBorderColor?.light}
                  onClose={handlePreviewModalClose}
                  getSetQuestionId={(f: (value: string) => void) => {
                    setQuestionId = f;
                  }}
                  onFinished={onFinished}
                />
              </Modal>
            ) : (
              <MediaBackground workflow={workflow} product={product} ContentRef={ContentRef} isEditorView>
                <div className="absolute left-5 top-5">
                  {!styling.isLogoHidden && (
                    <ClientLogo environmentId={environment.id} product={product} previewWorkflow />
                  )}
                </div>
                <div className="z-0 w-full max-w-md rounded-lg border-transparent">
                  <WorkflowInline
                    workflow={{ ...workflow, type: "link" }}
                    webAppUrl={webAppUrl}
                    isBrandingEnabled={product.linkWorkflowBranding}
                    isRedirectDisabled={true}
                    onFileUpload={onFileUpload}
                    languageCode={languageCode}
                    responseCount={42}
                    isPreview={true}
                    styling={styling}
                    getSetQuestionId={(f: (value: string) => void) => {
                      setQuestionId = f;
                    }}
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
          icon={<SmartphoneIcon className="mx-4 my-2 h-4 w-4 text-slate-700" />}
          onClick={() => setPreviewMode("mobile")}
        />
        <TabOption
          active={previewMode === "desktop"}
          icon={<MonitorIcon className="mx-4 my-2 h-4 w-4 text-slate-700" />}
          onClick={() => setPreviewMode("desktop")}
        />
      </div>
    </div>
  );
};
