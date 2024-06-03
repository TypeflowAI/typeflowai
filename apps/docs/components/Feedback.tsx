"use client";

import { Transition } from "@headlessui/react";
import { Fragment, forwardRef, useState } from "react";

function CheckIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="10" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 10.813 2.438 2.437c1.218-4.469 4.062-6.5 4.062-6.5"
      />
    </svg>
  );
}

function FeedbackButton(props: Omit<React.ComponentPropsWithoutRef<"button">, "type" | "className">) {
  return (
    <button
      type="submit"
      className="hover:bg-slate-900/2.5 px-3 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      {...props}
    />
  );
}

const FeedbackForm = forwardRef<
  React.ElementRef<"form">,
  Pick<React.ComponentPropsWithoutRef<"form">, "onSubmit">
>(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start">
      <p className="text-sm text-slate-600">Was this page helpful?</p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded-full border border-slate-900/10">
        <FeedbackButton data-response="yes">Yes</FeedbackButton>
        <div className="bg-slate-900/10" />
        <FeedbackButton data-response="no">No</FeedbackButton>
      </div>
    </form>
  );
});

const FeedbackThanks = forwardRef<React.ElementRef<"div">>(function FeedbackThanks(_props, ref) {
  return (
    <div ref={ref} className="absolute inset-0 flex justify-center md:justify-start">
      <div className="ring-brand/20 flex items-center gap-3 rounded-full bg-violet-50/50 py-1 pl-1.5 pr-3 text-sm text-violet-700 ring-1 ring-inset">
        <CheckIcon className="fill-brand h-5 w-5 flex-none stroke-white" />
        Thanks for your feedback!
      </div>
    </div>
  );
});

export function Feedback() {
  let [submitted, setSubmitted] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // event.nativeEvent.submitter.dataset.response
    // => "yes" or "no"

    setSubmitted(true);
  }

  return (
    <div className="relative h-8">
      <Transition
        show={!submitted}
        as={Fragment}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="pointer-events-none duration-300">
        <FeedbackForm onSubmit={onSubmit} />
      </Transition>
      <Transition
        show={submitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300">
        <FeedbackThanks />
      </Transition>
    </div>
  );
}
