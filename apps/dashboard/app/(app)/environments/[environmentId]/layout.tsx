import EnvironmentAlert from "@/app/(app)/environments/[environmentId]/components/EnvironmentAlert";
import EnvironmentsNavbar from "@/app/(app)/environments/[environmentId]/components/EnvironmentsNavbar";
import { ResponseFilterProvider } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { IS_TYPEFLOWAI_CLOUD } from "@typeflowai/lib/constants";
import { hasUserEnvironmentAccess } from "@typeflowai/lib/environment/auth";
import { getEnvironment } from "@typeflowai/lib/environment/service";
import { AuthorizationError } from "@typeflowai/types/errors";
import { ErrorComponent } from "@typeflowai/ui/ErrorComponent";
import ToasterClient from "@typeflowai/ui/ToasterClient";

import TypeflowAIClient from "../../components/TypeflowAIClient";

export default async function EnvironmentLayout({ children, params }) {
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

  if (!session) {
    redirect("/auth/login");
  }
  const hasAccess = await hasUserEnvironmentAccess(session.user.id, params.environmentId);
  if (!hasAccess) {
    throw new AuthorizationError("Not authorized");
  }

  const environment = await getEnvironment(params.environmentId);

  if (!environment) {
    return <ErrorComponent />;
  }

  return (
    <>
      <ResponseFilterProvider>
        <TypeflowAIClient session={session} />
        <ToasterClient />
        <div className="hidden h-screen lg:flex lg:flex-col">
          <EnvironmentsNavbar
            environmentId={params.environmentId}
            session={session}
            isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
            isMobile={false}
          />
          <div className="h-screen">
            <EnvironmentAlert className="ml-64" environment={environment} />
            <main className="h-full flex-1 overflow-y-auto bg-slate-50">
              {children}
              <main />
            </main>
          </div>
        </div>
        <div className="flex w-full lg:hidden">
          <EnvironmentsNavbar
            environmentId={params.environmentId}
            session={session}
            isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
            isMobile={true}
          />
        </div>
        <main className="h-full flex-1 overflow-y-auto bg-slate-50">
          {children}
          <main />
        </main>
        {/* <EnvironmentsNavbar
          environmentId={params.environmentId}
          session={session}
          isTypeflowAICloud={IS_TYPEFLOWAI_CLOUD}
        />
        <main className="h-full flex-1 overflow-y-auto bg-slate-50">
          {children}
          <main />
        </main> */}
      </ResponseFilterProvider>
    </>
  );
}
