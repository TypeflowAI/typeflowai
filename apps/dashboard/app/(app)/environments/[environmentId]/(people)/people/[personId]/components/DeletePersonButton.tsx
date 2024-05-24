"use client";

import { deletePersonAction } from "@/app/(app)/environments/[environmentId]/(people)/people/[personId]/actions";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { DeleteDialog } from "@typeflowai/ui/DeleteDialog";

interface DeletePersonButtonProps {
  environmentId: string;
  personId: string;
  isViewer: boolean;
}

export const DeletePersonButton = ({ environmentId, personId, isViewer }: DeletePersonButtonProps) => {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeletingPerson, setIsDeletingPerson] = useState(false);

  const handleDeletePerson = async () => {
    try {
      setIsDeletingPerson(true);
      await deletePersonAction(personId);
      router.refresh();
      router.push(`/environments/${environmentId}/people`);
      toast.success("Person deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeletingPerson(false);
    }
  };

  if (isViewer) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => {
          setDeleteDialogOpen(true);
        }}>
        <TrashIcon className="h-5 w-5 text-slate-500 hover:text-red-700" />
      </button>
      <DeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        deleteWhat="person"
        onDelete={handleDeletePerson}
        isDeleting={isDeletingPerson}
      />
    </>
  );
};
