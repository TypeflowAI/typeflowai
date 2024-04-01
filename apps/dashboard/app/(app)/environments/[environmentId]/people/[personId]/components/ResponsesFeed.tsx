import { TEnvironment } from "@typeflowai/types/environment";
import { TResponse } from "@typeflowai/types/responses";
import { TTag } from "@typeflowai/types/tags";
import { TUser } from "@typeflowai/types/user";
import { TWorkflow } from "@typeflowai/types/workflows";
import EmptySpaceFiller from "@typeflowai/ui/EmptySpaceFiller";
import SingleResponseCard from "@typeflowai/ui/SingleResponseCard";

export default async function ResponseFeed({
  responses,
  environment,
  workflows,
  user,
  environmentTags,
}: {
  responses: TResponse[];
  environment: TEnvironment;
  workflows: TWorkflow[];
  user: TUser;
  environmentTags: TTag[];
}) {
  return (
    <>
      {responses.length === 0 ? (
        <EmptySpaceFiller type="response" environment={environment} />
      ) : (
        responses.map((response, idx) => {
          const workflow = workflows.find((workflow) => {
            return workflow.id === response.workflowId;
          });
          return (
            <div key={idx}>
              {workflow && (
                <SingleResponseCard
                  response={response}
                  workflow={workflow}
                  user={user}
                  pageType="people"
                  environmentTags={environmentTags}
                  environment={environment}
                />
              )}
            </div>
          );
        })
      )}
    </>
  );
}
