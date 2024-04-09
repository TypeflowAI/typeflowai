import DeleteProductRender from "@/app/(app)/environments/[environmentId]/settings/product/components/DeleteProductRender";
import { getServerSession } from "next-auth";

import { authOptions } from "@typeflowai/lib/authOptions";
import { getMembershipByUserIdTeamId } from "@typeflowai/lib/membership/service";
import { getProducts } from "@typeflowai/lib/product/service";
import { getTeamByEnvironmentId } from "@typeflowai/lib/team/service";
import { TProduct } from "@typeflowai/types/product";

type DeleteProductProps = {
  environmentId: string;
  product: TProduct;
};

export default async function DeleteProduct({ environmentId, product }: DeleteProductProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Session not found");
  }
  const team = await getTeamByEnvironmentId(environmentId);
  if (!team) {
    throw new Error("Team not found");
  }
  const availableProducts = team ? await getProducts(team.id) : null;

  const membership = await getMembershipByUserIdTeamId(session.user.id, team.id);
  if (!membership) {
    throw new Error("Membership not found");
  }
  const role = membership.role;
  const availableProductsLength = availableProducts ? availableProducts.length : 0;
  const isUserAdminOrOwner = role === "admin" || role === "owner";
  const isDeleteDisabled = availableProductsLength <= 1 || !isUserAdminOrOwner;

  return (
    <DeleteProductRender
      isDeleteDisabled={isDeleteDisabled}
      isUserAdminOrOwner={isUserAdminOrOwner}
      product={product}
      environmentId={environmentId}
      userId={session?.user.id ?? ""}
    />
  );
}
