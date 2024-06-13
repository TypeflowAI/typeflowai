"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { TProduct, ZProduct } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { FormControl, FormError, FormField, FormItem, FormLabel, FormProvider } from "@typeflowai/ui/Form";
import { Input } from "@typeflowai/ui/Input";

import { updateProductAction } from "../actions";

type EditWaitingTimeProps = {
  environmentId: string;
  product: TProduct;
};

const ZProductRecontactDaysInput = ZProduct.pick({ recontactDays: true });

type EditWaitingTimeFormValues = z.infer<typeof ZProductRecontactDaysInput>;

export const EditWaitingTimeForm: React.FC<EditWaitingTimeProps> = ({ product, environmentId }) => {
  const form = useForm<EditWaitingTimeFormValues>({
    defaultValues: {
      recontactDays: product.recontactDays,
    },
    resolver: zodResolver(ZProductRecontactDaysInput),
    mode: "onChange",
  });

  const { isDirty, isSubmitting } = form.formState;

  const updateWaitingTime: SubmitHandler<EditWaitingTimeFormValues> = async (data) => {
    try {
      const updatedProduct = await updateProductAction(environmentId, product.id, data);
      if (!!updatedProduct?.id) {
        toast.success("Waiting period updated successfully.");
        form.resetField("recontactDays", { defaultValue: updatedProduct.recontactDays });
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex w-full max-w-sm flex-col space-y-4"
        onSubmit={form.handleSubmit(updateWaitingTime)}>
        <FormField
          control={form.control}
          name="recontactDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="recontactDays">Wait X days before showing next workflow:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  id="recontactDays"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange("");
                    }

                    field.onChange(parseInt(value, 10));
                  }}
                />
              </FormControl>
              <FormError />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="darkCTA"
          size="sm"
          className="w-fit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty}>
          Update
        </Button>
      </form>
    </FormProvider>
  );
};
