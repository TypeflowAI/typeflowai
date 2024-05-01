"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@typeflowai/ui/Button";

type Greeting = {
  next: () => void;
  skip: () => void;
  name: string;
};

const Greeting: React.FC<Greeting> = ({ next, skip, name }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        next();
      }
    };
    const button = buttonRef.current;
    if (button) {
      button.focus();
      button.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (button) {
        button.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [next]);

  return (
    <div className="flex h-full w-full max-w-xl flex-col justify-around gap-8 px-8">
      <div className="mt-auto h-1/2 space-y-6">
        <div className="px-4">
          <h1 className="pb-4 text-4xl font-bold text-slate-900">
            👋 Hi, {name}! <br />
            Welcome to TypeflowAI!
          </h1>
          <p className="text-xl text-slate-500">Let&apos;s finish setting up your account.</p>
        </div>
        <div className="flex justify-between">
          <Button size="lg" variant="minimal" onClick={skip}>
            I&apos;ll do it later
          </Button>
          <Button size="lg" variant="darkCTA" onClick={next} ref={buttonRef} tabIndex={0}>
            Begin (1 min)
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center text-xs text-slate-400">
        <div className="pb-12 pt-8 text-center">
          <p>Your answers will help us improve your experience and help others like you.</p>
          <p>
            <Link href="https://typeflowai.com/privacy-policy" target="_blank" className="underline">
              Click here
            </Link>{" "}
            to learn how we handle your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
