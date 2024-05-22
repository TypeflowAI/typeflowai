"use client";

import { WorkflowStatusDropdown } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/WorkflowStatusDropdown";
import { isWorkflowValid } from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/edit/lib/validation";
import { isEqual } from "lodash";
import { AlertTriangleIcon, ArrowLeftIcon, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { TEnvironment } from "@typeflowai/types/environment";
import { TProduct } from "@typeflowai/types/product";
import { TSegment } from "@typeflowai/types/segment";
import { TWorkflow, TWorkflowEditorTabs } from "@typeflowai/types/workflows";
import { AlertDialog } from "@typeflowai/ui/AlertDialog";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";

// import { createSegmentAction } from "@typeflowai/ee/advancedTargeting/lib/actions";
import { createBasicSegmentAction } from "../actions";
import { updateWorkflowAction } from "../actions";

interface WorkflowMenuBarProps {
  localWorkflow: TWorkflow;
  workflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  environment: TEnvironment;
  activeId: TWorkflowEditorTabs;
  setActiveId: React.Dispatch<React.SetStateAction<TWorkflowEditorTabs>>;
  setInvalidQuestions: (invalidQuestions: string[]) => void;
  product: TProduct;
  responseCount: number;
  selectedLanguageCode: string;
  setSelectedLanguageCode: (selectedLanguage: string) => void;
}

export const WorkflowMenuBar = ({
  localWorkflow,
  workflow,
  environment,
  setLocalWorkflow,
  activeId,
  setActiveId,
  setInvalidQuestions,
  product,
  responseCount,
  selectedLanguageCode,
  setSelectedLanguageCode,
}: WorkflowMenuBarProps) => {
  const router = useRouter();
  const [audiencePrompt, setAudiencePrompt] = useState(true);
  const [isLinkWorkflow, setIsLinkWorkflow] = useState(true);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isWorkflowPublishing, setIsWorkflowPublishing] = useState(false);
  const [isWorkflowSaving, setIsWorkflowSaving] = useState(false);
  const cautionText = "This workflow received responses, make changes with caution.";

  const faultyQuestions: string[] = [];

  useEffect(() => {
    if (audiencePrompt && activeId === "settings") {
      setAudiencePrompt(false);
    }
  }, [activeId, audiencePrompt]);

  useEffect(() => {
    setIsLinkWorkflow(localWorkflow.type === "link");
  }, [localWorkflow.type]);

  useEffect(() => {
    const warningText = "You have unsaved changes - are you sure you wish to leave this page?";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isEqual(localWorkflow, workflow)) {
        e.preventDefault();
        return (e.returnValue = warningText);
      }
    };

    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [localWorkflow, workflow]);

  const containsEmptyTriggers = useMemo(() => {
    if (localWorkflow.type === "link") return false;

    const noTriggers =
      !localWorkflow.triggers || localWorkflow.triggers.length === 0 || !localWorkflow.triggers[0];
    if (noTriggers) return true;

    return false;
  }, [localWorkflow]);

  const disableSave = useMemo(() => {
    if (isWorkflowSaving) return true;

    if (localWorkflow.status !== "draft" && containsEmptyTriggers) return true;
  }, [containsEmptyTriggers, isWorkflowSaving, localWorkflow.status]);

  // write a function which updates the local workflow status
  const updateLocalWorkflowStatus = (status: TWorkflow["status"]) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.status = status;
    setLocalWorkflow(updatedWorkflow);
  };

  const handleBack = () => {
    const { updatedAt, ...localWorkflowRest } = localWorkflow;
    const { updatedAt: _, ...workflowRest } = workflow;
    localWorkflowRest.triggers = localWorkflowRest.triggers.filter((trigger) => Boolean(trigger));

    if (!isEqual(localWorkflowRest, workflowRest)) {
      setConfirmDialogOpen(true);
    } else {
      router.back();
    }
  };

  const handleTemporarySegment = async () => {
    if (localWorkflow.segment && localWorkflow.type === "app" && localWorkflow.segment?.id === "temp") {
      const { filters } = localWorkflow.segment;

      // create a new private segment
      // const newSegment = await createSegmentAction({
      //   environmentId: localWorkflow.environmentId,
      //   filters,
      //   isPrivate: true,
      //   workflowId: localWorkflow.id,
      //   title: localWorkflow.id,
      // });
      const newSegment = await createBasicSegmentAction({
        environmentId: localWorkflow.environmentId,
        filters,
        isPrivate: true,
        workflowId: localWorkflow.id,
        title: localWorkflow.id,
      });

      return newSegment;
    }
  };

  const handleSegmentUpdate = async (): Promise<TSegment | null> => {
    if (localWorkflow.segment && localWorkflow.segment.id === "temp") {
      const segment = await handleTemporarySegment();
      return segment ?? null;
    }

    return localWorkflow.segment;
  };

  const handleWorkflowSave = async () => {
    setIsWorkflowSaving(true);
    try {
      if (
        !isWorkflowValid(
          localWorkflow,
          faultyQuestions,
          setInvalidQuestions,
          selectedLanguageCode,
          setSelectedLanguageCode
        )
      ) {
        setIsWorkflowSaving(false);
        return;
      }

      localWorkflow.questions = localWorkflow.questions.map((question) => {
        const { isDraft, ...rest } = question;
        return rest;
      });

      const segment = await handleSegmentUpdate();
      const updatedWorkflow = await updateWorkflowAction({ ...localWorkflow, segment });

      setIsWorkflowSaving(false);
      setLocalWorkflow(updatedWorkflow);

      toast.success("Changes saved.");
    } catch (e) {
      console.error(e);
      setIsWorkflowSaving(false);
      toast.error(`Error saving changes`);
      return;
    }
  };

  const handleSaveAndGoBack = async () => {
    await handleWorkflowSave();
    router.back();
  };

  const handleWorkflowPublish = async () => {
    setIsWorkflowPublishing(true);
    try {
      if (
        !isWorkflowValid(
          localWorkflow,
          faultyQuestions,
          setInvalidQuestions,
          selectedLanguageCode,
          setSelectedLanguageCode
        )
      ) {
        setIsWorkflowPublishing(false);
        return;
      }
      const status = localWorkflow.runOnDate ? "scheduled" : "inProgress";
      const segment = await handleSegmentUpdate();

      await updateWorkflowAction({
        ...localWorkflow,
        status,
        segment,
      });
      setIsWorkflowPublishing(false);
      router.push(`/environments/${environment.id}/workflows/${localWorkflow.id}/summary?success=true`);
    } catch (error) {
      toast.error("An error occured while publishing the workflow.");
      setIsWorkflowPublishing(false);
    }
  };

  return (
    <>
      {environment?.type === "development" && (
        <nav className="top-0 z-10 w-full border-b border-slate-200 bg-white">
          <div className="h-6 w-full bg-[#A33700] p-0.5 text-center text-sm text-white">
            You&apos;re in development mode. Use it to test workflows, actions and attributes.
          </div>
        </nav>
      )}
      <div className="border-b border-slate-200 bg-white px-5 py-3 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <Button
            variant="secondary"
            StartIcon={ArrowLeftIcon}
            onClick={() => {
              handleBack();
            }}>
            Back
          </Button>
          <p className="hidden pl-4 font-semibold md:block">{product.name} / </p>
          <Input
            defaultValue={localWorkflow.name}
            onChange={(e) => {
              const updatedWorkflow = { ...localWorkflow, name: e.target.value };
              setLocalWorkflow(updatedWorkflow);
            }}
            className="w-72 border-white hover:border-slate-200 "
          />
        </div>
        {responseCount > 0 && (
          <div className="ju flex items-center rounded-lg border border-amber-200 bg-amber-100 p-2 text-amber-700 shadow-sm lg:mx-auto">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangleIcon className=" h-5 w-5 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent side={"top"} className="lg:hidden">
                  <p className="py-2 text-center text-xs text-slate-500 dark:text-slate-400 ">
                    {cautionText}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className=" hidden pl-1 text-xs md:text-sm lg:block">{cautionText}</p>
          </div>
        )}
        <div className="mt-3 flex sm:ml-4 sm:mt-0">
          <div className="mr-4 flex items-center">
            <WorkflowStatusDropdown
              workflow={workflow}
              environment={environment}
              updateLocalWorkflowStatus={updateLocalWorkflowStatus}
            />
          </div>
          <Button
            disabled={disableSave}
            variant="secondary"
            className="mr-3"
            loading={isWorkflowSaving}
            onClick={() => handleWorkflowSave()}>
            Save
          </Button>
          {localWorkflow.status !== "draft" && (
            <Button
              disabled={disableSave}
              variant="darkCTA"
              className="mr-3"
              loading={isWorkflowSaving}
              onClick={() => handleSaveAndGoBack()}>
              Save & Close
            </Button>
          )}
          {localWorkflow.status === "draft" && audiencePrompt && !isLinkWorkflow && (
            <Button
              variant="darkCTA"
              onClick={() => {
                setAudiencePrompt(false);
                setActiveId("settings");
              }}
              EndIcon={SettingsIcon}>
              Continue to Settings
            </Button>
          )}
          {/* Always display Publish button for link workflows for better CR */}
          {localWorkflow.status === "draft" && (!audiencePrompt || isLinkWorkflow) && (
            <Button
              disabled={isWorkflowSaving || containsEmptyTriggers}
              variant="darkCTA"
              loading={isWorkflowPublishing}
              onClick={handleWorkflowPublish}>
              Publish
            </Button>
          )}
        </div>
        <AlertDialog
          headerText="Confirm Workflow Changes"
          open={isConfirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          mainText="You have unsaved changes in your workflow. Would you like to save them before leaving?"
          confirmBtnLabel="Save"
          declineBtnLabel="Discard"
          declineBtnVariant="warn"
          onDecline={() => {
            setConfirmDialogOpen(false);
            router.back();
          }}
          onConfirm={() => handleSaveAndGoBack()}
        />
      </div>
    </>
  );
};
