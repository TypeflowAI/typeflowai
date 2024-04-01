import BackToLoginButton from "@/app/(auth)/auth/components/BackToLoginButton";
import FormWrapper from "@/app/(auth)/auth/components/FormWrapper";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignupWithoutVerificationSuccess() {
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
    <FormWrapper>
      <h1 className="leading-2 mb-4 text-center font-bold">User successfully created</h1>
      <p className="text-center">
        Your new user has been created successfully. Please click the button below and sign in to your
        account.
      </p>
      <hr className="my-4" />
      <BackToLoginButton />
    </FormWrapper>
  );
}
