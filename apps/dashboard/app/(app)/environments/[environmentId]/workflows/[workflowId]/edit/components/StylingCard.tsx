"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";

import { TPlacement } from "@typeflowai/types/common";
import { TWorkflow, TWorkflowBackgroundBgType } from "@typeflowai/types/workflows";
import { ColorPicker } from "@typeflowai/ui/ColorPicker";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

import Placement from "./Placement";
import WorkflowBgSelectorTab from "./WorkflowBgSelectorTab";

interface StylingCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: React.Dispatch<React.SetStateAction<TWorkflow>>;
  colours: string[];
}

export default function StylingCard({ localWorkflow, setLocalWorkflow, colours }: StylingCardProps) {
  const [open, setOpen] = useState(false);
  const progressBarHidden = localWorkflow.styling?.hideProgressBar ?? false;
  const { type, productOverwrites, styling } = localWorkflow;
  const { brandColor, clickOutsideClose, darkOverlay, placement, highlightBorderColor } =
    productOverwrites ?? {};
  const { bg, bgType, brightness } = styling?.background ?? {};

  const [inputValue, setInputValue] = useState(100);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    handleBrightnessChange(parseInt(e.target.value));
  };

  const togglePlacement = () => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        placement: !!placement ? null : "bottomRight",
        clickOutsideClose: false,
        darkOverlay: false,
      },
    });
  };

  const toggleBrandColor = () => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        brandColor: !!brandColor ? null : "#64748b",
      },
    });
  };

  const toggleBackgroundColor = () => {
    setLocalWorkflow({
      ...localWorkflow,
      styling: {
        ...localWorkflow.styling,
        background: {
          ...localWorkflow.styling?.background,
          bg: !!bg ? undefined : "#ffff",
          bgType: !!bg ? undefined : "color",
        },
      },
    });
  };

  const toggleBrightness = () => {
    setLocalWorkflow({
      ...localWorkflow,
      styling: {
        ...localWorkflow.styling,
        background: {
          ...localWorkflow.styling?.background,
          brightness: !!brightness ? undefined : 100,
        },
      },
    });
    setInputValue(100);
  };

  const toggleHighlightBorderColor = () => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        highlightBorderColor: !!highlightBorderColor ? null : "#64748b",
      },
    });
  };

  const handleColorChange = (color: string) => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        brandColor: color,
      },
    });
  };

  const handleBgChange = (color: string, type: TWorkflowBackgroundBgType) => {
    setInputValue(100);
    setLocalWorkflow({
      ...localWorkflow,
      styling: {
        ...localWorkflow.styling,
        background: {
          ...localWorkflow.styling?.background,
          bg: color,
          bgType: type,
          brightness: undefined,
        },
      },
    });
  };

  const handleBrightnessChange = (percent: number) => {
    setLocalWorkflow({
      ...localWorkflow,
      styling: {
        ...(localWorkflow.styling || {}),
        background: {
          ...localWorkflow.styling?.background,
          brightness: percent,
        },
      },
    });
  };

  const handleBorderColorChange = (color: string) => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        highlightBorderColor: color,
      },
    });
  };

  const handlePlacementChange = (placement: TPlacement) => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        placement,
      },
    });
  };

  const handleOverlay = (overlayType: string) => {
    const darkOverlay = overlayType === "dark";

    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        darkOverlay,
      },
    });
  };

  const handleClickOutsideClose = (clickOutsideClose: boolean) => {
    setLocalWorkflow({
      ...localWorkflow,
      productOverwrites: {
        ...localWorkflow.productOverwrites,
        clickOutsideClose,
      },
    });
  };

  const toggleProgressBarVisibility = () => {
    setLocalWorkflow({
      ...localWorkflow,
      styling: {
        ...localWorkflow.styling,
        hideProgressBar: !progressBarHidden,
      },
    });
  };

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="w-full rounded-lg border border-slate-300 bg-white">
      <Collapsible.CollapsibleTrigger asChild className="h-full w-full cursor-pointer">
        <div className="inline-flex px-4 py-4">
          <div className="flex items-center pl-2 pr-5">
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Styling</p>
            <p className="mt-1 truncate text-sm text-slate-500">Overwrite global styling settings</p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent>
        <hr className="py-1 text-slate-600" />
        <div className="p-3">
          {/* Brand Color */}
          <div className="p-3">
            <div className="ml-2 flex items-center space-x-1">
              <Switch id="autoComplete" checked={!!brandColor} onCheckedChange={toggleBrandColor} />
              <Label htmlFor="autoComplete" className="cursor-pointer">
                <div className="ml-2">
                  <h3 className="text-sm font-semibold text-slate-700">Overwrite Brand Color</h3>
                  <p className="text-xs font-normal text-slate-500">
                    Change the main color for this workflow.
                  </p>
                </div>
              </Label>
            </div>
            {brandColor && (
              <div className="ml-2 mt-4 rounded-lg border bg-slate-50 p-4">
                <div className="w-full max-w-xs">
                  <Label htmlFor="brandcolor">Color (HEX)</Label>
                  <ColorPicker color={brandColor} onChange={handleColorChange} />
                </div>
              </div>
            )}
          </div>
          {type == "link" && (
            <>
              {/* Background */}
              <div className="p-3">
                <div className="ml-2 flex items-center space-x-1">
                  <Switch id="autoCompleteBg" checked={!!bg} onCheckedChange={toggleBackgroundColor} />
                  <Label htmlFor="autoCompleteBg" className="cursor-pointer">
                    <div className="ml-2">
                      <h3 className="text-sm font-semibold text-slate-700">Change Background</h3>
                      <p className="text-xs font-normal text-slate-500">
                        Pick a background from our library or upload your own.
                      </p>
                    </div>
                  </Label>
                </div>
                {bg && (
                  <WorkflowBgSelectorTab
                    localWorkflow={localWorkflow}
                    handleBgChange={handleBgChange}
                    colours={colours}
                    bgType={bgType}
                  />
                )}
              </div>
              {/* Overlay */}
              <div className="p-3">
                <div className="ml-2 flex items-center space-x-1">
                  <Switch
                    id="autoCompleteOverlay"
                    checked={!!brightness}
                    onCheckedChange={toggleBrightness}
                  />
                  <Label htmlFor="autoCompleteOverlay" className="cursor-pointer">
                    <div className="ml-2">
                      <h3 className="text-sm font-semibold text-slate-700">Background Overlay</h3>
                      <p className="text-xs font-normal text-slate-500">
                        Darken or lighten background of your choice.
                      </p>
                    </div>
                  </Label>
                </div>
                {brightness && (
                  <div>
                    <div className="mt-4 flex flex-col justify-center rounded-lg border bg-slate-50 p-4 px-8">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">Transparency</h3>
                      <input
                        id="small-range"
                        type="range"
                        min="1"
                        max="200"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="range-sm mb-6 h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {/* positioning */}
          {type !== "link" && (
            <div className="p-3 ">
              <div className="ml-2 flex items-center space-x-1">
                <Switch id="workflowDeadline" checked={!!placement} onCheckedChange={togglePlacement} />
                <Label htmlFor="workflowDeadline" className="cursor-pointer">
                  <div className="ml-2">
                    <h3 className="text-sm font-semibold text-slate-700">Overwrite Placement</h3>
                    <p className="text-xs font-normal text-slate-500">
                      Change the placement of this workflow.
                    </p>
                  </div>
                </Label>
              </div>
              {placement && (
                <div className="ml-2 mt-4 flex items-center space-x-1 pb-4">
                  <div className="flex w-full cursor-pointer items-center rounded-lg  border bg-slate-50 p-4">
                    <div className="w-full items-center">
                      <Placement
                        currentPlacement={placement}
                        setCurrentPlacement={handlePlacementChange}
                        setOverlay={handleOverlay}
                        overlay={darkOverlay ? "dark" : "light"}
                        setClickOutsideClose={handleClickOutsideClose}
                        clickOutsideClose={!!clickOutsideClose}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Highlight border */}
          {type !== "link" && (
            <div className="p-3 ">
              <div className="ml-2 flex items-center space-x-1">
                <Switch
                  id="autoComplete"
                  checked={!!highlightBorderColor}
                  onCheckedChange={toggleHighlightBorderColor}
                />
                <Label htmlFor="autoComplete" className="cursor-pointer">
                  <div className="ml-2">
                    <h3 className="text-sm font-semibold text-slate-700">Overwrite Highlight Border</h3>
                    <p className="text-xs font-normal text-slate-500">
                      Change the highlight border for this workflow.
                    </p>
                  </div>
                </Label>
              </div>
              {!!highlightBorderColor && (
                <div className="ml-2 mt-4 rounded-lg border bg-slate-50 p-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="highlightBorder"
                      checked={!!highlightBorderColor}
                      onCheckedChange={toggleHighlightBorderColor}
                    />
                    <h2 className="text-sm font-medium text-slate-800">Show highlight border</h2>
                  </div>
                  {!!highlightBorderColor && (
                    <div className="mt-6 w-full max-w-xs">
                      <Label htmlFor="brandcolor">Color (HEX)</Label>
                      <ColorPicker color={highlightBorderColor || ""} onChange={handleBorderColorChange} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="p-3">
            <div className="ml-2 flex items-center space-x-1">
              <Switch
                id="hideProgressBar"
                checked={progressBarHidden}
                onCheckedChange={toggleProgressBarVisibility}
              />
              <Label htmlFor="hideProgressBar" className="cursor-pointer">
                <div className="ml-2">
                  <h3 className="text-sm font-semibold text-slate-700">Hide Progress Bar</h3>
                  <p className="text-xs font-normal text-slate-500">
                    Disable the visibility of survey progress
                  </p>
                </div>
              </Label>
            </div>
          </div>
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
