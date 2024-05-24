"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { AlertCircleIcon, CheckIcon, EarthIcon, LinkIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TEnvironment } from "@typeflowai/types/environment";
import { TSegment } from "@typeflowai/types/segment";
import { TWorkflow, TWorkflowType } from "@typeflowai/types/workflows";
import { Badge } from "@typeflowai/ui/Badge";
import { Label } from "@typeflowai/ui/Label";
import { RadioGroup, RadioGroupItem } from "@typeflowai/ui/RadioGroup";

interface HowToSendCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow | ((TWorkflow: TWorkflow) => TWorkflow)) => void;
  environment: TEnvironment;
}

export default function HowToSendCard({ localWorkflow, setLocalWorkflow, environment }: HowToSendCardProps) {
  const [open, setOpen] = useState(false);
  const [widgetSetupCompleted, setWidgetSetupCompleted] = useState(false);

  useEffect(() => {
    if (environment && environment.widgetSetupCompleted) {
      setWidgetSetupCompleted(true);
    } else {
      setWidgetSetupCompleted(false);
    }
  }, [environment]);

  const setWorkflowType = (type: TWorkflowType) => {
    setLocalWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      type,
      thankYouCard: {
        ...prevWorkflow.thankYouCard,
        enabled: type === "link" ? true : prevWorkflow.thankYouCard.enabled,
      },
    }));

    // if the type is "app" and the local workflow does not already have a segment, we create a new temporary segment
    if (type === "app" && !localWorkflow.segment) {
      const tempSegment: TSegment = {
        id: "temp",
        isPrivate: true,
        title: localWorkflow.id,
        environmentId: environment.id,
        workflows: [localWorkflow.id],
        filters: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        description: "",
      };

      setLocalWorkflow((prevWorkflow) => ({
        ...prevWorkflow,
        segment: tempSegment,
      }));
    }

    // if the type is anything other than "app" and the local workflow has a temporary segment, we remove it
    if (type !== "app" && localWorkflow.segment?.id === "temp") {
      setLocalWorkflow((prevWorkflow) => ({
        ...prevWorkflow,
        segment: null,
      }));
    }
  };

  const options = [
    {
      id: "website",
      name: "Website Workflow",
      icon: EarthIcon,
      description: "Run targeted workflows on public websites.",
      comingSoon: false,
      alert: !widgetSetupCompleted,
    },
    {
      id: "app",
      name: "App Workflow",
      icon: MonitorIcon,
      description: "Embed a workflow in your web app to collect responses with user identification.",
      comingSoon: false,
      alert: !widgetSetupCompleted,
    },
    {
      id: "link",
      name: "Link workflow",
      icon: LinkIcon,
      description: "Share a link to a workflow page or embed it in a web page or email.",
      comingSoon: false,
      alert: false,
    },
    {
      id: "mobile",
      name: "Mobile App Workflow",
      icon: SmartphoneIcon,
      description: "Workflow users inside a mobile app (iOS & Android).",
      comingSoon: true,
      alert: false,
    },
  ];

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={cn(
        open ? "" : "hover:bg-slate-50",
        "w-full space-y-2 rounded-lg border border-slate-300 bg-white "
      )}>
      <Collapsible.CollapsibleTrigger
        asChild
        className="h-full w-full cursor-pointer"
        id="howToSendCardTrigger">
        <div className="inline-flex px-4 py-4">
          <div className="flex items-center pl-2 pr-5">
            <CheckIcon
              strokeWidth={3}
              className="h-7 w-7 rounded-full border border-green-300 bg-green-100 p-1.5 text-green-600"
            />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Workflow Type</p>
            <p className="mt-1 text-sm text-slate-500">Choose between in-app or link workflow.</p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent>
        <hr className="py-1 text-slate-600" />
        <div className="p-3">
          <RadioGroup
            defaultValue="app"
            value={localWorkflow.type}
            onValueChange={setWorkflowType}
            className="flex flex-col space-y-3">
            {options.map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className={cn(
                  "flex w-full  items-center rounded-lg border bg-slate-50 p-4",
                  option.comingSoon
                    ? "border-slate-200 bg-slate-50/50"
                    : option.id === localWorkflow.type
                      ? "border-brand-dark cursor-pointer bg-slate-50"
                      : "cursor-pointer bg-slate-50"
                )}
                id={`howToSendCardOption-${option.id}`}>
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="aria-checked:border-brand-dark  mx-5 disabled:border-slate-400 aria-checked:border-2"
                  disabled={option.comingSoon}
                />
                <div className=" inline-flex items-center">
                  <option.icon className="mr-4 h-8 w-8 text-slate-500" />
                  <div>
                    <div className="inline-flex items-center">
                      <p
                        className={cn(
                          "font-semibold",
                          option.comingSoon ? "text-slate-500" : "text-slate-800"
                        )}>
                        {option.name}
                      </p>
                      {option.comingSoon && (
                        <Badge text="coming soon" size="normal" type="success" className="ml-2" />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-normal text-slate-600">{option.description}</p>
                    {option.alert && (
                      <div className="mt-2 flex items-center space-x-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
                        <AlertCircleIcon className="h-5 w-5 text-amber-500" />
                        <div className=" text-amber-800">
                          <p className="text-xs font-semibold">
                            Your app is not yet connected to TypeflowAI.
                          </p>
                          <p className="text-xs font-normal">
                            <Link
                              href={`/environments/${environment.id}/product/setup`}
                              className="underline hover:text-amber-900"
                              target="_blank">
                              Connect TypeflowAI
                            </Link>{" "}
                            and launch workflows in your app or website.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
