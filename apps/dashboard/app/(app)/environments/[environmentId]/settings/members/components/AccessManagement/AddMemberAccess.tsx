import { Control, Controller } from "react-hook-form";

import { Label } from "@typeflowai/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@typeflowai/ui/Select";

enum MembershipAccess {
  Admin = "admin",
  Editor = "editor",
  Developer = "developer",
  Viewer = "viewer",
}

type AddMemberAccess = {
  control: Control<{ name: string; email: string; role: MembershipAccess }, any>;
};

export const AddMemberAccess = ({ control }: AddMemberAccess) => {
  return (
    <Controller
      name="role"
      control={control}
      render={({ field: { onChange, value } }) => (
        <div>
          <Label>Role</Label>
          <Select value={value} onValueChange={(v) => onChange(v as MembershipAccess)}>
            <SelectTrigger className="capitalize">
              <SelectValue placeholder={<span className="text-slate-400">Select role</span>} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(MembershipAccess).map((role) => (
                  <SelectItem className="capitalize" key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    />
  );
};
