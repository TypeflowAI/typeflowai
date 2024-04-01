import FormWrapper from "@/app/(auth)/auth/components/FormWrapper";
import SidebarLogin from "@/app/(auth)/auth/components/SidebarLogin";
import { SigninForm } from "@/app/(auth)/auth/login/components/SigninForm";
import { createServerClient } from "@supabase/ssr";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AZURE_OAUTH_ENABLED,
  GITHUB_OAUTH_ENABLED,
  GOOGLE_OAUTH_ENABLED,
  PASSWORD_RESET_DISABLED,
  SIGNUP_ENABLED,
} from "@typeflowai/lib/constants";

export const metadata: Metadata = {
  title: "Login",
  description: "Next-Gen AI Forms with GPT Superpowers.",
};

export default async function SignInPage() {
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

  if (session) {
    redirect(`/`);
  }
  return (
    <div className="grid min-h-screen w-full bg-gradient-to-tr from-slate-100 to-slate-50 lg:grid-cols-5">
      <div className="col-span-2 hidden lg:flex">
        <SidebarLogin />
      </div>
      <div className="col-span-3 flex flex-col items-center justify-center">
        <FormWrapper>
          <SigninForm
            publicSignUpEnabled={SIGNUP_ENABLED}
            passwordResetEnabled={!PASSWORD_RESET_DISABLED}
            googleOAuthEnabled={GOOGLE_OAUTH_ENABLED}
            githubOAuthEnabled={GITHUB_OAUTH_ENABLED}
            azureOAuthEnabled={AZURE_OAUTH_ENABLED}
          />
        </FormWrapper>
      </div>
    </div>
  );
}
