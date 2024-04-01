"use client";

import React, { useEffect, useState } from "react";

import { TTemplate } from "@typeflowai/types/templates";

import PreviewWorkflow from "./PreviewWorkflow";
import { findTemplateByName } from "./templates";

interface DemoPreviewProps {
  template: string;
}

const DemoPreview: React.FC<DemoPreviewProps> = ({ template }) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const selectedTemplate: TTemplate | undefined = findTemplateByName(template);

  useEffect(() => {
    if (selectedTemplate) {
      setActiveQuestionId(selectedTemplate.preset.questions[0].id);
    }
  }, [selectedTemplate]);

  if (!selectedTemplate) {
    return <div>Template not found.</div>;
  }

  return (
    <div className="flex items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-200 py-6 transition-transform duration-150">
      <div className="flex flex-col items-center justify-around">
        <p className="my-3 text-sm text-slate-500">Preview</p>
        <div className="">
          {selectedTemplate && (
            <PreviewWorkflow
              activeQuestionId={activeQuestionId}
              questions={selectedTemplate.preset.questions}
              brandColor="#94a3b8"
              setActiveQuestionId={setActiveQuestionId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPreview;
