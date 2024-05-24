"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { TProduct } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

import { updateProductAction } from "../actions";

type EditWaitingTimeFormValues = {
  recontactDays: number;
};

type EditWaitingTimeProps = {
  environmentId: string;
  product: TProduct;
};

const EditWaitingTime: React.FC<EditWaitingTimeProps> = ({ product, environmentId }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditWaitingTimeFormValues>({
    defaultValues: {
      recontactDays: product.recontactDays,
    },
  });

  const updateWaitingTime: SubmitHandler<EditWaitingTimeFormValues> = async (data) => {
    try {
      const updatedProduct = await updateProductAction(environmentId, product.id, data);
      if (!!updatedProduct?.id) {
        toast.success("Waiting period updated successfully.");
        router.refresh();
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <form className="w-full max-w-sm items-center space-y-2" onSubmit={handleSubmit(updateWaitingTime)}>
      <Label htmlFor="recontactDays">Wait X days before showing next workflow:</Label>
      <Input
        type="number"
        id="recontactDays"
        defaultValue={product.recontactDays}
        {...register("recontactDays", {
          min: { value: 0, message: "Must be a positive number" },
          max: { value: 365, message: "Must be less than 365" },
          valueAsNumber: true,
          required: {
            value: true,
            message: "Required",
          },
        })}
      />

      {errors?.recontactDays ? (
        <div className="my-2">
          <p className="text-xs text-red-500">{errors?.recontactDays?.message}</p>
        </div>
      ) : null}

      <Button type="submit" variant="darkCTA" size="sm">
        Update
      </Button>
    </form>
  );
};

export default EditWaitingTime;
