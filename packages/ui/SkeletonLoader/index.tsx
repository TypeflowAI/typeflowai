import { Skeleton } from "../Skeleton";

type SkeletonLoaderProps = {
  type: "response" | "summary";
};

export function SkeletonLoader({ type }: SkeletonLoaderProps) {
  if (type === "summary") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
        <Skeleton className="group space-y-4 rounded-lg bg-white p-6 ">
          <div className="flex items-center space-x-4">
            <div className=" h-6 w-full rounded-full bg-slate-100"></div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-6 w-24 rounded-full bg-slate-100"></div>
              <div className="h-6 w-24 rounded-full bg-slate-100"></div>
            </div>
            <div className=" flex h-12 w-full items-center justify-center rounded-full bg-slate-50 text-sm text-slate-500 hover:bg-slate-100"></div>
            <div className="h-12 w-full rounded-full bg-slate-50/50"></div>
          </div>
        </Skeleton>
      </div>
    );
  }

  if (type === "response") {
    return (
      <div className="group space-y-4 rounded-lg bg-white p-6 ">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-100"></Skeleton>
          <Skeleton className=" h-6 w-full rounded-full bg-slate-100"></Skeleton>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-full bg-slate-100"></Skeleton>
          <Skeleton className=" flex h-12 w-full items-center justify-center rounded-full bg-slate-50 text-sm text-slate-500 hover:bg-slate-100"></Skeleton>
          <Skeleton className="h-12 w-full rounded-full bg-slate-50/50"></Skeleton>
        </div>
      </div>
    );
  }
}
