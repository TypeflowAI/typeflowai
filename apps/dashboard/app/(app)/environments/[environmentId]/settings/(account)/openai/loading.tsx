function LoadingCard({ title, description, skeletonLines }) {
  return (
    <div className="my-4 rounded-lg border border-slate-200">
      <div className="grid content-center rounded-lg bg-slate-100 px-6 py-5 text-left text-slate-900">
        <h3 className="text-lg font-medium leading-6">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="w-full">
        <div className="rounded-lg px-6 py-5 hover:bg-slate-100">
          {skeletonLines.map((line, index) => (
            <div key={index} className="mt-4">
              <div className={`animate-pulse rounded-full bg-gray-200 ${line.classes}`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  const cards = [
    {
      title: "API Key",
      description: "Enter your OpenAI API Key.",
      skeletonLines: [{ classes: "h-4 w-28" }, { classes: "h-6 w-64" }],
    },
  ];

  return (
    <div>
      <h2 className="my-4 text-2xl font-medium leading-6 text-slate-800">OpenAI</h2>
      {cards.map((card, index) => (
        <LoadingCard key={index} {...card} />
      ))}
    </div>
  );
}
