"use client";

import { useState } from "react";
import { useMemo } from "react";

import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { Switch } from "@typeflowai/ui/Switch";

import { AttributeDetailModal } from "./AttributeDetailModal";
import { AttributeClassDataRow } from "./AttributeRowData";
import { AttributeTableHeading } from "./AttributeTableHeading";
import { HowToAddAttributesButton } from "./HowToAddAttributesButton";
import { UploadAttributesModal } from "./UploadAttributesModal";

interface AttributeClassesTableProps {
  attributeClasses: TAttributeClass[];
}

export const AttributeClassesTable = ({ attributeClasses }: AttributeClassesTableProps) => {
  const [isAttributeDetailModalOpen, setAttributeDetailModalOpen] = useState(false);
  const [isUploadCSVModalOpen, setUploadCSVModalOpen] = useState(false);
  const [activeAttributeClass, setActiveAttributeClass] = useState<TAttributeClass | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const displayedAttributeClasses = useMemo(() => {
    return attributeClasses
      ? showArchived
        ? attributeClasses
        : attributeClasses.filter((ac) => !ac.archived)
      : [];
  }, [showArchived, attributeClasses]);

  const hasArchived = useMemo(() => {
    return attributeClasses ? attributeClasses.some((ac) => ac.archived) : false;
  }, [attributeClasses]);

  const handleOpenAttributeDetailModalClick = (attributeClass: TAttributeClass) => {
    setActiveAttributeClass(attributeClass);
    setAttributeDetailModalOpen(true);
  };

  const toggleShowArchived = () => {
    setShowArchived(!showArchived);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-end text-right">
        {hasArchived && (
          <div className="flex items-center text-sm font-medium">
            Show archived
            <Switch className="mx-3" checked={showArchived} onCheckedChange={toggleShowArchived} />
          </div>
        )}
        <HowToAddAttributesButton />
      </div>
      <div className="rounded-lg border border-slate-200">
        <AttributeTableHeading />
        <div className="grid-cols-7">
          {displayedAttributeClasses.map((attributeClass, index) => (
            <button
              onClick={() => handleOpenAttributeDetailModalClick(attributeClass)}
              className="w-full"
              key={attributeClass.id}>
              <AttributeClassDataRow attributeClass={attributeClass} key={index} />
            </button>
          ))}
        </div>
        {activeAttributeClass && (
          <AttributeDetailModal
            open={isAttributeDetailModalOpen}
            setOpen={setAttributeDetailModalOpen}
            attributeClass={activeAttributeClass}
          />
        )}

        <UploadAttributesModal open={isUploadCSVModalOpen} setOpen={setUploadCSVModalOpen} />
      </div>
    </>
  );
};
