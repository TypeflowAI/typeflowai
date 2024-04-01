"use client";

import { sendLinkWorkflowEmailAction } from "@/app/s/[workflowId]/actions";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";

export default function VerifyEmail({
  workflow,
  isErrorComponent,
}: {
  workflow: TWorkflow;
  isErrorComponent?: boolean;
}) {
  const [showPreviewQuestions, setShowPreviewQuestions] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (inputEmail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const submitEmail = async (email) => {
    setIsLoading(true);
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      setIsLoading(false);
      return;
    }
    const data = {
      workflowId: workflow.id,
      email: email,
      workflowData: workflow.verifyEmail,
    };
    try {
      await sendLinkWorkflowEmailAction(data);
      setEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const handlePreviewClick = () => {
    setShowPreviewQuestions(!showPreviewQuestions);
  };

  const handleGoBackClick = () => {
    setShowPreviewQuestions(false);
    setEmailSent(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitEmail(email);
    }
  };

  if (isErrorComponent) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50">
        <span className="h-24 w-24 rounded-full bg-slate-300 p-6 text-5xl">🤔</span>
        <p className="mt-8 text-4xl font-bold">This looks fishy.</p>
        <p className="mt-4 cursor-pointer text-sm text-slate-400" onClick={handleGoBackClick}>
          Please try again with the original link
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <Toaster />
      {!emailSent && !showPreviewQuestions && (
        <div className="flex flex-col items-center justify-center px-4">
          <EnvelopeIcon className="h-24 w-24 rounded-full bg-slate-300 p-6 text-white" />
          <p className="mt-8 text-2xl font-bold lg:text-4xl">Verify your email to respond.</p>
          <p className="mt-2 text-sm text-slate-400 lg:text-base">
            To respond to this workflow please verify your email.
          </p>
          <div className="mt-6 flex w-full space-x-2">
            <Input
              type="string"
              placeholder="user@gmail.com"
              className="h-12"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="darkCTA" onClick={() => submitEmail(email)} loading={isLoading}>
              Verify
            </Button>
          </div>
          <p className="mt-6 cursor-pointer text-xs text-slate-400" onClick={handlePreviewClick}>
            Just curious? <span className="underline">Preview workflow questions.</span>
          </p>
        </div>
      )}
      {!emailSent && showPreviewQuestions && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-4xl font-bold">Question Preview</p>
          <div className="mt-4 flex w-full flex-col justify-center rounded-lg border border-slate-200 p-8">
            {workflow.questions.map((question, index) => (
              <p key={index} className="my-1">{`${index + 1}. ${question.headline}`}</p>
            ))}
          </div>
          <p className="mt-6 cursor-pointer text-xs text-slate-400" onClick={handlePreviewClick}>
            Want to respond? <span className="underline">Verify email.</span>
          </p>
        </div>
      )}
      {emailSent && (
        <div className="flex flex-col items-center justify-center px-4">
          <h1 className="mt-8 text-2xl font-bold lg:text-4xl">Check your email.</h1>
          <p className="mt-4 text-center text-sm text-slate-400 lg:text-base">
            We sent an email to <span className="font-semibold italic">{email}</span>. Please click the link
            in the email to take your workflow.
          </p>
          <p className="mt-6 cursor-pointer text-sm text-slate-400" onClick={handleGoBackClick}>
            Go Back
          </p>
        </div>
      )}
    </div>
  );
}
