import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

interface UseCaseHeaderProps {
  title: string;
  tags?: string[];
}

export default function UseCaseHeader({ title, tags }: UseCaseHeaderProps) {
  const plausible = usePlausible();
  const router = useRouter();
  return (
    <div className="grid  grid-cols-2">
      <div>
        <p className="text-brand-dark my-4 text-lg font-semibold sm:my-4">{title}</p>
        <div className="mb-8 flex flex-wrap items-center justify-start gap-2">
          {tags &&
            tags.map((tag, index) => (
              <div
                key={index}
                className="text-brand border-brand mt-2 rounded border bg-transparent px-2 py-1 text-sm transition-all duration-150 focus:scale-105 focus:bg-slate-100 focus:outline-none focus:ring-0 ">
                {tag}
              </div>
            ))}
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="lightCTA"
          size="lg"
          className="my-8 mr-3 px-6"
          onClick={() => {
            router.push("https://dashboard.typeflowai.com/auth/signup");
            plausible("UseCase_CTA_Header");
          }}>
          Try this template
        </Button>
      </div>
    </div>
  );
}
