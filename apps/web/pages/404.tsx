// 404.js
import { Button } from "@typeflowai/ui/Button";

export default function FourOhFour() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-8xl font-bold text-violet-950">404</h1>
      <h1 className="mb-8 text-xl text-violet-950">Page Not Found</h1>
      <Button href="/" variant="highlight">
        Go back home
      </Button>
    </div>
  );
}
