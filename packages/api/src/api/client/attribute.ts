import { TAttributeUpdateInput } from "@typeflowai/types/attributes";
import { Result } from "@typeflowai/types/errorHandlers";
import { NetworkError } from "@typeflowai/types/errors";

import { makeRequest } from "../../utils/makeRequest";

export class AttributeAPI {
  private apiHost: string;
  private environmentId: string;

  constructor(apiHost: string, environmentId: string) {
    this.apiHost = apiHost;
    this.environmentId = environmentId;
  }

  async update(
    attributeUpdateInput: Omit<TAttributeUpdateInput, "environmentId">
  ): Promise<Result<{ changed: boolean; message: string }, NetworkError | Error>> {
    return makeRequest(
      this.apiHost,
      `/api/v1/client/${this.environmentId}/people/${attributeUpdateInput.userId}/attributes`,
      "PUT",
      { attributes: attributeUpdateInput.attributes }
    );
  }
}
