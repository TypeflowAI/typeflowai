import { getApiKeys } from "@typeflowai/lib/apiKey/service";
import { getEnvironments } from "@typeflowai/lib/environment/service";
import { getProductByEnvironmentId } from "@typeflowai/lib/product/service";

import EditApiKeys from "./EditApiKeys";

export default async function ApiKeyList({
  environmentId,
  environmentType,
}: {
  environmentId: string;
  environmentType: string;
}) {
  const findEnvironmentByType = (environments, targetType) => {
    for (const environment of environments) {
      if (environment.type === targetType) {
        return environment.id;
      }
    }
    return null;
  };

  const product = await getProductByEnvironmentId(environmentId);
  if (!product) {
    throw new Error("Product not found");
  }

  const environments = await getEnvironments(product.id);
  const environmentTypeId = findEnvironmentByType(environments, environmentType);
  const apiKeys = await getApiKeys(environmentTypeId);

  return (
    <EditApiKeys
      environmentTypeId={environmentTypeId}
      environmentType={environmentType}
      apiKeys={apiKeys}
      environmentId={environmentId}
    />
  );
}
