"use client";

import { updateProductAction } from "@/app/(app)/onboarding/actions";
import { isLight } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { TProduct } from "@typeflowai/types/product";
import { Button } from "@typeflowai/ui/Button";
import { ColorPicker } from "@typeflowai/ui/ColorPicker";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import LoadingSpinner from "@typeflowai/ui/LoadingSpinner";
import { trackEvent } from "@typeflowai/ui/PostHogClient";

type Product = {
  done: () => void;
  environmentId: string;
  isLoading: boolean;
  product: TProduct;
};

const Product: React.FC<Product> = ({ done, isLoading, environmentId, product }) => {
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [color, setColor] = useState("##4748b");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleColorChange = (color) => {
    setColor(color);
  };

  useEffect(() => {
    if (!product) {
      return;
    } else if (product && product.name !== "My Product") {
      done(); // when product already exists, skip product step entirely
    } else {
      if (product) {
        setColor(product.brandColor);
      }
      setLoading(false);
    }
  }, [product, done]);

  const dummyChoices = ["❤️ Love it!"];

  const handleDoneClick = async () => {
    if (!name || !environmentId) {
      return;
    }

    try {
      await updateProductAction(product.id, { name, brandColor: color });
      trackEvent("TeamCreated", { productName: name });
    } catch (e) {
      toast.error("An error occured saving your settings");
      console.error(e);
    }

    done();
  };

  const handleLaterClick = async () => {
    done();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <ErrorComponent />;
  }
  const buttonStyle = {
    backgroundColor: color,
    color: isLight(color) ? "black" : "white",
  };

  return (
    <div className="flex w-full max-w-xl flex-col gap-8 px-8">
      <div className="px-4">
        <label className="mb-1.5 block text-base font-semibold leading-6 text-slate-900">
          Create your team&apos;s product.
        </label>
        <label className="block text-sm font-normal leading-6 text-slate-500">
          You can always change these settings later.
        </label>
        <div className="mt-6 flex flex-col gap-2">
          <div className="pb-2">
            <div className="flex justify-between">
              <Label htmlFor="product">Your product name</Label>
              <span className="text-xs text-slate-500">Required</span>
            </div>
            <div className="mt-2">
              <Input
                id="product"
                type="text"
                placeholder="e.g. TypeflowAI"
                value={name}
                onChange={handleNameChange}
                aria-label="Your product name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="color">Primary color</Label>
            <div className="mt-2">
              <ColorPicker color={color} onChange={handleColorChange} />
            </div>
          </div>
          <div className="relative flex cursor-not-allowed flex-col items-center gap-4 rounded-md border border-slate-300 px-16 py-8">
            <div
              className="absolute left-0 right-0 top-0 h-full w-full opacity-10"
              style={{ backgroundColor: color }}
            />
            <p className="text-xs text-slate-500">This is what your workflow will look like:</p>
            <div className="relative w-full max-w-sm cursor-not-allowed rounded-lg bg-white px-4 py-6 shadow-lg ring-1 ring-black ring-opacity-5 sm:p-6">
              <label className="mb-1.5 block text-base font-semibold leading-6 text-slate-900">
                How do you like {name || "TypeflowAI"}
              </label>
              <div className="mt-4">
                <fieldset>
                  <legend className="sr-only">Choices</legend>
                  <div className=" relative space-y-2 rounded-md">
                    {dummyChoices.map((choice) => (
                      <label
                        key={choice}
                        className="relative z-10 flex flex-col rounded-md border border-slate-400 bg-slate-50 p-4 hover:bg-slate-50 focus:outline-none">
                        <span className="flex items-center text-sm">
                          <input
                            checked
                            readOnly
                            type="radio"
                            className="h-4 w-4 border border-gray-300 focus:ring-0 focus:ring-offset-0"
                            style={{ borderColor: "brandColor", color: "brandColor" }}
                          />
                          <span className="ml-3 font-medium">{choice}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="mt-4 flex w-full justify-end">
                <Button className="pointer-events-none" style={buttonStyle}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button size="lg" className="mr-2" variant="minimal" id="product-skip" onClick={handleLaterClick}>
          I&apos;ll do it later
        </Button>
        <Button
          size="lg"
          variant="darkCTA"
          loading={isLoading}
          disabled={!name || !environmentId}
          onClick={handleDoneClick}>
          {isLoading ? "Getting ready..." : "Done"}
        </Button>
      </div>
    </div>
  );
};

export default Product;
