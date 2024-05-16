import { Suspense } from "react";

import { NoMobileOverlay } from "@typeflowai/ui/NoMobileOverlay";

export default function AppLayout({ children }) {
  return (
    <>
      <NoMobileOverlay />
      <Suspense>{children}</Suspense>
    </>
  );
}
