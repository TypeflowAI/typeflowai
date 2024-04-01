import clsx from "clsx";

interface Highlight {
  name: string;
  description: string;
}

interface HighlightsProps {
  title: string;
  subtitle: string;
  highlights: Highlight[];
  inverted?: boolean;
}

export default function Highlights({ title, subtitle, highlights, inverted }: HighlightsProps) {
  return (
    <section className="relative px-4 py-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl pt-10 text-center sm:px-6 lg:px-8" id="highlights">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl ">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            {subtitle}
          </p>
        </div>

        <ul role="list" className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
          {highlights.map((highlight) => {
            return (
              <li
                className={clsx(
                  inverted ? "bg-lime-100" : "bg-violet-50",
                  "relative col-span-1 mt-8 flex flex-col rounded-xl text-center md:text-left"
                )}>
                <div className="flex flex-1 flex-col p-10">
                  <h3 className="my-2 text-2xl font-medium text-slate-800 ">{highlight.name}</h3>
                  <dl className="mt-1 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Description</dt>
                    <dd className="text-base text-slate-600">{highlight.description}</dd>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
