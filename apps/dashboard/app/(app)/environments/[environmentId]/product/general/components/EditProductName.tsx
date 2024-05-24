"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { TProduct } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";

import { updateProductAction } from "../actions";

type TEditProductName = {
  name: string;
};

type EditProductNameProps = {
  product: TProduct;
  environmentId: string;
  isProductNameEditDisabled: boolean;
};

const EditProductName: React.FC<EditProductNameProps> = ({
  product,
  environmentId,
  isProductNameEditDisabled,
}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<TEditProductName>({
    defaultValues: {
      name: product.name,
    },
  });
  const productNameValue = watch("name", product.name || "");
  const isNotEmptySpaces = (value: string) => value.trim() !== "";

  const updateProduct: SubmitHandler<TEditProductName> = async (data) => {
    data.name = data.name.trim();
    try {
      if (!isNotEmptySpaces(data.name)) {
        toast.error("Please enter at least one character");
        return;
      }
      if (data.name === product.name) {
        toast.success("This is already your product name");
        return;
      }
      const updatedProduct = await updateProductAction(environmentId, product.id, { name: data.name });
      if (isProductNameEditDisabled) {
        toast.error("Only Owners, Admins and Editors can perform this action.");
        throw new Error();
      }

      if (!!updatedProduct?.id) {
        toast.success("Product name updated successfully.");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error: Unable to save product information`);
    }
  };

  return !isProductNameEditDisabled ? (
    <form className="w-full max-w-sm items-center space-y-2" onSubmit={handleSubmit(updateProduct)}>
      <Label htmlFor="fullname">What&apos;s your product called?</Label>
      <Input
        type="text"
        id="fullname"
        defaultValue={product.name}
        {...register("name", { required: true })}
      />
      <Button
        type="submit"
        variant="darkCTA"
        size="sm"
        loading={isSubmitting}
        disabled={!isNotEmptySpaces(productNameValue) || isSubmitting}>
        Update
      </Button>
    </form>
  ) : (
    <p className="text-sm text-red-700">Only Owners, Admins and Editors can perform this action.</p>
  );
};

export default EditProductName;
