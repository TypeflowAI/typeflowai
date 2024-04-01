import { Metadata } from "next";

import ContentWrapper from "@typeflowai/ui/ContentWrapper";

export const metadata: Metadata = {
  title: "Integrations",
};

export default function IntegrationsLayout({ children }) {
  return (
    <>
      <div className="lg:ml-64">
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
}
