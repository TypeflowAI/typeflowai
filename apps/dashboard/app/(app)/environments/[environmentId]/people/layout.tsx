import { Metadata } from "next";

import ContentWrapper from "@typeflowai/ui/ContentWrapper";

export const metadata: Metadata = {
  title: "People",
};

export default function PeopleLayout({ children }) {
  return (
    <>
      {/* 
      <PeopleGroupsTabs activeId="people" environmentId={params.environmentId} /> */}
      <div className="lg:ml-64">
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </>
  );
}
