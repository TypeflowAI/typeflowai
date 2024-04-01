import {
  clientSideApiEndpointsLimiter,
  loginLimiter,
  shareUrlLimiter,
  signUpLimiter,
} from "@/app/middleware/bucket";
import {
  clientSideApiRoute,
  loginRoute,
  shareUrlRoute,
  signupRoute,
} from "@/app/middleware/endpointValidator";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  let ip = request.ip ?? request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? null;
  }

  if (ip) {
    try {
      if (loginRoute(request.nextUrl.pathname)) {
        await loginLimiter.check(ip);
      } else if (signupRoute(request.nextUrl.pathname)) {
        await signUpLimiter.check(ip);
      } else if (clientSideApiRoute(request.nextUrl.pathname)) {
        await clientSideApiEndpointsLimiter.check(ip);
      } else if (shareUrlRoute(request.nextUrl.pathname)) {
        await shareUrlLimiter.check(ip);
      }
      return response;
    } catch (_e) {
      console.log("Rate Limiting IP: ", ip);

      return NextResponse.json({ error: "Too many requests, Please try after a while!" }, { status: 429 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/auth/callback/credentials",
    "/api/v1/users",
    "/api/(.*)/client/:path*",
    "/api/v1/js/actions",
    "/api/v1/client/storage",
    "/share/(.*)/:path",
  ],
};
