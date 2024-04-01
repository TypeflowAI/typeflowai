"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { TTeam } from "@typeflowai/types/teams";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

import { updateOpenAIApiKeyAction } from "../actions";

type FormData = {
  openaiApiKey: string;
};

export function EditApiKey({ team }: { team: TTeam }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<FormData>();

  const openaiApiKeyValue = watch("openaiApiKey", team.billing.features.ai.openaiApiKey || "");
  const isNotEmptySpaces = (value: string) => value.trim() !== "";

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      data.openaiApiKey = data.openaiApiKey.trim();
      if (!isNotEmptySpaces(data.openaiApiKey)) {
        toast.error("Please enter your API Key.");
        return;
      }
      if (data.openaiApiKey === team.billing.features.ai.openaiApiKey) {
        toast.success("This is already your API Key. No changes were made.");
        return;
      }
      await updateOpenAIApiKeyAction(team, data.openaiApiKey);
      toast.success("Your API Key was updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <form className="w-full  items-center" onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="openai-api-key">Secret Key</Label>
        <Input
          type="text"
          id="openai-api-key"
          defaultValue={team.billing.features.ai.openaiApiKey || ""}
          {...register("openaiApiKey", { required: true })}
        />
        <Button
          type="submit"
          variant="darkCTA"
          className="mt-4"
          loading={isSubmitting}
          disabled={openaiApiKeyValue === "" || isSubmitting}>
          Save
        </Button>
      </form>
    </>
  );
}
