import { Button } from "./Button";
import { Heading } from "./Heading";

const gettingStarted = [
  {
    href: "/docs/getting-started/quickstart",
    name: "Quickstart",
    description: "Get up and running with our cloud and JavaScript widget",
  },
  {
    href: "/docs/getting-started/framework-guides#next-js",
    name: "Next.js App",
    description: "Integrate the TypeflowAI SDK into a Next.js application with the new app directory",
  },
  {
    href: "/docs/self-hosting/self-hosting-guide",
    name: "Self Hosting Guide",
    description:
      "Host TypeflowAI on your own servers, check out our dedicated Self-hosted Documentation page.",
  },
];

export function GettingStarted() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="getting-started">
        Quick Resources
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-slate-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4">
        {gettingStarted.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-slate-900">{guide.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{guide.description}</p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
