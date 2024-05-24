"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { extractLanguageCodes, getEnabledLanguages } from "@typeflowai/lib/i18n/utils";
import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { useDocumentVisibility } from "@typeflowai/lib/useDocumentVisibility";
import { TActionClass } from "@typeflowai/types/actionClasses";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TEnvironment } from "@typeflowai/types/environment";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TProduct } from "@typeflowai/types/product";
import { TSegment } from "@typeflowai/types/segment";
import { TWorkflow, TWorkflowEditorTabs, TWorkflowStyling } from "@typeflowai/types/workflows";
import { PreviewWorkflow } from "@typeflowai/ui/PreviewWorkflow";

import { refetchProductAction } from "../actions";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuestionsAudienceTabs } from "./QuestionsStylingSettingsTabs";
import { QuestionsView } from "./QuestionsView";
import { SettingsView } from "./SettingsView";
import { StylingView } from "./StylingView";
import { WorkflowMenuBar } from "./WorkflowMenuBar";

interface WorkflowEditorProps {
  workflow: TWorkflow;
  product: TProduct;
  environment: TEnvironment;
  webAppUrl: string;
  actionClasses: TActionClass[];
  attributeClasses: TAttributeClass[];
  segments: TSegment[];
  responseCount: number;
  membershipRole?: TMembershipRole;
  colors: string[];
  isUserTargetingAllowed?: boolean;
  isMultiLanguageAllowed?: boolean;
  isTypeflowAICloud: boolean;
  isUnsplashConfigured: boolean;
  isEngineLimited: boolean;
}

export default function WorkflowEditor({
  workflow,
  product,
  environment,
  webAppUrl,
  actionClasses,
  attributeClasses,
  segments,
  responseCount,
  membershipRole,
  colors,
  isMultiLanguageAllowed,
  isUserTargetingAllowed = false,
  isTypeflowAICloud,
  isUnsplashConfigured,
  isEngineLimited,
}: WorkflowEditorProps): JSX.Element {
  const [activeView, setActiveView] = useState<TWorkflowEditorTabs>("questions");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [localWorkflow, setLocalWorkflow] = useState<TWorkflow | null>(() => structuredClone(workflow));
  const [invalidQuestions, setInvalidQuestions] = useState<string[] | null>(null);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>("default");
  const workflowEditorRef = useRef(null);
  const [localProduct, setLocalProduct] = useState<TProduct>(product);

  const [styling, setStyling] = useState(localWorkflow?.styling);
  const [localStylingChanges, setLocalStylingChanges] = useState<TWorkflowStyling | null>(null);

  const fetchLatestProduct = useCallback(async () => {
    const latestProduct = await refetchProductAction(localProduct.id);
    if (latestProduct) {
      setLocalProduct(latestProduct);
    }
  }, [localProduct.id]);

  useDocumentVisibility(fetchLatestProduct);

  useEffect(() => {
    if (workflow) {
      if (localWorkflow) return;

      const workflowClone = structuredClone(workflow);
      setLocalWorkflow(workflowClone);

      if (workflow.questions.length > 0) {
        setActiveQuestionId(workflow.questions[0].id);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  useEffect(() => {
    const listener = () => {
      if (document.visibilityState === "visible") {
        const fetchLatestProduct = async () => {
          const latestProduct = await refetchProductAction(localProduct.id);
          if (latestProduct) {
            setLocalProduct(latestProduct);
          }
        };
        fetchLatestProduct();
      }
    };
    document.addEventListener("visibilitychange", listener);
    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [localProduct.id]);

  // when the workflow type changes, we need to reset the active question id to the first question
  useEffect(() => {
    if (localWorkflow?.questions?.length && localWorkflow.questions.length > 0) {
      setActiveQuestionId(localWorkflow.questions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localWorkflow?.type, workflow?.questions]);

  useEffect(() => {
    if (!localWorkflow?.languages) return;
    const enabledLanguageCodes = extractLanguageCodes(getEnabledLanguages(localWorkflow.languages ?? []));
    if (!enabledLanguageCodes.includes(selectedLanguageCode)) {
      setSelectedLanguageCode("default");
    }
  }, [localWorkflow?.languages, selectedLanguageCode]);

  if (!localWorkflow) {
    return <LoadingSkeleton />;
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
          product={localProduct}
          responseCount={responseCount}
          selectedLanguageCode={selectedLanguageCode}
          setSelectedLanguageCode={setSelectedLanguageCode}
        />
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none" ref={workflowEditorRef}>
            <QuestionsAudienceTabs
              activeId={activeView}
              setActiveId={setActiveView}
              isStylingTabVisible={!!product.styling.allowStyleOverwrite}
            />

            {activeView === "questions" && (
              <QuestionsView
                localWorkflow={localWorkflow}
                setLocalWorkflow={setLocalWorkflow}
                activeQuestionId={activeQuestionId}
                setActiveQuestionId={setActiveQuestionId}
                product={localProduct}
                invalidQuestions={invalidQuestions}
                setInvalidQuestions={setInvalidQuestions}
                isEngineLimited={isEngineLimited}
                selectedLanguageCode={selectedLanguageCode ? selectedLanguageCode : "default"}
                setSelectedLanguageCode={setSelectedLanguageCode}
                isMultiLanguageAllowed={isMultiLanguageAllowed}
                isTypeflowAICloud={isTypeflowAICloud}
              />
            )}

            {activeView === "styling" && product.styling.allowStyleOverwrite && (
              <StylingView
                colors={colors}
                environment={environment}
                localWorkflow={localWorkflow}
                setLocalWorkflow={setLocalWorkflow}
                product={localProduct}
                styling={styling ?? null}
                setStyling={setStyling}
                localStylingChanges={localStylingChanges}
                setLocalStylingChanges={setLocalStylingChanges}
                isUnsplashConfigured={isUnsplashConfigured}
              />
            )}

            {activeView === "settings" && (
              <SettingsView
                environment={environment}
                localWorkflow={localWorkflow}
                setLocalWorkflow={setLocalWorkflow}
                actionClasses={actionClasses}
                attributeClasses={attributeClasses}
                segments={segments}
                responseCount={responseCount}
                membershipRole={membershipRole}
                isUserTargetingAllowed={isUserTargetingAllowed}
                isTypeflowAICloud={isTypeflowAICloud}
              />
            )}
          </main>

          <aside className="group hidden flex-1 flex-shrink-0 items-center justify-center overflow-hidden border-l border-slate-100 bg-slate-50 py-6 md:flex md:flex-col">
            <PreviewWorkflow
              workflow={localWorkflow}
              webAppUrl={webAppUrl}
              questionId={activeQuestionId}
              product={localProduct}
              environment={environment}
              previewType={
                localWorkflow.type === "app" || localWorkflow.type === "website" ? "modal" : "fullwidth"
              }
              languageCode={selectedLanguageCode}
              onFileUpload={async (file) => file.name}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
