import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { NextResponse } from "next/server";

import { updateDisplay } from "@typeflowai/lib/display/service";
import { ZDisplayUpdateInput } from "@typeflowai/types/displays";

interface Context {
  params: {
    displayId: string;
    environmentId: string;
  };
}

export async function OPTIONS(): Promise<NextResponse> {
  return responses.successResponse({}, true);
}

export async function PUT(request: Request, context: Context): Promise<NextResponse> {
  const { displayId, environmentId } = context.params;
  const jsonInput = await request.json();
  const inputValidation = ZDisplayUpdateInput.safeParse({
    ...jsonInput,
    environmentId,
  });

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  try {
    await updateDisplay(displayId, inputValidation.data);
    return responses.successResponse({}, true);
  } catch (error) {
    console.error(error);
    return responses.internalServerErrorResponse(error.message, true);
  }
}
