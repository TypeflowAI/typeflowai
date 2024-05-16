"use client";

import { sendLinkWorkflowEmailAction } from "@/app/s/[workflowId]/actions";
import { MailIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { getLocalizedValue } from "@typeflowai/lib/i18n/utils";
import { checkForRecallInHeadline } from "@typeflowai/lib/utils/recall";
import { TWorkflow } from "@typeflowai/types/workflows";
import { Button } from "@typeflowai/ui/Button";
import { Input } from "@typeflowai/ui/Input";
import { StackedCardsContainer } from "@typeflowai/ui/StackedCardsContainer";

export default function VerifyEmail({
  workflow,
  isErrorComponent,
  singleUseId,
  languageCode,
}: {
  workflow: TWorkflow;
  isErrorComponent?: boolean;
  singleUseId?: string;
  languageCode: string;
}) {
  workflow = useMemo(() => {
    return checkForRecallInHeadline(workflow, "default");
  }, [workflow]);

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
      suId: singleUseId ?? "",
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
      <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-slate-50">
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
      <StackedCardsContainer>
        {!emailSent && !showPreviewQuestions && (
          <div className="flex flex-col">
            <div className="mx-auto rounded-full border bg-slate-200 p-6">
              <MailIcon className="mx-auto h-12 w-12 text-white" />
            </div>
            <p className="mt-8 text-2xl font-bold lg:text-4xl">Verify your email to respond.</p>
            <p className="mt-4 text-sm text-slate-500 lg:text-base">
              To respond to this workflow, please verify your email.
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
          <div>
            <p className="text-4xl font-bold">Question Preview</p>
            <div className="mt-4 flex w-full flex-col justify-center rounded-lg border border-slate-200 bg-slate-50 bg-opacity-20 p-8 text-slate-700">
              {workflow.questions.map((question, index) => (
                <p
                  key={index}
                  className="my-1">{`${index + 1}. ${getLocalizedValue(question.headline, languageCode)}`}</p>
              ))}
            </div>
            <p className="mt-6 cursor-pointer text-xs text-slate-400" onClick={handlePreviewClick}>
              Want to respond? <span className="underline">Verify email.</span>
            </p>
          </div>
        )}
        {emailSent && (
          <div>
            {" "}
            <h1 className="mt-8 text-2xl font-bold lg:text-4xl">Check your email.</h1>
            <p className="mt-4 text-center text-sm text-slate-400 lg:text-base">
              We sent an email to <span className="font-semibold italic">{email}</span>. Please click the link
              in the email to take your workflow.
            </p>
            <Button variant="secondary" className="mt-6" onClick={handleGoBackClick} StartIcon={ArrowLeft}>
              Back
            </Button>
          </div>
        )}
      </StackedCardsContainer>
    </div>
  );
}
