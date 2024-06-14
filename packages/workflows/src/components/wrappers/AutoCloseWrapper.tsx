import { AutoCloseProgressBar } from "@/components/general/AutoCloseProgressBar";
import React from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

import { TWorkflow } from "@typeflowai/types/workflows";

interface AutoCloseProps {
  workflow: TWorkflow;
  onClose: () => void;
  children: React.ReactNode;
  offset: number;
}

export const AutoCloseWrapper = ({ workflow, onClose, children, offset }: AutoCloseProps) => {
  const [countDownActive, setCountDownActive] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAppWorkflow = workflow.type === "app" || workflow.type === "website";
  const showAutoCloseProgressBar = countDownActive && isAppWorkflow && offset === 0;

  const startCountdown = () => {
    if (!workflow.autoClose) return;

    if (timeoutRef.current) {
      stopCountdown();
    }
    setCountDownActive(true);
    timeoutRef.current = setTimeout(() => {
      onClose();
      setCountDownActive(false);
    }, workflow.autoClose * 1000);
  };

  const stopCountdown = () => {
    setCountDownActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    startCountdown();
    return stopCountdown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow.autoClose]);

  return (
    <div className="h-full w-full">
      {workflow.autoClose && showAutoCloseProgressBar && (
        <AutoCloseProgressBar autoCloseTimeout={workflow.autoClose} />
      )}
      <div onClick={stopCountdown} onMouseOver={stopCountdown} className="h-full w-full">
        {children}
      </div>
    </div>
  );
};
