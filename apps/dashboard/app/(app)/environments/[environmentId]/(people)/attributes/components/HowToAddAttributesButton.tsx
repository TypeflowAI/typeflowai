import { HelpCircleIcon } from "lucide-react";

import { Button } from "@typeflowai/ui/Button";

export const HowToAddAttributesButton = () => {
  return (
    <Button
      variant="secondary"
      href="https://typeflowai.com/docs/attributes/custom-attributes"
      target="_blank">
      <HelpCircleIcon className="mr-2 h-4 w-4" />
      How to add attributes
    </Button>
  );
};
