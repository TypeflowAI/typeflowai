import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";

import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Modal } from "@typeflowai/ui/Modal";
import { RadioGroup, RadioGroupItem } from "@typeflowai/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@typeflowai/ui/Select";

interface EventDetailModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const AddNoCodeEventModalDummy: React.FC<EventDetailModalProps> = ({ open, setOpen }) => {
  return (
    <Modal open={open} setOpen={setOpen} noPadding>
      <div className="flex flex-col rounded-lg bg-slate-50">
        <div className="bg-slate-90">
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 text-slate-500">
                <CursorArrowRaysIcon />
              </div>
              <div>
                <div className="text-lg font-medium text-slate-700">Add Action</div>
                <div className="text-sm text-slate-500">
                  Create a new user action to display workflows when it&apos;s triggered.
                </div>
              </div>
            </div>
          </div>
        </div>
        <form>
          <div className="space-y-4 p-4 sm:p-6">
            <div>
              <Label>Select By</Label>
              <RadioGroup className="grid grid-cols-1 gap-2 sm:grid-cols-2" defaultValue="pageUrl">
                <div className="flex items-center space-x-2 rounded-lg border border-slate-200 p-3">
                  <RadioGroupItem
                    value="pageUrl"
                    id="pageUrl"
                    className="flex items-center justify-center bg-slate-50">
                    <div className="h-2 w-2 rounded-full bg-black" />
                  </RadioGroupItem>
                  <Label htmlFor="pageUrl" className="cursor-pointer">
                    Page URL
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-slate-50 p-3">
                  <RadioGroupItem disabled value="innerHtml" id="innerHtml" className="bg-slate-50" />
                  <Label htmlFor="innerHtml" className="flex cursor-not-allowed items-center text-slate-500">
                    Inner Text
                  </Label>
                </div>
                <div className="hidden items-center space-x-2 rounded-lg bg-slate-50 p-3 md:flex">
                  <RadioGroupItem disabled value="cssSelector" id="cssSelector" className="bg-slate-50" />
                  <Label
                    htmlFor="cssSelector"
                    className="flex cursor-not-allowed items-center text-slate-500">
                    CSS Selector
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2 sm:flex sm:justify-between sm:gap-x-4 sm:space-y-0">
              <div className="sm:w-1/2">
                <Label>Name</Label>
                <Input placeholder="e.g. Dashboard Page View" defaultValue="Dashboard view" />
              </div>
              <div className="sm:w-1/2">
                <Label>Description</Label>
                <Input placeholder="e.g. User visited dashboard" defaultValue="User visited dashboard" />
              </div>
            </div>
            <div className="space-y-2 sm:flex sm:justify-between sm:gap-x-4">
              <div className="w-full">
                <Label>URL</Label>
                <Select defaultValue="endsWith">
                  <SelectTrigger
                    className="w-[110px] md:w-[180px]"
                    onClick={(e) => e.preventDefault()}
                    disabled>
                    <SelectValue placeholder="Select match type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exactMatch">Exactly matches</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="startsWith">Starts with</SelectItem>
                    <SelectItem value="endsWith">Ends with</SelectItem>
                    <SelectItem value="notMatch">Does not exactly match</SelectItem>
                    <SelectItem value="notContains">Does not contain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-2 w-full sm:mt-0">
                <Input type="text" defaultValue="/dashboard" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center pb-8 sm:mt-8 sm:justify-end">
            <div className="flex space-x-4">
              <Button
                variant="minimal"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                }}>
                Add event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddNoCodeEventModalDummy;
