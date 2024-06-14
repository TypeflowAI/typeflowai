"use client";

import { BackgroundStylingCard } from "@/app/(app)/(workflow-editor)/environments/[environmentId]/workflows/[workflowId]/edit/components/BackgroundStylingCard";
import { CardStylingSettings } from "@/app/(app)/(workflow-editor)/environments/[environmentId]/workflows/[workflowId]/edit/components/CardStylingSettings";
import { FormStylingSettings } from "@/app/(app)/(workflow-editor)/environments/[environmentId]/workflows/[workflowId]/edit/components/FormStylingSettings";
import { ThemeStylingPreviewWorkflow } from "@/app/(app)/environments/[environmentId]/product/look/components/ThemeStylingPreviewWorkflow";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { COLOR_DEFAULTS, PREVIEW_SURVEY } from "@typeflowai/lib/styling/constants";
import { TProduct, TProductStyling, ZProductStyling } from "@typeflowai/types/product";
import { TWorkflow, TWorkflowStyling, TWorkflowType } from "@typeflowai/types/workflows";
import { AlertDialog } from "@typeflowai/ui/AlertDialog";
import { Button } from "@typeflowai/ui/Button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormProvider,
} from "@typeflowai/ui/Form";
import { Switch } from "@typeflowai/ui/Switch";

import { updateProductAction } from "../actions";

type ThemeStylingProps = {
  product: TProduct;
  environmentId: string;
  colors: string[];
  isUnsplashConfigured: boolean;
};

export const ThemeStyling = ({ product, environmentId, colors, isUnsplashConfigured }: ThemeStylingProps) => {
  const router = useRouter();

  const form = useForm<TProductStyling>({
    defaultValues: {
      ...product.styling,

      // specify the default values for the colors
      allowStyleOverwrite: product.styling.allowStyleOverwrite ?? true,
      brandColor: { light: product.styling.brandColor?.light ?? COLOR_DEFAULTS.brandColor },
      questionColor: { light: product.styling.questionColor?.light ?? COLOR_DEFAULTS.questionColor },
      inputColor: { light: product.styling.inputColor?.light ?? COLOR_DEFAULTS.inputColor },
      inputBorderColor: { light: product.styling.inputBorderColor?.light ?? COLOR_DEFAULTS.inputBorderColor },
      cardBackgroundColor: {
        light: product.styling.cardBackgroundColor?.light ?? COLOR_DEFAULTS.cardBackgroundColor,
      },
      cardBorderColor: { light: product.styling.cardBorderColor?.light ?? COLOR_DEFAULTS.cardBorderColor },
      cardShadowColor: { light: product.styling.cardShadowColor?.light ?? COLOR_DEFAULTS.cardShadowColor },
      highlightBorderColor: product.styling.highlightBorderColor?.light
        ? {
            light: product.styling.highlightBorderColor.light,
          }
        : undefined,
      isDarkModeEnabled: product.styling.isDarkModeEnabled ?? false,
      roundness: product.styling.roundness ?? 8,
      cardArrangement: product.styling.cardArrangement ?? {
        linkWorkflows: "simple",
        appWorkflows: "simple",
      },
      background: product.styling.background,
      hideProgressBar: product.styling.hideProgressBar ?? false,
      isLogoHidden: product.styling.isLogoHidden ?? false,
    },
    resolver: zodResolver(ZProductStyling),
  });

  const [previewWorkflowType, setPreviewWorkflowType] = useState<TWorkflowType>("link");
  const [confirmResetStylingModalOpen, setConfirmResetStylingModalOpen] = useState(false);

  const [formStylingOpen, setFormStylingOpen] = useState(false);
  const [cardStylingOpen, setCardStylingOpen] = useState(false);
  const [backgroundStylingOpen, setBackgroundStylingOpen] = useState(false);

  const onReset = useCallback(async () => {
    const defaultStyling: TProductStyling = {
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
      isLogoHidden: false,
      highlightBorderColor: undefined,
      isDarkModeEnabled: false,
      background: {
        bg: "#fff",
        bgType: "color",
      },
      roundness: 8,
      cardArrangement: {
        linkWorkflows: "simple",
        appWorkflows: "simple",
      },
    };

    await updateProductAction(product.id, {
      styling: { ...defaultStyling },
    });

    form.reset({ ...defaultStyling });

    toast.success("Styling updated successfully.");
    router.refresh();
  }, [form, product.id, router]);

  const onSubmit: SubmitHandler<TProductStyling> = async (data) => {
    try {
      const updatedProduct = await updateProductAction(product.id, {
        styling: data,
      });

      form.reset({ ...updatedProduct.styling });
      toast.success("Styling updated successfully.");
    } catch (err) {
      toast.error("Error updating styling.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex">
          {/* Styling settings */}
          <div className="relative flex w-1/2 flex-col pr-6">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
                <div className="flex items-center gap-6">
                  <FormField
                    control={form.control}
                    name="allowStyleOverwrite"
                    render={({ field }) => (
                      <FormItem className="flex w-full items-center gap-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                            }}
                          />
                        </FormControl>

                        <div>
                          <FormLabel>Enable custom styling</FormLabel>
                          <FormDescription>
                            Allow users to override this theme in the workflow editor.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4">
                <FormStylingSettings
                  open={formStylingOpen}
                  setOpen={setFormStylingOpen}
                  isSettingsPage
                  form={form as UseFormReturn<TProductStyling | TWorkflowStyling>}
                />

                <CardStylingSettings
                  open={cardStylingOpen}
                  setOpen={setCardStylingOpen}
                  isSettingsPage
                  product={product}
                  workflowType={previewWorkflowType}
                  form={form as UseFormReturn<TProductStyling | TWorkflowStyling>}
                />

                <BackgroundStylingCard
                  open={backgroundStylingOpen}
                  setOpen={setBackgroundStylingOpen}
                  environmentId={environmentId}
                  colors={colors}
                  key={form.watch("background.bg")}
                  isSettingsPage
                  isUnsplashConfigured={isUnsplashConfigured}
                  form={form as UseFormReturn<TProductStyling | TWorkflowStyling>}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="darkCTA" size="sm" type="submit">
                Save
              </Button>
              <Button
                type="button"
                size="sm"
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
            <div className="sticky top-4 mb-4 h-[600px]">
              <ThemeStylingPreviewWorkflow
                setQuestionId={(_id: string) => {}}
                workflow={PREVIEW_SURVEY as TWorkflow}
                product={{
                  ...product,
                  styling: form.getValues(),
                }}
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
      </form>
    </FormProvider>
  );
};
