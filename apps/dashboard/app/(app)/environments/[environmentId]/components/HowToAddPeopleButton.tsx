import { HelpCircleIcon } from "lucide-react";

import { Button } from "@typeflowai/ui/Button";

export default function HowToAddPeopleButton() {
  return (
    <Button variant="secondary" href="https://typeflowai.com/docs/attributes/identify-users" target="_blank">
      <HelpCircleIcon className="mr-2 h-4 w-4" />
      How to add people
    </Button>
  );
}
