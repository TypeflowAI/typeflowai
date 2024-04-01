import Link from "next/link";

import { ITEMS_PER_PAGE } from "@typeflowai/lib/constants";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { getPeople, getPeopleCount } from "@typeflowai/lib/person/service";
import { truncateMiddle } from "@typeflowai/lib/strings";
import { TPerson } from "@typeflowai/types/people";
import { PersonAvatar } from "@typeflowai/ui/Avatars";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";
import { Pagination } from "@typeflowai/ui/Pagination";

const getAttributeValue = (person: TPerson, attributeName: string) =>
  person.attributes[attributeName]?.toString();

export default async function PeoplePage({
  params,
  searchParams,
}: {
  params: { environmentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNumber = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const [environment, totalPeople] = await Promise.all([
    getEnvironment(params.environmentId),
    getPeopleCount(params.environmentId),
  ]);
  if (!environment) {
    throw new Error("Environment not found");
  }
  const maxPageNumber = Math.ceil(totalPeople / ITEMS_PER_PAGE);
  let hidePagination = false;

  let people: TPerson[] = [];

  if (pageNumber < 1 || pageNumber > maxPageNumber) {
    people = [];
    hidePagination = true;
  } else {
    people = await getPeople(params.environmentId, pageNumber);
  }

  return (
    <>
      {people.length === 0 ? (
        <EmptySpaceFiller
          type="table"
          environment={environment}
          emptyMessage="Your users will appear here as soon as they use your app ⏲️"
        />
      ) : (
        <div className="rounded-lg border border-slate-200">
          <div className="grid h-12 grid-cols-7 content-center rounded-lg bg-slate-100 text-left text-sm font-semibold text-slate-900">
            <div className="col-span-3 pl-6 ">User</div>
            <div className="col-span-2 hidden text-center sm:block">User ID</div>
            <div className="col-span-2 hidden text-center sm:block">Email</div>
          </div>
          {people.map((person) => (
            <Link
              href={`/environments/${params.environmentId}/people/${person.id}`}
              key={person.id}
              className="w-full">
              <div className="m-2 grid h-16  grid-cols-7 content-center rounded-lg hover:bg-slate-100">
                <div className="col-span-3 flex items-center pl-6 text-sm">
                  <div className="flex items-center">
                    <div className="ph-no-capture h-10 w-10 flex-shrink-0">
                      <PersonAvatar personId={person.id} />
                    </div>
                    <div className="ml-4">
                      <div className="ph-no-capture font-medium text-slate-900">
                        {getAttributeValue(person, "email") ? (
                          <span>{getAttributeValue(person, "email")}</span>
                        ) : (
                          <span>{person.id}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 my-auto hidden whitespace-nowrap text-center text-sm text-slate-500 sm:block">
                  <div className="ph-no-capture text-slate-900">
                    {truncateMiddle(getAttributeValue(person, "userId"), 24) || person.userId}
                  </div>
                </div>
                <div className="col-span-2 my-auto hidden whitespace-nowrap text-center text-sm text-slate-500 sm:block">
                  <div className="ph-no-capture text-slate-900">{getAttributeValue(person, "email")}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {hidePagination ? null : (
        <Pagination
          baseUrl={`/environments/${params.environmentId}/people`}
          currentPage={pageNumber}
          totalItems={totalPeople}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </>
  );
}
