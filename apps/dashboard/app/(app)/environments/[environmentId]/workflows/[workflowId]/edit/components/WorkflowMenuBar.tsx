"use client";

import WorkflowStatusDropdown from "@/app/(app)/environments/[environmentId]/workflows/[workflowId]/components/WorkflowStatusDropdown";
import { ArrowLeftIcon, Cog8ToothIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { isEqual } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TEnvironment } from "@typeflowai/types/environment";
import { TProduct } from "@typeflowai/types/product";
import { TWorkflowQuestionType } from "@typeflowai/types/workflows";
import { TWorkflow } from "@typeflowai/types/workflows";
import AlertDialog from "@typeflowai/ui/AlertDialog";
import { Button } from "@typeflowai/ui/Button";
import { DeleteDialog } from "@typeflowai/ui/DeleteDialog";
import { Input } from "@typeflowai/ui/Input";
import { trackEvent } from "@typeflowai/ui/PostHogClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@typeflowai/ui/Tooltip";

import { deleteWorkflowAction, updateWorkflowAction } from "../actions";
import { validateQuestion } from "./Validation";

interface WorkflowMenuBarProps {
  localWorkflow: TWorkflow;
  workflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow) => void;
  environment: TEnvironment;
  activeId: "questions" | "settings";
  setActiveId: (id: "questions" | "settings") => void;
  setInvalidQuestions: (invalidQuestions: String[]) => void;
  product: TProduct;
  responseCount: number;
}

export default function WorkflowMenuBar({
  localWorkflow,
  workflow,
  environment,
  setLocalWorkflow,
  activeId,
  setActiveId,
  setInvalidQuestions,
  product,
  responseCount,
}: WorkflowMenuBarProps) {
  const router = useRouter();
  const [audiencePrompt, setAudiencePrompt] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isWorkflowPublishing, setIsWorkflowPublishing] = useState(false);
  const [isWorkflowSaving, setIsWorkflowSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cautionText = "This workflow received responses, make changes with caution.";

  let faultyQuestions: String[] = [];

  useEffect(() => {
    if (audiencePrompt && activeId === "settings") {
      setAudiencePrompt(false);
    }
  }, [activeId, audiencePrompt]);

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

  // write a function which updates the local workflow status
  const updateLocalWorkflowStatus = (status: TWorkflow["status"]) => {
    const updatedWorkflow = { ...localWorkflow };
    updatedWorkflow.status = status;
    setLocalWorkflow(updatedWorkflow);
  };

  const deleteWorkflow = async (workflowId) => {
    try {
      await deleteWorkflowAction(workflowId);
      router.refresh();
      setDeleteDialogOpen(false);
      router.back();
    } catch (error) {
      console.error("An error occurred deleting the workflow");
      toast.error("An error occurred deleting the workflow");
    }
  };

  const handleBack = () => {
    const createdAt = new Date(localWorkflow.createdAt).getTime();
    const updatedAt = new Date(localWorkflow.updatedAt).getTime();

    if (createdAt === updatedAt && localWorkflow.status === "draft") {
      setDeleteDialogOpen(true);
    } else if (!isEqual(localWorkflow, workflow)) {
      setConfirmDialogOpen(true);
    } else {
      router.back();
    }
  };

  const validateWorkflow = (workflow) => {
    const existingQuestionIds = new Set();

    if (workflow.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    let pin = workflow?.pin;
    if (pin !== null && pin.toString().length !== 4) {
      toast.error("PIN must be a four digit number.");
      return;
    }

    faultyQuestions = [];
    for (let index = 0; index < workflow.questions.length; index++) {
      const question = workflow.questions[index];
      const isValid = validateQuestion(question);

      if (!isValid) {
        faultyQuestions.push(question.id);
      }
    }
    // if there are any faulty questions, the user won't be allowed to save the workflow
    if (faultyQuestions.length > 0) {
      setInvalidQuestions(faultyQuestions);
      toast.error("Please fill all required fields.");
      return false;
    }

    for (const question of workflow.questions) {
      const existingLogicConditions = new Set();

      if (existingQuestionIds.has(question.id)) {
        toast.error("There are 2 identical question IDs. Please update one.");
        return false;
      }
      existingQuestionIds.add(question.id);

      if (
        question.type === TWorkflowQuestionType.MultipleChoiceSingle ||
        question.type === TWorkflowQuestionType.MultipleChoiceMulti
      ) {
        const haveSameChoices =
          question.choices.some((element) => element.label.trim() === "") ||
          question.choices.some((element, index) =>
            question.choices
              .slice(index + 1)
              .some((nextElement) => nextElement.label.trim() === element.label.trim())
          );

        if (haveSameChoices) {
          toast.error("You have two identical choices.");
          return false;
        }
      }

      for (const logic of question.logic || []) {
        const validFields = ["condition", "destination", "value"].filter(
          (field) => logic[field] !== undefined
        ).length;

        if (validFields < 2) {
          setInvalidQuestions([question.id]);
          toast.error("Incomplete logic jumps detected: Please fill or delete them.");
          return false;
        }

        if (question.required && logic.condition === "skipped") {
          toast.error("You have a missing logic condition. Please update or delete it.");
          return false;
        }

        const thisLogic = `${logic.condition}-${logic.value}`;
        if (existingLogicConditions.has(thisLogic)) {
          setInvalidQuestions([question.id]);
          toast.error("You have 2 competing logic conditons. Please update or delete one.");
          return false;
        }
        existingLogicConditions.add(thisLogic);
      }
    }

    if (
      workflow.redirectUrl &&
      !workflow.redirectUrl.includes("https://") &&
      !workflow.redirectUrl.includes("http://")
    ) {
      toast.error("Please enter a valid URL for redirecting respondents.");
      return false;
    }

    /*
     Check whether the count for autocomplete responses is not less 
     than the current count of accepted response and also it is not set to 0
    */
    if (
      (workflow.autoComplete &&
        workflow._count?.responses &&
        workflow._count.responses >= workflow.autoComplete) ||
      workflow?.autoComplete === 0
    ) {
      return false;
    }

    return true;
  };

  const saveWorkflowAction = async (shouldNavigateBack = false) => {
    if (localWorkflow.questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }
    setIsWorkflowSaving(true);
    // Create a copy of localWorkflow with isDraft removed from every question
    const strippedWorkflow: TWorkflow = {
      ...localWorkflow,
      questions: localWorkflow.questions.map((question) => {
        const { isDraft, ...rest } = question;
        return rest;
      }),
      attributeFilters: localWorkflow.attributeFilters.filter((attributeFilter) => {
        if (attributeFilter.attributeClassId && attributeFilter.value) {
          return true;
        }
      }),
    };

    if (!validateWorkflow(localWorkflow)) {
      setIsWorkflowSaving(false);
      return;
    }

    try {
      await updateWorkflowAction({ ...strippedWorkflow });
      setIsWorkflowSaving(false);
      toast.success("Changes saved.");
      if (shouldNavigateBack) {
        router.back();
      } else {
        if (localWorkflow.status !== "draft") {
          router.push(`/environments/${environment.id}/workflows/${localWorkflow.id}/summary`);
        } else {
          router.push(`/environments/${environment.id}/workflows`);
        }
      }
    } catch (e) {
      console.error(e);
      setIsWorkflowSaving(false);
      toast.error(`Error saving changes`);
      return;
    }
  };

  function containsEmptyTriggers() {
    return (
      localWorkflow.type === "web" &&
      localWorkflow.triggers &&
      (localWorkflow.triggers[0] === "" || localWorkflow.triggers.length === 0)
    );
  }

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
                  <ExclamationTriangleIcon className=" h-5 w-5 text-amber-400" />
                </TooltipTrigger>
                <TooltipContent side={"top"} className="lg:hidden">
                  <p className="py-2 text-center text-xs text-slate-500">{cautionText}</p>
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
            disabled={isWorkflowPublishing || (localWorkflow.status !== "draft" && containsEmptyTriggers())}
            variant={localWorkflow.status === "draft" ? "secondary" : "darkCTA"}
            className="mr-3"
            loading={isWorkflowSaving}
            onClick={() => saveWorkflowAction()}>
            Save
          </Button>
          {localWorkflow.status === "draft" && audiencePrompt && (
            <Button
              variant="darkCTA"
              onClick={() => {
                setAudiencePrompt(false);
                setActiveId("settings");
              }}
              EndIcon={Cog8ToothIcon}>
              Continue to Settings
            </Button>
          )}
          {localWorkflow.status === "draft" && !audiencePrompt && (
            <Button
              disabled={isWorkflowSaving || containsEmptyTriggers()}
              variant="darkCTA"
              loading={isWorkflowPublishing}
              onClick={async () => {
                setIsWorkflowPublishing(true);
                if (!validateWorkflow(localWorkflow)) {
                  setIsWorkflowPublishing(false);
                  return;
                }
                await updateWorkflowAction({ ...localWorkflow, status: "inProgress" });
                trackEvent("WorkflowPublished", { workflowId: localWorkflow.id });
                router.push(
                  `/environments/${environment.id}/workflows/${localWorkflow.id}/summary?success=true`
                );
              }}>
              Publish
            </Button>
          )}
        </div>
        <DeleteDialog
          deleteWhat="Draft"
          open={isDeleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onDelete={async () => {
            setIsDeleting(true);
            await deleteWorkflow(localWorkflow.id);
            setIsDeleting(false);
          }}
          text="Do you want to delete this draft?"
          isDeleting={isDeleting}
          isSaving={isSaving}
          useSaveInsteadOfCancel={true}
          onSave={async () => {
            setIsSaving(true);
            await saveWorkflowAction(true);
            setIsSaving(false);
          }}
        />
        <AlertDialog
          confirmWhat="Workflow changes"
          open={isConfirmDialogOpen}
          setOpen={setConfirmDialogOpen}
          onDiscard={() => {
            setConfirmDialogOpen(false);
            router.back();
          }}
          text="You have unsaved changes in your workflow. Would you like to save them before leaving?"
          confirmButtonLabel="Save"
          onSave={() => saveWorkflowAction(true)}
        />
      </div>
    </>
  );
}
