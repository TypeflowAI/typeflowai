"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import { Button } from "@typeflowai/ui/Button";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";

const GlobalError = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <ErrorComponent />
          <Button
            variant="secondary"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="mt-2">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
