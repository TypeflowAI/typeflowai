import { hasTeamAccess } from "@/app/lib/api/apiHelper";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getEnvironments } from "@typeflowai/lib/environment/service";
import { getProduct } from "@typeflowai/lib/product/service";
import { AuthenticationError, AuthorizationError } from "@typeflowai/types/errors";

export async function GET(_: Request, context: { params: { productId: string } }) {
  const productId = context?.params?.productId;
  if (!productId) return notFound();
  // check auth

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

  if (!session) throw new AuthenticationError("Not authenticated");
  const product = await getProduct(productId);
  if (!product) return notFound();
  const hasAccess = await hasTeamAccess(session.user, product.teamId);
  if (!hasAccess) throw new AuthorizationError("Unauthorized");
  // redirect to product's production environment
  const environments = await getEnvironments(product.id);
  const prodEnvironment = environments.find((e) => e.type === "production");
  if (!prodEnvironment) return notFound();
  redirect(`/environments/${prodEnvironment.id}/`);
}
