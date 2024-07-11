"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Beacon: any;
  }
}

const HelpscoutBeacon = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      (function (e: Window, t: Document, n: any) {
        function a() {
          const e = t.getElementsByTagName("script")[0];
          const n = t.createElement("script");
          n.type = "text/javascript";
          n.async = true;
          n.src = "https://beacon-v2.helpscout.net";
          e?.parentNode?.insertBefore(n, e);
        }
        if (
          ((e.Beacon = n =
            function (t: string, n: any, a: any) {
              e.Beacon.readyQueue.push({ method: t, options: n, data: a });
            }),
          (n.readyQueue = []),
          t.readyState === "complete")
        )
          return a();
        e.addEventListener("load", a, false);
      })(window, document, window.Beacon || function () {});

      window.Beacon("init", "f82228fa-d133-4a93-8133-b8de4a75a33e");
    }
  }, []);

  return null;
};

export default HelpscoutBeacon;
