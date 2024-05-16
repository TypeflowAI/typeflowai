import PeopleSegmentsTabs from "@/app/(app)/environments/[environmentId]/(peopleAndSegments)/people/components/PeopleSegmentsTabs";
import { Metadata } from "next";

import { ContentWrapper } from "@typeflowai/ui/ContentWrapper";

export const metadata: Metadata = {
  title: "People",
};

export default async function PeopleLayout({ params, children }) {
  return (
    <>
      <PeopleSegmentsTabs activeId="people" environmentId={params.environmentId} />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
