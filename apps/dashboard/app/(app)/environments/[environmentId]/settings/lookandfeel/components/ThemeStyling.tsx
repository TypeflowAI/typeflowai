"use client";

import { ThemeStylingPreviewWorkflow } from "@/app/(app)/environments/[environmentId]/settings/lookandfeel/components/ThemeStylingPreviewWorkflow";
import BackgroundStylingCard from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/BackgroundStylingCard";
import CardStylingSettings from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/CardStylingSettings";
import FormStylingSettings from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/components/FormStylingSettings";
import { RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { COLOR_DEFAULTS, PREVIEW_WORKFLOW } from "@typeflowai/lib/styling/constants";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowType } from "@typeflowai/types/workflows";
import { AlertDialog } from "@typeflowai/ui/AlertDialog";
import { Button } from "@typeflowai/ui/Button";
import { Switch } from "@typeflowai/ui/Switch";

import { updateProductAction } from "../actions";

let setQuestionId = (_: string) => {};

type ThemeStylingProps = {
  product: TProduct;
  environmentId: string;
  webAppUrl: string;
  colors: string[];
  isUnsplashConfigured: boolean;
};

export const ThemeStyling = ({
  product,
  environmentId,
  webAppUrl,
  colors,
  isUnsplashConfigured,
}: ThemeStylingProps) => {
  const router = useRouter();
  const [localProduct, setLocalProduct] = useState(product);
  const [previewWorkflowType, setPreviewWorkflowType] = useState<TWorkflowType>("link");
  const [confirmResetStylingModalOpen, setConfirmResetStylingModalOpen] = useState(false);

  const [styling, setStyling] = useState(product.styling);

  const [formStylingOpen, setFormStylingOpen] = useState(false);
  const [cardStylingOpen, setCardStylingOpen] = useState(false);
  const [backgroundStylingOpen, setBackgroundStylingOpen] = useState(false);

  const allowStyleOverwrite = localProduct.styling.allowStyleOverwrite ?? false;
  const setAllowStyleOverwrite = (value: boolean) => {
    setLocalProduct((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        allowStyleOverwrite: value,
      },
    }));
  };

  const [styledPreviewWorkflow, setStyledPreviewWorkflow] = useState<TWorkflow>(PREVIEW_WORKFLOW);

  useEffect(() => {
    setQuestionId(PREVIEW_WORKFLOW.questions[0].id);
  }, []);

  useEffect(() => {
    // sync the local product with the product prop
    // TODO: this is not ideal, we should find a better way to do this.
    setLocalProduct(product);
  }, [product]);

  const onSave = useCallback(async () => {
    await updateProductAction(product.id, {
      styling: localProduct.styling,
    });

    toast.success("Styling updated successfully.");
    router.refresh();
  }, [localProduct, product.id, router]);

  const onReset = useCallback(async () => {
    await updateProductAction(product.id, {
      styling: {
        allowStyleOverwrite: true,
        brandColor: {
          light: COLOR_DEFAULTS.brandColor,
        },
        questionColor: {
          light: COLOR_DEFAULTS.questionColor,
        },
        inputColor: {
          light: COLOR_DEFAULTS.inputColor,
        },
        inputBorderColor: {
          light: COLOR_DEFAULTS.inputBorderColor,
        },
        cardBackgroundColor: {
          light: COLOR_DEFAULTS.cardBackgroundColor,
        },
        cardBorderColor: {
          light: COLOR_DEFAULTS.cardBorderColor,
        },
        isLogoHidden: undefined,
        highlightBorderColor: undefined,
        isDarkModeEnabled: false,
        roundness: 8,
        cardArrangement: {
          linkWorkflows: "simple",
          appWorkflows: "simple",
        },
      },
    });

    setAllowStyleOverwrite(true);

    setStyling({
      allowStyleOverwrite: true,
      brandColor: {
        light: COLOR_DEFAULTS.brandColor,
      },
      questionColor: {
        light: COLOR_DEFAULTS.questionColor,
      },
      inputColor: {
        light: COLOR_DEFAULTS.inputColor,
      },
      inputBorderColor: {
        light: COLOR_DEFAULTS.inputBorderColor,
      },
      cardBackgroundColor: {
        light: COLOR_DEFAULTS.cardBackgroundColor,
      },
      cardBorderColor: {
        light: COLOR_DEFAULTS.cardBorderColor,
      },
      isLogoHidden: undefined,
      highlightBorderColor: undefined,
      isDarkModeEnabled: false,
      roundness: 8,
      cardArrangement: {
        linkWorkflows: "simple",
        appWorkflows: "simple",
      },
    });

    // Update the background of the PREVIEW WORKFLOW
    setStyledPreviewWorkflow((currentWorkflow) => ({
      ...currentWorkflow,
      styling: {
        ...currentWorkflow.styling,
        background: {
          ...(currentWorkflow.styling?.background ?? {}),
          bg: "#ffffff",
          bgType: "color",
        },
      },
    }));

    toast.success("Styling updated successfully.");
    router.refresh();
  }, [product.id, router]);

  useEffect(() => {
    setLocalProduct((prev) => ({
      ...prev,
      styling: {
        ...styling,
        allowStyleOverwrite,
      },
    }));
  }, [allowStyleOverwrite, styling]);

  return (
    <div className="flex">
      {/* Styling settings */}
      <div className="w-1/2 pr-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-6">
              <Switch
                checked={allowStyleOverwrite}
                onCheckedChange={(value) => {
                  setAllowStyleOverwrite(value);
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-slate-700">Enable custom styling</h3>
                <p className="text-xs text-slate-500">
                  Allow users to override this theme in the workflow editor.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
            <FormStylingSettings
              open={formStylingOpen}
              setOpen={setFormStylingOpen}
              styling={styling}
              setStyling={setStyling}
              isSettingsPage
            />

            <CardStylingSettings
              open={cardStylingOpen}
              setOpen={setCardStylingOpen}
              styling={styling}
              setStyling={setStyling}
              isSettingsPage
              localProduct={localProduct}
            />

            <BackgroundStylingCard
              open={backgroundStylingOpen}
              setOpen={setBackgroundStylingOpen}
              styling={styling}
              setStyling={setStyling}
              environmentId={environmentId}
              colors={colors}
              key={styling.background?.bg}
              isSettingsPage
              isUnsplashConfigured={isUnsplashConfigured}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2">
          <Button variant="darkCTA" onClick={onSave}>
            Save
          </Button>
          <Button
            variant="minimal"
            className="flex items-center gap-2"
            onClick={() => setConfirmResetStylingModalOpen(true)}>
            Reset to default
            <RotateCcwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Workflow Preview */}

      <div className="relative w-1/2 rounded-lg bg-slate-100 pt-4">
        <div className="sticky top-4 mb-4 h-full max-h-[600px]">
          <ThemeStylingPreviewWorkflow
            setQuestionId={setQuestionId}
            workflow={styledPreviewWorkflow as TWorkflow}
            product={localProduct}
            webAppUrl={webAppUrl}
            previewType={previewWorkflowType}
            setPreviewType={setPreviewWorkflowType}
          />
        </div>
      </div>

      {/* Confirm reset styling modal */}
      <AlertDialog
        open={confirmResetStylingModalOpen}
        setOpen={setConfirmResetStylingModalOpen}
        headerText="Reset styling"
        mainText="Are you sure you want to reset the styling to default?"
        confirmBtnLabel="Confirm"
        onConfirm={() => {
          onReset();
          setConfirmResetStylingModalOpen(false);
        }}
        onDecline={() => setConfirmResetStylingModalOpen(false)}
      />
    </div>
  );
};
