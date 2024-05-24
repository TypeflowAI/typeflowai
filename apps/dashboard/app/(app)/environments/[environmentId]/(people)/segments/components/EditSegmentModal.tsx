"use client";

import { UsersIcon } from "lucide-react";

// import SegmentSettings from "@typeflowai/ee/advancedTargeting/components/SegmentSettings";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TSegment, TSegmentWithWorkflowNames } from "@typeflowai/types/segment";
import { ModalWithTabs } from "@typeflowai/ui/ModalWithTabs";

import BasicSegmentSettings from "./BasicSegmentSettings";
import SegmentActivityTab from "./SegmentActivityTab";

interface EditSegmentModalProps {
  environmentId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  currentSegment: TSegmentWithWorkflowNames;
  segments: TSegment[];
  attributeClasses: TAttributeClass[];
  actionClasses: TActionClass[];
  isAdvancedTargetingAllowed: boolean;
  isTypeflowAICloud: boolean;
}

export default function EditSegmentModal({
  environmentId,
  open,
  setOpen,
  currentSegment,
  // actionClasses,
  attributeClasses,
  // segments,
  // isAdvancedTargetingAllowed,
  isTypeflowAICloud,
}: EditSegmentModalProps) {
  const SettingsTab = () => {
    // if (isAdvancedTargetingAllowed) {
    //   return (
    //     <SegmentSettings
    //       actionClasses={actionClasses}
    //       attributeClasses={attributeClasses}
    //       environmentId={environmentId}
    //       initialSegment={currentSegment}
    //       segments={segments}
    //       setOpen={setOpen}
    //     />
    //   );
    // }

    return (
      <BasicSegmentSettings
        attributeClasses={attributeClasses}
        environmentId={environmentId}
        initialSegment={currentSegment}
        setOpen={setOpen}
        isTypeflowAICloud={isTypeflowAICloud}
      />
    );
  };

  const tabs = [
    {
      title: "Activity",
      children: <SegmentActivityTab environmentId={environmentId} currentSegment={currentSegment} />,
    },
    {
      title: "Settings",
      children: <SettingsTab />,
    },
  ];

  return (
    <>
      <ModalWithTabs
        open={open}
        setOpen={setOpen}
        tabs={tabs}
        icon={<UsersIcon className="h-5 w-5" />}
        label={currentSegment.title}
        description={currentSegment.description || ""}
        closeOnOutsideClick={false}
      />
    </>
  );
}
