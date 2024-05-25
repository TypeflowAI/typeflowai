import { NextApiResponse } from "next";

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface ApiSuccessResponse<T = { [key: string]: any }> {
  data: T;
}

export interface ApiErrorResponse {
  code:
    | "not_found"
    | "gone"
    | "bad_request"
    | "internal_server_error"
    | "unauthorized"
    | "method_not_allowed"
    | "not_authenticated"
    | "forbidden";
  message: string;
  details: {
    [key: string]: string | string[] | number | number[] | boolean | boolean[];
  };
}

export type CustomNextApiResponse = NextApiResponse<ApiResponse>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const goneResponse = (message: string, details?: { [key: string]: string }, cors: boolean = false) =>
  Response.json(
    {
      code: "gone",
      message,
      details: details || {},
    } as ApiErrorResponse,
    {
      status: 410,
      ...(cors && { headers: corsHeaders }),
    }
  );

const badRequestResponse = (message: string, details?: { [key: string]: string }, cors: boolean = false) =>
  Response.json(
    {
      code: "bad_request",
      message,
      details: details || {},
    } as ApiErrorResponse,
    {
      status: 400,
      ...(cors && { headers: corsHeaders }),
    }
  );

const missingFieldResponse = (field: string, cors: boolean = false) =>
  badRequestResponse(
    `Missing ${field}`,
    {
      missing_field: field,
    },
    cors
  );

const methodNotAllowedResponse = (
  res: CustomNextApiResponse,
  allowedMethods: string[],
  cors: boolean = false
) =>
  Response.json(
    {
      code: "method_not_allowed",
      message: `The HTTP ${res.req?.method} method is not supported by this route.`,
      details: {
        allowed_methods: allowedMethods,
      },
    } as ApiErrorResponse,
    {
      status: 405,
      ...(cors && { headers: corsHeaders }),
    }
  );

const notFoundResponse = (
  resourceType: string,
  resourceId: string,
  cors: boolean = false,
  cache: string = "private, no-store"
) => {
  const headers = {
    ...(cors && corsHeaders),
    "Cache-Control": cache,
  };

  return Response.json(
    {
      code: "not_found",
      message: `${resourceType} not found`,
      details: {
        resource_id: resourceId,
        resource_type: resourceType,
      },
    } as ApiErrorResponse,
    {
      status: 404,
      headers,
    }
  );
};

const notAuthenticatedResponse = (cors: boolean = false) =>
  Response.json(
    {
      code: "not_authenticated",
      message: "Not authenticated",
      details: {
        "x-Api-Key": "Header not provided or API Key invalid",
      },
    } as ApiErrorResponse,
    {
      status: 401,
      ...(cors && { headers: corsHeaders }),
    }
  );

const unauthorizedResponse = (cors: boolean = false) =>
  Response.json(
    {
      code: "unauthorized",
      message: "You are not authorized to access this resource",
      details: {},
    } as ApiErrorResponse,
    {
      status: 401,
      ...(cors && { headers: corsHeaders }),
    }
  );

const forbiddenResponse = (
  message: string,
  cors: boolean = false,
  details: ApiErrorResponse["details"] = {}
) =>
  Response.json(
    {
      code: "forbidden",
      message,
      details,
    } as ApiErrorResponse,
    {
      status: 403,
      ...(cors && { headers: corsHeaders }),
    }
  );

const successResponse = (data: Object, cors: boolean = false, cache: string = "private, no-store") => {
  const headers = {
    ...(cors && corsHeaders),
    "Cache-Control": cache,
  };

  return Response.json(
    {
      data,
    } as ApiSuccessResponse<typeof data>,
    {
      status: 200,
      headers,
    }
  );
};

const internalServerErrorResponse = (
  message: string,
  cors: boolean = false,
  cache: string = "private, no-store"
) => {
  const headers = {
    ...(cors && corsHeaders),
    "Cache-Control": cache,
  };

  return Response.json(
    {
      code: "internal_server_error",
      message,
      details: {},
    } as ApiErrorResponse,
    {
      status: 500,
      headers,
    }
  );
};

const tooManyRequestsResponse = (
  message: string,
  cors: boolean = false,
  cache: string = "private, no-store"
) => {
  const headers = {
    ...(cors && corsHeaders),
    "Cache-Control": cache,
  };

  return Response.json(
    {
      code: "internal_server_error",
      message,
      details: {},
    } as ApiErrorResponse,
    {
      status: 429,
      headers,
    }
  );
};

export const responses = {
  goneResponse,
  badRequestResponse,
  internalServerErrorResponse,
  missingFieldResponse,
  methodNotAllowedResponse,
  notAuthenticatedResponse,
  unauthorizedResponse,
  notFoundResponse,
  successResponse,
  tooManyRequestsResponse,
  forbiddenResponse,
};
