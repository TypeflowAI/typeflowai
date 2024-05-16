import { useCallback } from "preact/hooks";

interface SubmitButtonProps {
  buttonLabel: string | undefined;
  isLastQuestion: boolean;
  isPromptVisible: boolean;
  onClick?: () => void;
  focus?: boolean;
  tabIndex?: number;
  type?: "submit" | "button";
}

function SubmitButton({
  buttonLabel,
  isLastQuestion,
  isPromptVisible,
  onClick = () => {},
  tabIndex = 1,
  focus = false,
  type = "submit",
}: SubmitButtonProps) {
  const buttonRef = useCallback(
    (currentButton: HTMLButtonElement | null) => {
      if (currentButton && focus) {
        setTimeout(() => {
          currentButton.focus();
        }, 200);
      }
    },
    [focus]
  );

  return (
    <button
      ref={buttonRef}
      type={type}
      tabIndex={tabIndex}
      autoFocus={focus}
      className="bg-brand border-submit-button-border text-on-brand focus:ring-focus rounded-custom flex items-center border px-3 py-3 text-base font-medium leading-4 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
      onClick={onClick}>
      {buttonLabel || (isLastQuestion ? (isPromptVisible ? "Next" : "Finish") : "Next")}
    </button>
  );
}
export default SubmitButton;
