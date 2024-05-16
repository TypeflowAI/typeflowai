import { CodeIcon, LayoutPanelLeftIcon, ZapIcon } from "lucide-react";

const features = [
  {
    id: "gpt-into-tools",
    name: "Transform Prompts into tools",
    description: "Build a wide suite of AI tools using forms and GPT prompts",
    icon: LayoutPanelLeftIcon,
  },
  {
    id: "embed",
    name: "Embed anywhere",
    description: "Easily share a link, email or integrate with your existing site",
    icon: CodeIcon,
  },
  {
    id: "lead-magnets",
    name: "Build dynamic lead magnets",
    description: "Create dynamic lead magnets, AI quizzes, calculators and more",
    icon: ZapIcon,
  },
];
export const Features: React.FC = () => {
  return (
    <section className="lg:py-15 relative px-4 py-10">
      <div className="relative mx-auto max-w-7xl">
        <div className="lgpy-20 mx-auto max-w-5xl py-10 text-center sm:px-6 lg:px-8" id="features">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl ">
            Improve 5x your business <br /> using a{" "}
            <span className="from-brand-light to-brand-dark bg-gradient-to-b bg-clip-text text-transparent xl:inline">
              question-centric
            </span>{" "}
            approach
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Embed AI-powered forms within essential business operations and elements to enhance productivity
            and enable scalability.
          </p>
        </div>

        <ul role="list" className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
          {features.map((feature) => {
            const IconComponent: React.ElementType = feature.icon;

            return (
              <li
                key={feature.id}
                className="relative col-span-1 flex flex-col rounded-xl bg-violet-950 text-left">
                <div className="flex flex-1 flex-col p-10">
                  <IconComponent className="h-10 w-10 flex-shrink-0 text-lime-400" />
                  <h3 className="my-4 text-2xl font-semibold text-white ">{feature.name}</h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Description</dt>
                    <dd className="text-lg text-white">{feature.description}</dd>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Features;
