import { cn } from "@/lib/utils";
import { VNode } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import { TPlacement } from "@typeflowai/types/common";

interface ModalProps {
  children: VNode;
  isOpen: boolean;
  placement: TPlacement;
  clickOutside: boolean;
  darkOverlay: boolean;
  highlightBorderColor: string | null;
  onClose: () => void;
}

export default function Modal({
  children,
  isOpen,
  placement,
  clickOutside,
  darkOverlay,
  highlightBorderColor,
  onClose,
}: ModalProps) {
  const [show, setShow] = useState(false);
  const isCenter = placement === "center";
  const modalRef = useRef(null);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isCenter) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        clickOutside &&
        show &&
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, clickOutside, onClose, isCenter]);

  // This classes will be applied only when screen size is greater than sm, hence sm is common prefix for all
  const getPlacementStyle = (placement: TPlacement) => {
    switch (placement) {
      case "bottomRight":
        return "sm:bottom-3 sm:right-3";
      case "topRight":
        return "sm:top-3 sm:right-3 sm:bottom-3";
      case "topLeft":
        return "sm:top-3 sm:left-3 sm:bottom-3";
      case "bottomLeft":
        return "sm:bottom-3 sm:left-3";
      case "center":
        return "sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2";
      default:
        return "sm:bottom-3 sm:right-3";
    }
  };

  const highlightBorderColorStyle = useMemo(() => {
    if (!highlightBorderColor)
      return {
        overflow: "visible",
      };

    return {
      borderRadius: "8px",
      border: "2px solid",
      borderColor: highlightBorderColor,
    };
  }, [highlightBorderColor]);

  if (!show) return null;

  return (
    <div
      aria-live="assertive"
      className={cn(
        isCenter ? "pointer-events-auto" : "pointer-events-none",
        "z-999999 fixed inset-0 flex items-end"
      )}>
      <div
        className={cn(
          "relative h-full w-full",
          isCenter
            ? darkOverlay
              ? "bg-gray-700/80"
              : "bg-white/50"
            : "bg-none transition-all duration-500 ease-in-out"
        )}>
        <div
          ref={modalRef}
          className={cn(
            getPlacementStyle(placement),
            show ? "opacity-100" : "opacity-0",
            "border-border pointer-events-auto absolute bottom-0 h-fit w-full overflow-visible rounded-lg border bg-white shadow-lg transition-all duration-500 ease-in-out sm:m-4 sm:max-w-sm"
          )}>
          {!isCenter && (
            <div class="absolute right-0 top-0 block pr-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                class="text-close-button hover:text-close-button-focus focus:ring-close-button-focus relative h-5 w-5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                <span class="sr-only">Close workflow</span>
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4L20 20M4 20L20 4" />
                </svg>
              </button>
            </div>
          )}
          <div style={highlightBorderColorStyle}>{children}</div>
        </div>
      </div>
    </div>
  );
}
