import { useEffect, useState } from "react";

import PreviewWorkflow from "./PreviewWorkflow";
import TemplateList from "./TemplateList";
import { templates } from "./templates";
import { TTemplate } from "./types";

export default function WorkflowTemplatesPage({}) {
  const [activeTemplate, setActiveTemplate] = useState<TTemplate | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (templates.length > 0) {
      setActiveTemplate(templates[0]);
      setActiveQuestionId(templates[0]?.preset.questions[0]?.id || null);
    }
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-x-auto">
      <div className="relative z-0 flex flex-1 overflow-hidden">
        <TemplateList
          activeTemplate={activeTemplate}
          onTemplateClick={(template) => {
            setActiveQuestionId(template.preset.questions[0].id);
            setActiveTemplate(template);
          }}
        />
        <aside className="group relative h-full flex-1 flex-shrink-0 overflow-hidden rounded-r-lg bg-slate-200 shadow-inner  md:flex md:flex-col">
          {activeTemplate && (
            <PreviewWorkflow
              activeQuestionId={activeQuestionId}
              questions={activeTemplate.preset.questions}
              brandColor="#94a3b8"
              setActiveQuestionId={setActiveQuestionId}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
