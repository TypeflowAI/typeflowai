"use client";

import { updateTeamNameAction } from "@/app/(app)/environments/[environmentId]/settings/(team)/members/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { TMembershipRole } from "@typeflowai/types/memberships";
import { TTeam, ZTeam } from "@typeflowai/types/teams";
import { Button } from "@typeflowai/ui/Button";
import { FormControl, FormError, FormField, FormItem, FormLabel, FormProvider } from "@typeflowai/ui/Form";
import { Input } from "@typeflowai/ui/Input";

interface EditTeamNameProps {
  environmentId: string;
  team: TTeam;
  membershipRole?: TMembershipRole;
}

const ZEditTeamNameFormSchema = ZTeam.pick({ name: true });
type EditTeamNameForm = z.infer<typeof ZEditTeamNameFormSchema>;

export const EditTeamNameForm = ({ team, membershipRole }: EditTeamNameProps) => {
  const form = useForm<EditTeamNameForm>({
    defaultValues: {
      name: team.name,
    },
    mode: "onChange",
    resolver: zodResolver(ZEditTeamNameFormSchema),
  });

  const { isViewer } = getAccessFlags(membershipRole);

  const { isSubmitting, isDirty } = form.formState;

  const handleUpdateTeamName: SubmitHandler<EditTeamNameForm> = async (data) => {
    try {
      const name = data.name.trim();
      const updatedOrg = await updateTeamNameAction(team.id, name);

      toast.success("Team name updated successfully.");
      form.reset({ name: updatedOrg.name });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return isViewer ? (
    <p className="text-sm text-red-700">You are not authorized to perform this action.</p>
  ) : (
    <FormProvider {...form}>
      <form className="w-full max-w-sm items-center" onSubmit={form.handleSubmit(handleUpdateTeamName)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  isInvalid={!!fieldState.error?.message}
                  placeholder="Team Name"
                  required
                />
              </FormControl>

              <FormError />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4"
          variant="darkCTA"
          size="sm"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty}>
          Update
        </Button>
      </form>
    </FormProvider>
  );
};
