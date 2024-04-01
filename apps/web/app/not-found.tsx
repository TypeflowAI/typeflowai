import { Button } from "@typeflowai/ui/Button";

export default function NotFound() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-8xl font-bold text-violet-950">404</h1>
        <h1 className="mb-8 text-xl text-violet-950">Sorry, we couldn’t find the page you’re looking for.</h1>
        <Button href="/" variant="highlight">
          Back to docs
        </Button>
      </div>
    </>
  );
}
