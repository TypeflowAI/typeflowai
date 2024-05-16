"use client";

import { FilterIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { structuredClone } from "@typeflowai/lib/pollyfills/structuredClone";
import { isAdvancedSegment } from "@typeflowai/lib/segment/utils";
import { TAttributeClass } from "@typeflowai/types/attributeClasses";
import { TBaseFilter, TSegment, TSegmentWithWorkflowNames, ZSegmentFilters } from "@typeflowai/types/segment";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import BasicAddFilterModal from "@typeflowai/ui/Targeting/BasicAddFilterModal";
import BasicSegmentEditor from "@typeflowai/ui/Targeting/BasicSegmentEditor";
import ConfirmDeleteSegmentModal from "@typeflowai/ui/Targeting/ConfirmDeleteSegmentModal";
import { UpgradePlanNotice } from "@typeflowai/ui/UpgradePlanNotice";

import { deleteBasicSegmentAction, updateBasicSegmentAction } from "../actions";

type TBasicSegmentSettingsTabProps = {
  environmentId: string;
  setOpen: (open: boolean) => void;
  initialSegment: TSegmentWithWorkflowNames;
  attributeClasses: TAttributeClass[];
  isTypeflowAICloud: boolean;
};

const BasicSegmentSettings = ({
  environmentId,
  initialSegment,
  setOpen,
  attributeClasses,
  isTypeflowAICloud,
}: TBasicSegmentSettingsTabProps) => {
  const router = useRouter();

  const [addFilterModalOpen, setAddFilterModalOpen] = useState(false);
  const [segment, setSegment] = useState<TSegment>(initialSegment);

  const [isUpdatingSegment, setIsUpdatingSegment] = useState(false);
  const [isDeletingSegment, setIsDeletingSegment] = useState(false);

  const [isDeleteSegmentModalOpen, setIsDeleteSegmentModalOpen] = useState(false);

  const handleResetState = () => {
    setSegment(initialSegment);
    setOpen(false);

    router.refresh();
  };

  const handleAddFilterInGroup = (filter: TBaseFilter) => {
    const updatedSegment = structuredClone(segment);
    if (updatedSegment?.filters?.length === 0) {
      updatedSegment.filters.push({
        ...filter,
        connector: null,
      });
    } else {
      updatedSegment?.filters.push(filter);
    }

    setSegment(updatedSegment);
  };

  const handleUpdateSegment = async () => {
    if (!segment.title) {
      toast.error("Title is required.");
      return;
    }

    try {
      setIsUpdatingSegment(true);
      await updateBasicSegmentAction(segment.environmentId, segment.id, {
        title: segment.title,
        description: segment.description ?? "",
        isPrivate: segment.isPrivate,
        filters: segment.filters,
      });

      setIsUpdatingSegment(false);
      toast.success("Segment updated successfully!");
    } catch (err: any) {
      // parse the segment filters to check if they are valid
      const parsedFilters = ZSegmentFilters.safeParse(segment.filters);
      if (!parsedFilters.success) {
        toast.error("Invalid filters. Please check the filters and try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setIsUpdatingSegment(false);
      return;
    }

    setIsUpdatingSegment(false);
    handleResetState();
    router.refresh();
  };

  const handleDeleteSegment = async () => {
    try {
      setIsDeletingSegment(true);
      await deleteBasicSegmentAction(segment.environmentId, segment.id);

      setIsDeletingSegment(false);
      toast.success("Segment deleted successfully!");
      handleResetState();
    } catch (err: any) {
      toast.error("Something went wrong. Please try again.");
    }

    setIsDeletingSegment(false);
  };

  const isSaveDisabled = useMemo(() => {
    // check if title is empty

    if (!segment.title) {
      return true;
    }

    // parse the filters to check if they are valid
    const parsedFilters = ZSegmentFilters.safeParse(segment.filters);
    if (!parsedFilters.success) {
      return true;
    }

    return false;
  }, [segment]);

  if (isAdvancedSegment(segment.filters)) {
    return (
      <p className="italic text-slate-600">
        This is an advanced segment, you cannot edit it. Please upgrade your plan to edit this segment.
      </p>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="rounded-lg bg-slate-50">
          <div className="flex flex-col overflow-auto rounded-lg bg-white">
            <div className="flex w-full items-center gap-4">
              <div className="flex w-1/2 flex-col gap-2">
                <label className="text-sm font-medium text-slate-900">Title</label>
                <div className="relative flex flex-col gap-1">
                  <Input
                    value={segment.title}
                    placeholder="Ex. Power Users"
                    onChange={(e) => {
                      setSegment((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                    className="w-auto"
                  />
                </div>
              </div>

              <div className="flex w-1/2 flex-col gap-2">
                <label className="text-sm font-medium text-slate-900">Description</label>
                <div className="relative flex flex-col gap-1">
                  <Input
                    value={segment.description ?? ""}
                    placeholder="Ex. Power Users"
                    onChange={(e) => {
                      setSegment((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                    className="w-auto"
                  />
                </div>
              </div>
            </div>

            <label className="my-4 text-sm font-medium text-slate-900">Targeting</label>
            <div className="filter-scrollbar flex max-h-96 w-full flex-col gap-4 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
              {segment?.filters?.length === 0 && (
                <div className="-mb-2 flex items-center gap-1">
                  <FilterIcon className="h-5 w-5 text-slate-700" />
                  <h3 className="text-sm font-medium text-slate-700">Add your first filter to get started</h3>
                </div>
              )}

              <BasicSegmentEditor
                environmentId={environmentId}
                segment={segment}
                setSegment={setSegment}
                group={segment.filters}
                attributeClasses={attributeClasses}
              />

              <div>
                <Button variant="secondary" size="sm" onClick={() => setAddFilterModalOpen(true)}>
                  Add Filter
                </Button>
              </div>

              <BasicAddFilterModal
                onAddFilter={(filter) => {
                  handleAddFilterInGroup(filter);
                }}
                open={addFilterModalOpen}
                setOpen={setAddFilterModalOpen}
                attributeClasses={attributeClasses}
              />
            </div>

            {isTypeflowAICloud ? (
              <UpgradePlanNotice
                message="For advanced targeting, please"
                textForUrl="upgrade to the User Identification plan."
                url={`/environments/${environmentId}/settings/billing`}
              />
            ) : (
              <UpgradePlanNotice
                message="For advanced targeting, please"
                textForUrl="request an Enterprise license."
                url="https://typeflowai.com/docs/self-hosting/enterprise"
              />
            )}

            <div className="flex w-full items-center justify-between pt-4">
              <Button
                type="button"
                variant="warn"
                loading={isDeletingSegment}
                onClick={() => {
                  setIsDeleteSegmentModalOpen(true);
                }}
                EndIcon={Trash2}
                endIconClassName="p-0.5">
                Delete
              </Button>
              <Button
                variant="darkCTA"
                type="submit"
                loading={isUpdatingSegment}
                onClick={() => {
                  handleUpdateSegment();
                }}
                disabled={isSaveDisabled}>
                Save Changes
              </Button>
            </div>

            {isDeleteSegmentModalOpen && (
              <ConfirmDeleteSegmentModal
                onDelete={handleDeleteSegment}
                open={isDeleteSegmentModalOpen}
                segment={initialSegment}
                setOpen={setIsDeleteSegmentModalOpen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicSegmentSettings;
