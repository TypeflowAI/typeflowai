import { Button } from "@typeflowai/ui/Button";

export default function BackToLoginButton() {
  return (
    <Button variant="secondary" href="/auth/login" className="w-full justify-center">
      Login
    </Button>
  );
}
