import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@typeflowai/database";

export async function POST(request: Request) {
  const { email } = await request.json();
  // check for user in DB
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { user: supabaseUser },
      error: verifyEmailError,
    } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (verifyEmailError) throw verifyEmailError;

    if (!supabaseUser) {
      return NextResponse.json({ error: "No user with this email address found" }, { status: 404 });
    }
    if (user && user.emailVerified) {
      return NextResponse.json({ error: "Email address has already been verified" }, { status: 400 });
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      {
        error: e.message,
        errorCode: e.code,
      },
      { status: 500 }
    );
  }
}
