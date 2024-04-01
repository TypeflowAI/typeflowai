import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();

  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
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

    await supabase.auth.getSession();

    const { data: userPasswordUpdated, error: resetPasswordError } = await supabase.auth.updateUser({
      password: password,
    });

    if (resetPasswordError) {
      throw resetPasswordError;
    }

    if (!userPasswordUpdated) {
      return NextResponse.json({ error: "User passwod have not been updated" }, { status: 409 });
    }

    return NextResponse.json({});
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
