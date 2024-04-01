import { cn } from "@typeflowai/lib/cn";
import { Badge } from "@typeflowai/ui/Badge";

export default function SettingsCard({
  title,
  description,
  children,
  soon = false,
  noPadding = false,
  beta,
}: {
  title: string;
  description: string;
  children: any;
  soon?: boolean;
  noPadding?: boolean;
  beta?: boolean;
}) {
  return (
    <div className="my-4 w-full bg-white shadow sm:rounded-lg">
      <div className="border-b border-slate-200 bg-slate-100 px-6 py-5">
        <div className="flex">
          <h3 className="text-lg font-medium leading-6 text-slate-900">{title}</h3>
          <div className="ml-2">
            {beta && <Badge text="Beta" size="normal" type="warning" />}
            {soon && <Badge text="coming soon" size="normal" type="success" />}
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className={cn(noPadding ? "" : "px-6 py-5")}>{children} </div>
    </div>
  );
}
