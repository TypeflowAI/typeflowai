import clsx from "clsx";

const styles = {
  questions: {
    container: "bg-violet-100",
    title: "text-violet-950",
    body: "text-violet-950 [--tw-prose-background:theme(colors.violet.100)] [--tw-prose-bullets:theme(colors.violet.950)] [--tw-prose-th-borders:theme(colors.violet.950)] [--tw-prose-td-borders:theme(colors.violet.950)] prose-a:text-violet-950 prose-code:text-violet-950",
  },
  // result: {
  //   container: "bg-violet-950 text-white",
  //   title: "text-white",
  //   body: "text-white  [--tw-prose-bold:theme(colors.white)] [--tw-prose-background:theme(colors.violet.950)] [--tw-prose-bullets:theme(colors.white)] [--tw-prose-th-borders:theme(colors.white)] [--tw-prose-td-borders:theme(colors.white)] prose-a:text-white prose-tr:text-white prose-th:text-white prose-a:hover:text-white prose-code:text-white ",
  // },
  result: {
    container: "bg-violet-200 text-violet-950",
    title: "text-violet-950",
    body: "text-violet-950  [--tw-prose-bold:theme(colors.violet.950)] [--tw-prose-background:theme(colors.violet.950)] [--tw-prose-bullets:theme(colors.violet.950)] [--tw-prose-th-borders:theme(colors.violet.950)] [--tw-prose-td-borders:theme(colors.violet.950)] prose-a:text-violet-950 prose-code:text-violet-950 prose-tr:text-violet-950 prose-th:text-violet-950 prose-a:hover:text-violet-950 prose-code:text-violet-950 ",
  },
};

interface UseCaseCalloutProps {
  type: "questions" | "result";
  title: string;
  children: React.ReactNode;
}

export function UseCaseCallout({ type = "questions", title, children }: UseCaseCalloutProps) {
  return (
    <div className={clsx("my-8 flex max-w-5xl rounded-xl p-6", styles[type].container)}>
      <div className="ml-4 flex-auto">
        <p className={clsx("use-case-title m-0 font-semibold", styles[type].title)}>{title}</p>
        <div className={clsx("prose mt-2.5", styles[type].body)}>{children}</div>
      </div>
    </div>
  );
}
