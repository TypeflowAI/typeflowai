import { getPlacementStyle } from "@/app/lib/preview";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@typeflowai/lib/cn";
import { TPlacement } from "@typeflowai/types/common";

export default function Modal({
  children,
  isOpen,
  placement,
  previewMode,
  highlightBorderColor,
  clickOutsideClose,
  darkOverlay,
  borderRadius,
  background,
}: {
  children: ReactNode;
  isOpen: boolean;
  placement: TPlacement;
  previewMode: string;
  highlightBorderColor: string | null | undefined;
  clickOutsideClose: boolean;
  darkOverlay: boolean;
  borderRadius?: number;
  background?: string;
}) {
  const [show, setShow] = useState(true);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const calculateScaling = () => {
    let scaleValue = "1";

    if (previewMode === "mobile") {
      scaleValue = "1";
    } else {
      if (windowWidth > 1600) {
        scaleValue = "1";
      } else if (windowWidth > 1200) {
        scaleValue = ".9";
      } else if (windowWidth > 900) {
        scaleValue = ".8";
      } else {
        scaleValue = "0.7";
      }
    }

    let placementClass = "";

    if (placement === "bottomLeft") {
      placementClass = "bottom left";
    } else if (placement === "bottomRight") {
      placementClass = "bottom right";
    } else if (placement === "topLeft") {
      placementClass = "top left";
    } else if (placement === "topRight") {
      placementClass = "top right";
    }

    return {
      transform: `scale(${scaleValue})`,
      transformOrigin: placementClass,
    };
  };

  const scalingClasses = calculateScaling();
  const overlayStyle = overlayVisible && darkOverlay ? "bg-gray-700/80" : "bg-white/50";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!clickOutsideClose) {
      setOverlayVisible(true);
      setShow(true);
    }
    const previewBase = document.getElementById("preview-workflow-base");
    function handleClickOutside(e: MouseEvent) {
      // Checks if the positioning is center, clickOutsideClose is set & if the click is inside the preview screen but outside the workflow modal
      if (
        scalingClasses.transformOrigin === "" &&
        clickOutsideClose &&
        modalRef.current &&
        previewBase &&
        previewBase.contains(e.target as Node) &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setTimeout(() => {
          setOverlayVisible(false);
          setShow(false);
        }, 500);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickOutsideClose, scalingClasses.transformOrigin]);

  const highlightBorderColorStyle = useMemo(() => {
    if (!highlightBorderColor) return;

    return {
      border: `2px solid ${highlightBorderColor}`,
    };
  }, [highlightBorderColor]);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  // scroll to top whenever question in modal changes
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [children]);

  const slidingAnimationClass =
    previewMode === "desktop"
      ? show
        ? "translate-x-0 opacity-100"
        : "translate-x-32 opacity-0"
      : previewMode === "mobile"
        ? show
          ? "bottom-0"
          : "-bottom-full"
        : "";

  return (
    <div
      id="preview-workflow-base"
      aria-live="assertive"
      className={cn(
        "relative h-full w-full overflow-hidden",
        overlayStyle,
        "transition-all duration-500 ease-in-out"
      )}>
      <div
        ref={modalRef}
        style={{
          ...highlightBorderColorStyle,
          ...scalingClasses,
          ...(borderRadius && {
            borderRadius: `${borderRadius}px`,
          }),
          ...(background && {
            background,
          }),
        }}
        className={cn(
          "no-scrollbar pointer-events-auto absolute h-fit max-h-[90%] w-full max-w-sm bg-white shadow-lg transition-all duration-500 ease-in-out ",
          previewMode === "desktop" ? getPlacementStyle(placement) : "max-w-full",
          slidingAnimationClass
        )}>
        {children}
      </div>
    </div>
  );
}
