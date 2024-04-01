import { useEffect, useRef, useState } from "preact/hooks";

import { TWorkflow } from "@typeflowai/types/workflows";

import Progress from "../general/Progress";

interface AutoCloseProps {
  workflow: TWorkflow;
  onClose: () => void;
  children: any;
}

export function AutoCloseWrapper({ workflow, onClose, children }: AutoCloseProps) {
  const [countdownProgress, setCountdownProgress] = useState(100);
  const [countdownStop, setCountdownStop] = useState(false);
  const startRef = useRef(performance.now());
  const frameRef = useRef<number | null>(null);

  const handleStopCountdown = () => {
    if (frameRef.current !== null) {
      setCountdownStop(true);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  useEffect(() => {
    if (!workflow.autoClose) return;

    const updateCountdown = () => {
      const timeout = workflow.autoClose! * 1000;
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, timeout - elapsed);

      setCountdownProgress(remaining / timeout);

      if (remaining > 0) {
        frameRef.current = requestAnimationFrame(updateCountdown);
      } else {
        handleStopCountdown();
        onClose();
      }
    };

    setCountdownProgress(1);
    frameRef.current = requestAnimationFrame(updateCountdown);

    return () => handleStopCountdown();
  }, [workflow.autoClose, onClose]);

  return (
    <>
      {!countdownStop && workflow.autoClose && <Progress progress={countdownProgress} />}
      <div onClick={handleStopCountdown} onMouseOver={handleStopCountdown} className="h-full w-full">
        {children}
      </div>
    </>
  );
}
