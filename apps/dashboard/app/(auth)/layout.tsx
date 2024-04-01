import { Suspense } from "react";

import { NoMobileOverlay } from "@typeflowai/ui/NoMobileOverlay";
import { PHProvider, PostHogPageview } from "@typeflowai/ui/PostHogClient";

export default function AppLayout({ children }) {
  return (
    <>
      <NoMobileOverlay />
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>{children}</PHProvider>
    </>
  );
}
