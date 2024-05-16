import { createOrUpdateIntegrationAction } from "@/app/(app)/environments/[environmentId]/integrations/actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { TIntegrationItem } from "@typeflowai/types/integration";
import {
  TIntegrationGoogleSheets,
  TIntegrationGoogleSheetsConfigData,
  TIntegrationGoogleSheetsInput,
} from "@typeflowai/types/integration/googleSheet";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Checkbox } from "@typeflowai/ui/Checkbox";
import { DropdownSelector } from "@typeflowai/ui/DropdownSelector";
import { Label } from "@typeflowai/ui/Label";
import { Modal } from "@typeflowai/ui/Modal";

import GoogleSheetLogo from "../images/google-sheets-small.png";

interface AddWebhookModalProps {
  environmentId: string;
  open: boolean;
  workflows: TWorkflow[];
  setOpen: (v: boolean) => void;
  spreadsheets: TIntegrationItem[];
  googleSheetIntegration: TIntegrationGoogleSheets;
  selectedIntegration?: (TIntegrationGoogleSheetsConfigData & { index: number }) | null;
}

export default function AddIntegrationModal({
  environmentId,
  workflows,
  open,
  setOpen,
  spreadsheets,
  googleSheetIntegration,
  selectedIntegration,
}: AddWebhookModalProps) {
  const { handleSubmit } = useForm();

  const integrationData = {
    spreadsheetId: "",
    spreadsheetName: "",
    workflowId: "",
    workflowName: "",
    questionIds: [""],
    questions: "",
    createdAt: new Date(),
  };

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isLinkingSheet, setIsLinkingSheet] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<TWorkflow | null>(null);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const existingIntegrationData = googleSheetIntegration?.config?.data;
  const googleSheetIntegrationData: TIntegrationGoogleSheetsInput = {
    type: "googleSheets",
    config: {
      key: googleSheetIntegration?.config?.key,
      email: googleSheetIntegration.config.email,
      data: existingIntegrationData || [],
    },
  };

  useEffect(() => {
    if (selectedWorkflow) {
      const questionIds = selectedWorkflow.questions.map((question) => question.id);
      if (!selectedIntegration) {
        setSelectedQuestions(questionIds);
      }
    }
  }, [selectedIntegration, selectedWorkflow]);

  useEffect(() => {
    if (selectedIntegration) {
      setSelectedSpreadsheet({
        id: selectedIntegration.spreadsheetId,
        name: selectedIntegration.spreadsheetName,
      });
      setSelectedWorkflow(
        workflows.find((workflow) => {
          return workflow.id === selectedIntegration.workflowId;
        })!
      );
      setSelectedQuestions(selectedIntegration.questionIds);
      return;
    }
    resetForm();
  }, [selectedIntegration, workflows]);

  const linkSheet = async () => {
    try {
      if (!selectedSpreadsheet) {
        throw new Error("Please select a spreadsheet");
      }
      if (!selectedWorkflow) {
        throw new Error("Please select a workflow");
      }

      if (selectedQuestions.length === 0) {
        throw new Error("Please select at least one question");
      }
      setIsLinkingSheet(true);
      integrationData.spreadsheetId = selectedSpreadsheet.id;
      integrationData.spreadsheetName = selectedSpreadsheet.name;
      integrationData.workflowId = selectedWorkflow.id;
      integrationData.workflowName = selectedWorkflow.name;
      integrationData.questionIds = selectedQuestions;
      integrationData.questions =
        selectedQuestions.length === selectedWorkflow?.questions.length
          ? "All questions"
          : "Selected questions";
      integrationData.createdAt = new Date();
      if (selectedIntegration) {
        // update action
        googleSheetIntegrationData.config!.data[selectedIntegration.index] = integrationData;
      } else {
        // create action
        googleSheetIntegrationData.config!.data.push(integrationData);
      }
      await createOrUpdateIntegrationAction(environmentId, googleSheetIntegrationData);
      toast.success(`Integration ${selectedIntegration ? "updated" : "added"} successfully`);
      resetForm();
      setOpen(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLinkingSheet(false);
    }
  };

  const handleCheckboxChange = (questionId: string) => {
    setSelectedQuestions((prevValues) =>
      prevValues.includes(questionId)
        ? prevValues.filter((value) => value !== questionId)
        : [...prevValues, questionId]
    );
  };

  const setOpenWithStates = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const resetForm = () => {
    setIsLinkingSheet(false);
    setSelectedSpreadsheet("");
    setSelectedWorkflow(null);
  };

  const deleteLink = async () => {
    googleSheetIntegrationData.config!.data.splice(selectedIntegration!.index, 1);
    try {
      setIsDeleting(true);
      await createOrUpdateIntegrationAction(environmentId, googleSheetIntegrationData);
      toast.success("Integration removed successfully");
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasMatchingId = googleSheetIntegration.config.data.some((configData) => {
    if (!selectedSpreadsheet) {
      return false;
    }
    return configData.spreadsheetId === selectedSpreadsheet.id;
  });

  return (
    <Modal open={open} setOpen={setOpenWithStates} noPadding closeOnOutsideClick={false}>
      <div className="flex h-full flex-col rounded-lg">
        <div className="rounded-t-lg bg-slate-100">
          <div className="flex w-full items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <div className="mr-1.5 h-6 w-6 text-slate-500">
                <Image className="w-12" src={GoogleSheetLogo} alt="Google Sheet logo" />
              </div>
              <div>
                <div className="text-xl font-medium text-slate-700">Link Google Sheet</div>
                <div className="text-sm text-slate-500">Sync responses with a Google Sheet</div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(linkSheet)}>
          <div className="flex justify-between rounded-lg p-6">
            <div className="w-full space-y-4">
              <div>
                <div className="mb-4">
                  <DropdownSelector
                    label="Select Spreadsheet"
                    items={spreadsheets}
                    selectedItem={selectedSpreadsheet}
                    setSelectedItem={setSelectedSpreadsheet}
                    disabled={spreadsheets.length === 0}
                  />
                  {selectedSpreadsheet && hasMatchingId && (
                    <p className="text-xs text-amber-700">
                      <strong>Warning:</strong> You have already connected one workflow with this sheet. Your
                      data will be inconsistent
                    </p>
                  )}
                  <p className="m-1 text-xs text-slate-500">
                    {spreadsheets.length === 0 &&
                      "You have to create at least one spreadshseet to be able to setup this integration"}
                  </p>
                </div>
                <div>
                  <DropdownSelector
                    label="Select Workflow"
                    items={workflows}
                    selectedItem={selectedWorkflow}
                    setSelectedItem={setSelectedWorkflow}
                    disabled={workflows.length === 0}
                  />
                  <p className="m-1 text-xs text-slate-500">
                    {workflows.length === 0 &&
                      "You have to create a workflow to be able to setup this integration"}
                  </p>
                </div>
              </div>
              {selectedWorkflow && (
                <div>
                  <Label htmlFor="Workflows">Questions</Label>
                  <div className="mt-1 rounded-lg border border-slate-200">
                    <div className="grid content-center rounded-lg bg-slate-50 p-3 text-left text-sm text-slate-900">
                      {checkForRecallInHeadline(selectedWorkflow, "default")?.questions.map((question) => (
                        <div key={question.id} className="my-1 flex items-center space-x-2">
                          <label htmlFor={question.id} className="flex cursor-pointer items-center">
                            <Checkbox
                              type="button"
                              id={question.id}
                              value={question.id}
                              className="bg-white"
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() => {
                                handleCheckboxChange(question.id);
                              }}
                            />
                            <span className="ml-2">{getLocalizedValue(question.headline, "default")}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-200 p-6">
            <div className="flex space-x-2">
              {selectedIntegration ? (
                <Button
                  type="button"
                  variant="warn"
                  loading={isDeleting}
                  onClick={() => {
                    deleteLink();
                  }}>
                  Delete
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="minimal"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}>
                  Cancel
                </Button>
              )}
              <Button variant="darkCTA" type="submit" loading={isLinkingSheet}>
                {selectedIntegration ? "Update" : "Link Sheet"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
