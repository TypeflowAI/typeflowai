"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { capitalizeFirstLetter } from "@typeflowai/lib/strings";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { Badge } from "@typeflowai/ui/Badge";
import { Button } from "@typeflowai/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@typeflowai/ui/DropdownMenu";

import { transferPropietaryAction, updateInviteAction, updateMembershipAction } from "../../actions";
import TransferPropietaryModal from "./TransferPropietaryModal";

interface Role {
  isAdminOrOwner: boolean;
  memberRole: TMembershipRole;
  teamId: string;
  memberId?: string;
  memberName: string;
  userId: string;
  memberAccepted: boolean;
  inviteId?: string;
  currentUserRole: string;
}

export const EditMembershipAccess = ({
  isAdminOrOwner,
  memberRole,
  teamId,
  memberId,
  memberName,
  userId,
  memberAccepted,
  inviteId,
  currentUserRole,
}: Role) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTransferPropietaryModalOpen, setTransferPropietaryModalOpen] = useState(false);

  const disableRole =
    memberRole && memberId && userId ? memberRole === "owner" || memberId === userId : false;

  const handleMemberAccessUpdate = async (role: TMembershipRole) => {
    setLoading(true);

    try {
      if (memberAccepted && memberId) {
        await updateMembershipAction(memberId, teamId, { role });
      }

      if (inviteId) {
        await updateInviteAction(inviteId, teamId, { role });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
    router.refresh();
  };

  const handlePropietaryTransfer = async () => {
    setLoading(true);
    try {
      if (memberId) {
        await transferPropietaryAction(teamId, memberId);
      }

      setLoading(false);
      setTransferPropietaryModalOpen(false);
      toast.success("Ownership transferred successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      setLoading(false);
      setTransferPropietaryModalOpen(false);
    }
  };

  const handleAccessChange = (role: TMembershipRole) => {
    if (role === "owner") {
      setTransferPropietaryModalOpen(true);
    } else {
      handleMemberAccessUpdate(role);
    }
  };

  const getMembershipRoles = () => {
    const roles = ["owner", "admin", "editor", "developer", "viewer"];
    if (currentUserRole === "owner" && memberAccepted) {
      return roles;
    }

    return roles.filter((role) => role !== "owner");
  };

  if (isAdminOrOwner) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={disableRole}
              variant="secondary"
              className="flex items-center gap-1 p-2 text-xs"
              loading={loading}
              size="sm">
              <span className="ml-1">{capitalizeFirstLetter(memberRole)}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {!disableRole && (
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={capitalizeFirstLetter(memberRole)}
                onValueChange={(value) => handleAccessChange(value.toLowerCase() as TMembershipRole)}>
                {getMembershipRoles().map((role) => (
                  <DropdownMenuRadioItem key={role} value={role} className="capitalize">
                    {role.toLowerCase()}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <TransferPropietaryModal
          open={isTransferPropietaryModalOpen}
          setOpen={setTransferPropietaryModalOpen}
          memberName={memberName}
          onSubmit={handlePropietaryTransfer}
          isLoading={loading}
        />
      </>
    );
  }

  return <Badge text={capitalizeFirstLetter(memberRole)} type="gray" size="tiny" />;
};
