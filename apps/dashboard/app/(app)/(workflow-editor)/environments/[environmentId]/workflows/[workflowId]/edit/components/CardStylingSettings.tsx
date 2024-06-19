"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { CheckIcon } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@typeflowai/lib/cn";
import { COLOR_DEFAULTS } from "@typeflowai/lib/styling/constants";
import { TProduct, TProductStyling } from "@typeflowai/types/product";
import { TWorkflowStyling, TWorkflowType } from "@typeflowai/types/workflows";
import { Badge } from "@typeflowai/ui/Badge";
import { CardArrangementTabs } from "@typeflowai/ui/CardArrangementTabs";
import { CardSizeTabs } from "@typeflowai/ui/CardSizeTabs";
import { ColorPicker } from "@typeflowai/ui/ColorPicker";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@typeflowai/ui/Form";
import { Slider } from "@typeflowai/ui/Slider";
import { Switch } from "@typeflowai/ui/Switch";

type CardStylingSettingsProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSettingsPage?: boolean;
  workflowType?: TWorkflowType;
  disabled?: boolean;
  product: TProduct;
  form: UseFormReturn<TProductStyling | TWorkflowStyling>;
};

export const CardStylingSettings = ({
  isSettingsPage = false,
  workflowType,
  disabled,
  open,
  product,
  setOpen,
  form,
}: CardStylingSettingsProps) => {
  const isAppWorkflow = workflowType === "app" || workflowType === "website";
  const workflowTypeDerived = isAppWorkflow ? "App / Website" : "Link";
  const isLogoVisible = !!product.logo?.url;

  const linkCardSize = form.watch("cardSize.linkWorkflows") ?? "small";
  const appCardSize = form.watch("cardSize.appWorkflows") ?? "small";
  const linkCardArrangement = form.watch("cardArrangement.linkWorkflows") ?? "simple";
  const appCardArrangement = form.watch("cardArrangement.appWorkflows") ?? "simple";
  const roundness = form.watch("roundness") ?? 8;

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(openState) => {
        if (disabled) return;
        setOpen(openState);
      }}
      className="w-full rounded-lg border border-slate-300 bg-white">
      <Collapsible.CollapsibleTrigger
        asChild
        disabled={disabled}
        className={cn(
          "w-full cursor-pointer rounded-lg hover:bg-slate-50",
          disabled && "cursor-not-allowed opacity-60 hover:bg-white"
        )}>
        <div className="inline-flex px-4 py-4">
          {!isSettingsPage && (
            <div className="flex items-center pl-2 pr-5">
              <CheckIcon
                strokeWidth={3}
                className="h-7 w-7 rounded-full border border-green-300 bg-green-100 p-1.5 text-green-600"
              />
            </div>
          )}

          <div>
            <p className={cn("font-semibold text-slate-800", isSettingsPage ? "text-sm" : "text-base")}>
              Card Styling
            </p>
            <p className={cn("mt-1 text-slate-500", isSettingsPage ? "text-xs" : "text-sm")}>
              Style the workflow card.
            </p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>

      <Collapsible.CollapsibleContent>
        <hr className="py-1 text-slate-600" />

        <div className="flex flex-col gap-6 p-6 pt-2">
          <div className="flex flex-col justify-center">
            <FormField
              control={form.control}
              name="roundness"
              render={() => (
                <FormItem>
                  <div>
                    <FormLabel>Roundness</FormLabel>
                    <FormDescription>Change the border radius of the card and the inputs.</FormDescription>
                  </div>

                  <FormControl>
                    <div className="rounded-lg border bg-slate-50 p-6">
                      <Slider
                        value={[roundness]}
                        max={22}
                        onValueChange={(value) => {
                          form.setValue("roundness", value[0]);
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cardBackgroundColor.light"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel>Card background color</FormLabel>
                  <FormDescription>Change the background color of the card.</FormDescription>
                </div>

                <FormControl>
                  <ColorPicker
                    color={field.value || COLOR_DEFAULTS.cardBackgroundColor}
                    onChange={(color) => field.onChange(color)}
                    containerClass="max-w-xs"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardBorderColor.light"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel>Card border color</FormLabel>
                  <FormDescription>Change the border color of the card.</FormDescription>
                </div>

                <FormControl>
                  <ColorPicker
                    color={field.value || COLOR_DEFAULTS.cardBorderColor}
                    onChange={(color) => field.onChange(color)}
                    containerClass="max-w-xs"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardShadowColor.light"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <div>
                  <FormLabel>Card shadow color</FormLabel>
                  <FormDescription>Change the shadow color of the card.</FormDescription>
                </div>

                <FormControl>
                  <ColorPicker
                    color={field.value || COLOR_DEFAULTS.cardShadowColor}
                    onChange={(color) => field.onChange(color)}
                    containerClass="max-w-xs"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"cardSize"}
            render={() => (
              <FormItem>
                <div>
                  <FormLabel>Card Size for {workflowTypeDerived} Workflows</FormLabel>

                  <FormDescription>
                    Which size do you want your cards in {workflowTypeDerived} Workflows
                  </FormDescription>
                </div>
                <FormControl>
                  <CardSizeTabs
                    key={isAppWorkflow ? "app" : "link"}
                    workflowType={isAppWorkflow ? "app" : "link"}
                    activeCardSize={isAppWorkflow ? appCardSize : linkCardSize}
                    setActiveCardSize={(value, type) => {
                      type === "app"
                        ? form.setValue("cardSize.appWorkflows", value)
                        : form.setValue("cardSize.linkWorkflows", value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"cardArrangement"}
            render={() => (
              <FormItem>
                <div>
                  <FormLabel>Card Arrangement for {workflowTypeDerived} Workflows</FormLabel>

                  <FormDescription>
                    How funky do you want your cards in {workflowTypeDerived} Workflows
                  </FormDescription>
                </div>
                <FormControl>
                  <CardArrangementTabs
                    key={isAppWorkflow ? "app" : "link"}
                    workflowType={isAppWorkflow ? "app" : "link"}
                    activeCardArrangement={isAppWorkflow ? appCardArrangement : linkCardArrangement}
                    setActiveCardArrangement={(value, type) => {
                      type === "app"
                        ? form.setValue("cardArrangement.appWorkflows", value)
                        : form.setValue("cardArrangement.linkWorkflows", value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-1">
            <FormField
              control={form.control}
              name="hideProgressBar"
              render={({ field }) => (
                <FormItem className="flex w-full items-center gap-2 space-y-0">
                  <FormControl>
                    <Switch
                      id="hideProgressBar"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>

                  <div>
                    <FormLabel>Hide progress bar</FormLabel>
                    <FormDescription>Disable the visibility of workflow progress.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {isLogoVisible && (!workflowType || workflowType === "link") && !isSettingsPage && (
            <div className="flex items-center space-x-1">
              <FormField
                control={form.control}
                name="isLogoHidden"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        id="isLogoHidden"
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>

                    <div>
                      <FormLabel>
                        Hide logo
                        <Badge text="Link Workflows" type="gray" size="normal" />
                      </FormLabel>
                      <FormDescription>Hides the logo in this specific workflow</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {(!workflowType || isAppWorkflow) && (
            <div className="flex max-w-xs flex-col gap-4">
              <div className="flex items-center space-x-1">
                <FormField
                  control={form.control}
                  name="highlightBorderColor"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-2 space-y-0">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            id="highlightBorderColor"
                            checked={!!field.value}
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                field.onChange(null);
                                return;
                              }

                              field.onChange({
                                light: COLOR_DEFAULTS.highlightBorderColor,
                              });
                            }}
                          />
                        </FormControl>

                        <div>
                          <FormLabel>Add highlight border</FormLabel>
                          <FormDescription className="text-xs font-normal text-slate-500">
                            Add an outer border to your workflow card.
                          </FormDescription>
                        </div>
                      </div>

                      {!!field.value && (
                        <FormControl>
                          <ColorPicker
                            color={field.value?.light ?? COLOR_DEFAULTS.highlightBorderColor}
                            onChange={(color: string) =>
                              field.onChange({
                                ...field.value,
                                light: color,
                              })
                            }
                            containerClass="my-0"
                          />
                        </FormControl>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
};
