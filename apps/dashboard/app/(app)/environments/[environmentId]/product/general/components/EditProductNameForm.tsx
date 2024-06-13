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

type EditProductNameProps = {
  product: TProduct;
  environmentId: string;
  isProductNameEditDisabled: boolean;
};

const ZProductNameInput = ZProduct.pick({ name: true });

type TEditProductName = z.infer<typeof ZProductNameInput>;

export const EditProductNameForm: React.FC<EditProductNameProps> = ({
  product,
  environmentId,
  isProductNameEditDisabled,
}) => {
  const form = useForm<TEditProductName>({
    defaultValues: {
      name: product.name,
    },
    resolver: zodResolver(ZProductNameInput),
    mode: "onChange",
  });

  const { errors, isDirty } = form.formState;

  const nameError = errors.name?.message;
  const isSubmitting = form.formState.isSubmitting;

  const updateProduct: SubmitHandler<TEditProductName> = async (data) => {
    const name = data.name.trim();
    try {
      if (nameError) {
        toast.error(nameError);
        return;
      }

      const updatedProduct = await updateProductAction(environmentId, product.id, { name });

      if (isProductNameEditDisabled) {
        toast.error("Only Owners, Admins and Editors can perform this action.");
        return;
      }

      if (!!updatedProduct?.id) {
        toast.success("Product name updated successfully.");
        form.resetField("name", { defaultValue: updatedProduct.name });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error: Unable to save product information`);
    }
  };

  return !isProductNameEditDisabled ? (
    <FormProvider {...form}>
      <form className="w-full max-w-sm items-center space-y-2" onSubmit={form.handleSubmit(updateProduct)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">What&apos;s your product called?</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="name"
                  {...field}
                  placeholder="Product Name"
                  autoComplete="off"
                  required
                  isInvalid={!!nameError}
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
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty}>
          Update
        </Button>
      </form>
    </FormProvider>
  ) : (
    <p className="text-sm text-red-700">Only Owners, Admins and Editors can perform this action.</p>
  );
};
