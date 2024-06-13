"use client";

import { createOrUpdateIntegrationAction } from "@/app/(app)/environments/[environmentId]/integrations/actions";
import { BaseSelectDropdown } from "@/app/(app)/environments/[environmentId]/integrations/airtable/components/BaseSelectDropdown";
import { fetchTables } from "@/app/(app)/environments/[environmentId]/integrations/airtable/lib/airtable";
import AirtableLogo from "@/images/airtableLogo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { replaceHeadlineRecall } from "@typeflowai/lib/utils/recall";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TIntegrationItem } from "@typeflowai/types/integration";
import {
  TIntegrationAirtable,
  TIntegrationAirtableConfigData,
  TIntegrationAirtableInput,
  TIntegrationAirtableTables,
} from "@typeflowai/types/integration/airtable";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Alert, AlertDescription, AlertTitle } from "@typeflowai/ui/Alert";
import { Button } from "@typeflowai/ui/Button";
import { Checkbox } from "@typeflowai/ui/Checkbox";
import { Label } from "@typeflowai/ui/Label";
import { Modal } from "@typeflowai/ui/Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";

type EditModeProps =
  | { isEditMode: false; defaultData?: never }
  | { isEditMode: true; defaultData: IntegrationModalInputs & { index: number } };

type AddIntegrationModalProps = {
  open: boolean;
  setOpenWithStates: (v: boolean) => void;
  environmentId: string;
  airtableArray: TIntegrationItem[];
  workflows: TWorkflow[];
  airtableIntegration: TIntegrationAirtable;
  attributeClasses: TAttributeClass[];
} & EditModeProps;

export type IntegrationModalInputs = {
  base: string;
  table: string;
  workflow: string;
  questions: string[];
};

const NoBaseFoundError = () => {
  return (
    <Alert>
      <AlertTitle>No Airtable bases found</AlertTitle>
      <AlertDescription>Please create a base on Airtable</AlertDescription>
    </Alert>
  );
};

export const AddIntegrationModal = ({
  open,
  setOpenWithStates,
  environmentId,
  airtableArray,
  workflows,
  airtableIntegration,
  isEditMode,
  defaultData,
  attributeClasses,
}: AddIntegrationModalProps) => {
  const router = useRouter();
  const [tables, setTables] = useState<TIntegrationAirtableTables["tables"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, watch, setValue, reset } = useForm<IntegrationModalInputs>();

  useEffect(() => {
    if (isEditMode) {
      const { index: _index, ...rest } = defaultData;
      reset(rest);
      fetchTable(defaultData.base);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  const workflow = watch("workflow");
  const selectedWorkflow = workflows.find((item) => item.id === workflow);
  const submitHandler = async (data: IntegrationModalInputs) => {
    try {
      if (!data.base || data.base === "") {
        throw new Error("Please select a base");
      }

      if (!data.table || data.table === "") {
        throw new Error("Please select a table");
      }

      if (!selectedWorkflow) {
        throw new Error("Please select a workflow");
      }

      if (data.questions.length === 0) {
        throw new Error("Please select at least one question");
      }

      const airtableIntegrationData: TIntegrationAirtableInput = {
        type: "airtable",
        config: {
          key: airtableIntegration?.config?.key,
          data: airtableIntegration.config.data ?? [],
          email: airtableIntegration?.config?.email,
        },
      };

      const currentTable = tables.find((item) => item.id === data.table);
      const integrationData: TIntegrationAirtableConfigData = {
        workflowId: selectedWorkflow.id,
        workflowName: selectedWorkflow.name,
        questionIds: data.questions,
        questions:
          data.questions.length === selectedWorkflow.questions.length
            ? "All questions"
            : "Selected questions",
        createdAt: new Date(),
        baseId: data.base,
        tableId: data.table,
        tableName: currentTable?.name ?? "",
      };

      if (isEditMode) {
        // update action
        airtableIntegrationData.config!.data[defaultData.index] = integrationData;
      } else {
        // create action
        airtableIntegrationData.config?.data.push(integrationData);
      }

      const actionMessage = isEditMode ? "updated" : "added";

      await createOrUpdateIntegrationAction(environmentId, airtableIntegrationData);
      toast.success(`Integration ${actionMessage} successfully`);
      handleClose();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleTable = async (baseId: string) => {
    const data = await fetchTables(environmentId, baseId);

    if (data.tables) {
      setTables(data.tables);
    }
  };

  const fetchTable = async (val: string) => {
    setIsLoading(true);
    await handleTable(val);
    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    setOpenWithStates(false);
  };

  const handleDelete = async (index: number) => {
    try {
      const integrationCopy = { ...airtableIntegration };
      integrationCopy.config.data.splice(index, 1);

      await createOrUpdateIntegrationAction(environmentId, integrationCopy);
      handleClose();
      router.refresh();

      toast.success(`Integration deleted successfully`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Modal open={open} setOpen={handleClose} noPadding>
      <div className="rounded-t-lg bg-slate-100">
        <div className="flex w-full items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <div className="mr-1.5 h-6 w-6 text-slate-500">
              <Image className="w-12" src={AirtableLogo} alt="Airtable logo" />
            </div>
            <div>
              <div className="text-xl font-medium text-slate-700">Link Airtable Table</div>
              <div className="text-sm text-slate-500">Sync responses with an Airtable</div>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="flex rounded-lg p-6">
          <div className="flex w-full flex-col gap-y-4 pt-5">
            {airtableArray.length ? (
              <BaseSelectDropdown
                control={control}
                isLoading={isLoading}
                fetchTable={fetchTable}
                airtableArray={airtableArray}
                setValue={setValue}
                defaultValue={defaultData?.base}
              />
            ) : (
              <NoBaseFoundError />
            )}

            <div className="flex w-full flex-col">
              <Label htmlFor="table">Table</Label>
              <div className="mt-1 flex">
                <Controller
                  control={control}
                  name="table"
                  render={({ field }) => (
                    <Select
                      required
                      disabled={!tables.length}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={defaultData?.table}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      {tables.length ? (
                        <SelectContent>
                          {tables.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : null}
                    </Select>
                  )}
                />
              </div>
            </div>

            {workflows.length ? (
              <div className="flex w-full flex-col">
                <Label htmlFor="workflow">Select Workflow</Label>
                <div className="mt-1 flex">
                  <Controller
                    control={control}
                    name="workflow"
                    render={({ field }) => (
                      <Select
                        required
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("questions", []);
                        }}
                        defaultValue={defaultData?.workflow}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {workflows.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            ) : null}

            {!workflows.length ? (
              <p className="m-1 text-xs text-slate-500">
                You have to create a workflow to be able to setup this integration
              </p>
            ) : null}

            {workflow && selectedWorkflow && (
              <div>
                <Label htmlFor="Workflows">Questions</Label>
                <div className="mt-1 rounded-lg border border-slate-200">
                  <div className="grid content-center rounded-lg bg-slate-50 p-3 text-left text-sm text-slate-900">
                    {replaceHeadlineRecall(selectedWorkflow, "default", attributeClasses)?.questions.map(
                      (question) => (
                        <Controller
                          key={question.id}
                          control={control}
                          name={"questions"}
                          render={({ field }) => (
                            <div className="my-1 flex items-center space-x-2">
                              <label htmlFor={question.id} className="flex cursor-pointer items-center">
                                <Checkbox
                                  type="button"
                                  id={question.id}
                                  value={question.id}
                                  className="bg-white"
                                  checked={field.value?.includes(question.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, question.id])
                                      : field.onChange(field.value?.filter((value) => value !== question.id));
                                  }}
                                />
                                <span className="ml-2">
                                  {getLocalizedValue(question.headline, "default")}
                                </span>
                              </label>
                            </div>
                          )}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-x-2">
              {isEditMode ? (
                <Button
                  onClick={async () => {
                    await handleDelete(defaultData.index);
                  }}
                  type="button"
                  loading={isLoading}
                  variant="warn">
                  Delete
                </Button>
              ) : (
                <Button type="button" loading={isLoading} variant="minimal" onClick={handleClose}>
                  Cancel
                </Button>
              )}

              <Button variant="darkCTA" type="submit">
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
