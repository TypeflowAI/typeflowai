"use client";

import Loading from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/loading";
import React from "react";
import { useEffect, useState } from "react";

import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflow } from "@typeflowai/types/workflows";

import PreviewWorkflow from "../../../components/PreviewWorkflow";
import QuestionsAudienceTabs from "./QuestionsSettingsTabs";
import QuestionsView from "./QuestionsView";
import SettingsView from "./SettingsView";
import WorkflowMenuBar from "./WorkflowMenuBar";

interface WorkflowEditorProps {
  workflow: TWorkflow;
  product: TProduct;
  environment: TEnvironment;
  webAppUrl: string;
  actionClasses: TActionClass[];
  attributeClasses: TAttributeClass[];
  responseCount: number;
  membershipRole?: TMembershipRole;
  colours: string[];
  isEngineLimited: boolean;
}

export default function WorkflowEditor({
  workflow,
  product,
  environment,
  webAppUrl,
  actionClasses,
  attributeClasses,
  responseCount,
  membershipRole,
  colours,
  isEngineLimited,
}: WorkflowEditorProps): JSX.Element {
  const [activeView, setActiveView] = useState<"questions" | "settings">("questions");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [localWorkflow, setLocalWorkflow] = useState<TWorkflow | null>();
  const [invalidQuestions, setInvalidQuestions] = useState<String[] | null>(null);

  useEffect(() => {
    if (workflow) {
      if (localWorkflow) return;
      setLocalWorkflow(JSON.parse(JSON.stringify(workflow)));

      if (workflow.questions.length > 0) {
        setActiveQuestionId(workflow.questions[0].id);
      }
    }
  }, [workflow, localWorkflow]);

  // when the workflow type changes, we need to reset the active question id to the first question
  useEffect(() => {
    if (localWorkflow?.questions?.length && localWorkflow.questions.length > 0) {
      setActiveQuestionId(localWorkflow.questions[0].id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWorkflow?.type]);

  if (!localWorkflow) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <WorkflowMenuBar
          setLocalWorkflow={setLocalWorkflow}
          localWorkflow={localWorkflow}
          workflow={workflow}
          environment={environment}
          activeId={activeView}
          setActiveId={setActiveView}
          setInvalidQuestions={setInvalidQuestions}
          product={product}
          responseCount={responseCount}
        />
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
            <QuestionsAudienceTabs activeId={activeView} setActiveId={setActiveView} />
            {activeView === "questions" ? (
              <QuestionsView
                localWorkflow={localWorkflow}
                setLocalWorkflow={setLocalWorkflow}
                activeQuestionId={activeQuestionId}
                setActiveQuestionId={setActiveQuestionId}
                product={product}
                invalidQuestions={invalidQuestions}
                setInvalidQuestions={setInvalidQuestions}
                isEngineLimited={isEngineLimited}
              />
            ) : (
              <SettingsView
                environment={environment}
                localWorkflow={localWorkflow}
                setLocalWorkflow={setLocalWorkflow}
                actionClasses={actionClasses}
                attributeClasses={attributeClasses}
                responseCount={responseCount}
                membershipRole={membershipRole}
                colours={colours}
              />
            )}
          </main>
          <aside className="group hidden flex-1 flex-shrink-0 items-center justify-center overflow-hidden border-l border-slate-100 bg-slate-50 py-6  md:flex md:flex-col">
            <PreviewWorkflow
              workflow={localWorkflow}
              webAppUrl={webAppUrl}
              setActiveQuestionId={setActiveQuestionId}
              activeQuestionId={activeQuestionId}
              product={product}
              environment={environment}
              previewType={localWorkflow.type === "web" ? "modal" : "fullwidth"}
              onFileUpload={async (file) => file.name}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
