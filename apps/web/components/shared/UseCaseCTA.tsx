import { useRouter } from "next/router";

import { Button } from "@typeflowai/ui/Button";

interface UseCaseCTAProps {
  href: string;
}

export default function UseCaseHeader({ href }: UseCaseCTAProps) {
  /*   const plausible = usePlausible(); */
  const router = useRouter();
  return (
    <div className="my-8 flex flex-col justify-center space-x-2 space-y-2 whitespace-nowrap align-top sm:flex-row">
      <Button className="mx-auto mt-2 flex w-fit justify-center align-middle" variant="secondary" href={href}>
        Step-by-step manual
      </Button>
      <div className="space-y-1 text-center">
        <Button
          className="bg-slate-800 text-slate-300 hover:text-white"
          onClick={() => {
            router.push("https://dashboard.typeflowai.com/auth/signup");
            /* plausible("BestPractice_SubPage_CTA_TryItNow"); */
          }}>
          Try it now
        </Button>
        <p className="text-xs text-slate-400">It&apos;s free</p>
      </div>
    </div>
  );
}
