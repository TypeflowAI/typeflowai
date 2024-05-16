import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";

import { createDisplay } from "@typeflowai/lib/display/service";
import { capturePosthogEnvironmentEvent } from "@typeflowai/lib/posthogServer";
import { ZDisplayCreateInput } from "@typeflowai/types/displays";
import { InvalidInputError } from "@typeflowai/types/errors";

interface Context {
  params: {
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<Response> {
  return responses.successResponse({}, true);
}

export async function POST(request: Request, context: Context): Promise<Response> {
  const jsonInput = await request.json();
  const inputValidation = ZDisplayCreateInput.safeParse({
    ...jsonInput,
    environmentId: context.params.environmentId,
  });

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  let response = {};

  // create display
  try {
    const { id } = await createDisplay(inputValidation.data);
    response = { id };
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    } else {
      console.error(error);
      return responses.internalServerErrorResponse(error.message);
    }
  }

  await capturePosthogEnvironmentEvent(inputValidation.data.environmentId, "DisplayCreated");

  return responses.successResponse(response, true);
}
