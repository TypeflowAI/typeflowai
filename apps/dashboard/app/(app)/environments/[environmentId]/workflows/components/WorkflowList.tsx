import { UsageAttributesUpdater } from "@/app/(app)/components/TypeflowAIClient";
import WorkflowDropDownMenu from "@/app/(app)/environments/[environmentId]/workflows/components/WorkflowDropDownMenu";
import WorkflowStarter from "@/app/(app)/environments/[environmentId]/workflows/components/WorkflowStarter";
import { generateWorkflowSingleUseId } from "@/app/lib/singleUseWorkflows";
import { ComputerDesktopIcon, LinkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { getIsEngineLimited } from "@typeflowai/ee/lib/service";
import { WEBAPP_URL } from "@typeflowai/lib/constants";
import { getEnvironment, getEnvironments } from "@typeflowai/lib/environment/service";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getAccessFlags } from "@typeflowai/lib/membership/utils";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { getUser } from "@typeflowai/lib/user/service";
import { getWorkflows } from "@typeflowai/lib/workflow/service";
import type { TEnvironment } from "@typeflowai/types/environment";
import { Badge } from "@typeflowai/ui/Badge";
import { WorkflowStatusIndicator } from "@typeflowai/ui/WorkflowStatusIndicator";

export default async function WorkflowsList({ environmentId }: { environmentId: string }) {
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  const product = await getProductByEnvironmentId(environmentId);
  const team = await getTeamByEnvironmentId(environmentId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (!product) {
    throw new Error("Product not found");
  }

  if (!team) {
    throw new Error("Team not found");
  }

  const user = session && session.user ? await getUser(session.user.id) : null;
  const currentUserMembership = await getMembershipByUserIdTeamId(session?.user.id, team.id);
  const { isViewer } = getAccessFlags(currentUserMembership?.role);
  const isWorkflowCreationDeletionDisabled = isViewer;

  const environment = await getEnvironment(environmentId);
  if (!environment) {
    throw new Error("Environment not found");
  }
  const workflows = await getWorkflows(environmentId);

  const environments: TEnvironment[] = await getEnvironments(product.id);
  const otherEnvironment = environments.find((e) => e.type !== environment.type)!;

  const isEngineLimited = await getIsEngineLimited(team);

  if (workflows.length === 0) {
    return (
      <>
        {user && (
          <WorkflowStarter
            environmentId={environmentId}
            environment={environment}
            product={product}
            user={user}
            isEngineLimited={isEngineLimited}
          />
        )}
      </>
    );
  }

  return (
    <>
      <ul className="grid place-content-stretch gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 ">
        {!isWorkflowCreationDeletionDisabled && (
          <Link href={`/environments/${environmentId}/workflows/templates`}>
            <li className="col-span-1 h-48">
              <div className="delay-50 flex h-full items-center justify-center overflow-hidden rounded-md bg-violet-950 font-light text-white shadow transition ease-in-out hover:scale-105 hover:text-lime-300">
                <div id="main-cta" className="px-4 py-8 sm:p-14 xl:p-10">
                  <PlusIcon className="stroke-thin mx-auto h-14 w-14" />
                  Create Workflow
                </div>
              </div>
            </li>
          </Link>
        )}
        {workflows
          .sort((a, b) => b.updatedAt?.getTime() - a.updatedAt?.getTime())
          .map((workflow) => {
            const isSingleUse = workflow.singleUse?.enabled ?? false;
            const isEncrypted = workflow.singleUse?.isEncrypted ?? false;
            const singleUseId = isSingleUse ? generateWorkflowSingleUseId(isEncrypted) : undefined;
            return (
              <li key={workflow.id} className="relative col-span-1 h-48">
                <div className="delay-50 flex h-full flex-col justify-between rounded-md bg-white shadow transition ease-in-out hover:scale-105">
                  <div className="px-6 py-4">
                    <Badge
                      StartIcon={workflow.type === "link" ? LinkIcon : ComputerDesktopIcon}
                      startIconClassName="mr-2"
                      text={
                        workflow.type === "link"
                          ? "Link Workflow"
                          : workflow.type === "web"
                            ? "In-Product Workflow"
                            : ""
                      }
                      type="gray"
                      size={"tiny"}
                      className="font-base"></Badge>
                    <div className="mt-4 flex flex-row">
                      {workflow.icon && (
                        <Image
                          width={48}
                          height={48}
                          src={workflow.icon}
                          style={{
                            objectFit: "cover",
                          }}
                          className="h-12 w-12"
                          alt="Workflow Image"
                        />
                      )}
                      <div className={`mt-1 ${workflow.icon ? "ml-4" : ""}`}>
                        <p className="my-auto line-clamp-3 text-lg">{workflow.name}</p>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={
                      workflow.status === "draft"
                        ? `/environments/${environmentId}/workflows/${workflow.id}/edit`
                        : `/environments/${environmentId}/workflows/${workflow.id}/summary`
                    }
                    className="absolute h-full w-full"></Link>
                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between px-4 py-2 text-right sm:px-6">
                      <div className="flex items-center">
                        {workflow.status !== "draft" && (
                          <>
                            {(workflow.type === "link" || environment.widgetSetupCompleted) && (
                              <WorkflowStatusIndicator status={workflow.status} />
                            )}
                          </>
                        )}
                        {workflow.status === "draft" && (
                          <span className="text-xs italic text-slate-400">Draft</span>
                        )}
                      </div>
                      <WorkflowDropDownMenu
                        workflow={workflow}
                        key={`workflows-${workflow.id}`}
                        environmentId={environmentId}
                        environment={environment}
                        otherEnvironment={otherEnvironment!}
                        webAppUrl={WEBAPP_URL}
                        singleUseId={singleUseId}
                        isWorkflowCreationDeletionDisabled={isWorkflowCreationDeletionDisabled}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <UsageAttributesUpdater numWorkflows={workflows.length} />
    </>
  );
}
