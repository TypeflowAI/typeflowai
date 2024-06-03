import { Button } from "@typeflowai/ui/Button";

declare global {
  interface Window {
    typeflowai: any;
  }
}

export const FeedbackButton: React.FC = () => {
  return <Button variant="secondary">Open Feedback</Button>;
};

export default FeedbackButton;
