import { RefObject } from "react";
import { toast } from "react-hot-toast";

import { TWorkflowQuestion } from "@typeflowai/types/workflows";

import { Button } from "../../Button";
import { Input } from "../../Input";

interface FallbackInputProps {
  filteredRecallQuestions: (TWorkflowQuestion | undefined)[];
  fallbacks: { [type: string]: string };
  setFallbacks: (fallbacks: { [type: string]: string }) => void;
  fallbackInputRef: RefObject<HTMLInputElement>;
  addFallback: () => void;
}

export function FallbackInput({
  filteredRecallQuestions,
  fallbacks,
  setFallbacks,
  fallbackInputRef,
  addFallback,
}: FallbackInputProps) {
  const containsEmptyFallback = () => {
    return (
      Object.values(fallbacks)
        .map((value) => value.trim())
        .includes("") || Object.entries(fallbacks).length === 0
    );
  };
  return (
    <div className="fixed z-30 mt-1 rounded-md border border-slate-300 bg-slate-50 p-3 text-xs">
      <p className="font-medium">Add a placeholder to show if the question gets skipped:</p>
      {filteredRecallQuestions.map((recallQuestion) => {
        if (!recallQuestion) return;
        return (
          <div className="mt-2 flex flex-col" key={recallQuestion.id}>
            <div className="flex items-center">
              <Input
                className="placeholder:text-md h-full bg-white"
                ref={fallbackInputRef}
                id="fallback"
                value={fallbacks[recallQuestion.id]?.replaceAll("nbsp", " ")}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    e.preventDefault();
                    if (containsEmptyFallback()) {
                      toast.error("Fallback missing");
                      return;
                    }
                    addFallback();
                  }
                }}
                onChange={(e) => {
                  const newFallbacks = { ...fallbacks };
                  newFallbacks[recallQuestion.id] = e.target.value;
                  setFallbacks(newFallbacks);
                }}
              />
            </div>
          </div>
        );
      })}
      <div className="flex w-full justify-end">
        <Button
          className="mt-2 h-full py-2"
          disabled={containsEmptyFallback()}
          variant="darkCTA"
          onClick={(e) => {
            e.preventDefault();
            addFallback();
          }}>
          Add
        </Button>
      </div>
    </div>
  );
}
