import { Icon } from "@/components/Icon";
import clsx from "clsx";

const styles = {
  note: {
    container: "bg-slate-100",
    title: "text-slate-900",
    body: "text-slate-800 [--tw-prose-background:theme(colors.slate.50)] prose-a:text-slate-900 prose-code:text-slate-900",
  },
  warning: {
    container: "bg-amber-50",
    title: "text-amber-900",
    body: "text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900",
  },
};

const icons = {
  note: (props: any) => <Icon icon="lightbulb" {...props} />,
  warning: (props: any) => <Icon icon="warning" color="amber" {...props} />,
};

interface CalloutProps {
  type: "note" | "warning";
  title: string;
  children: React.ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  let IconComponent = icons[type];

  return (
    <div className={clsx("my-8 flex rounded-3xl p-6", styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx("font-display m-0 text-xl", styles[type].title)}>{title}</p>
        <div className={clsx("prose mt-2.5", styles[type].body)}>{children}</div>
      </div>
    </div>
  );
}
