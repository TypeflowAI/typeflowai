import { Metadata } from "next";

import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";

export const metadata: Metadata = {
  title: "Integrations",
};

export default function IntegrationsLayout({ children }) {
  return (
    <>
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
