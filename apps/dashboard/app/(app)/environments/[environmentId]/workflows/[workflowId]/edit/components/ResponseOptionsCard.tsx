"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as Collapsible from "@radix-ui/react-collapsible";
import { KeyboardEventHandler, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TWorkflow } from "@typeflowai/types/workflows";
import { AdvancedOptionToggle } from "@typeflowai/ui/AdvancedOptionToggle";
import { DatePicker } from "@typeflowai/ui/DatePicker";
import { Input } from "@typeflowai/ui/Input";
import { Label } from "@typeflowai/ui/Label";
import { Switch } from "@typeflowai/ui/Switch";

interface ResponseOptionsCardProps {
  localWorkflow: TWorkflow;
  setLocalWorkflow: (workflow: TWorkflow | ((TWorkflow) => TWorkflow)) => void;
  responseCount: number;
}

export default function ResponseOptionsCard({
  localWorkflow,
  setLocalWorkflow,
  responseCount,
}: ResponseOptionsCardProps) {
  const [open, setOpen] = useState(false);
  const autoComplete = localWorkflow.autoComplete !== null;
  const [redirectToggle, setRedirectToggle] = useState(false);
  const [workflowCloseOnDateToggle, setWorkflowCloseOnDateToggle] = useState(false);
  useState;
  const [redirectUrl, setRedirectUrl] = useState<string | null>("");
  const [workflowClosedMessageToggle, setWorkflowClosedMessageToggle] = useState(false);
  const [verifyEmailToggle, setVerifyEmailToggle] = useState(false);

  const [workflowClosedMessage, setWorkflowClosedMessage] = useState({
    heading: "Workflow Completed",
    subheading: "This free & open-source workflow has been closed",
  });

  const [singleUseMessage, setSingleUseMessage] = useState({
    heading: "The workflow has already been answered.",
    subheading: "You can only use this link once.",
  });

  const [singleUseEncryption, setSingleUseEncryption] = useState(true);
  const [verifyEmailWorkflowDetails, setVerifyEmailWorkflowDetails] = useState({
    name: "",
    subheading: "",
  });
  const [closeOnDate, setCloseOnDate] = useState<Date>();

  const isPinProtectionEnabled = localWorkflow.pin !== null;

  const [verifyProtectWithPinError, setVerifyProtectWithPinError] = useState<string | null>(null);

  const handleRedirectCheckMark = () => {
    setRedirectToggle((prev) => !prev);

    if (redirectToggle && localWorkflow.redirectUrl) {
      setRedirectUrl(null);
      setLocalWorkflow({ ...localWorkflow, redirectUrl: null });
    }
  };

  const handleWorkflowCloseOnDateToggle = () => {
    if (workflowCloseOnDateToggle && localWorkflow.closeOnDate) {
      setWorkflowCloseOnDateToggle(false);
      setCloseOnDate(undefined);
      setLocalWorkflow({ ...localWorkflow, closeOnDate: null });
      return;
    }

    if (workflowCloseOnDateToggle) {
      setWorkflowCloseOnDateToggle(false);
      return;
    }
    setWorkflowCloseOnDateToggle(true);
  };

  const handleProtectWorkflowWithPinToggle = () => {
    setLocalWorkflow((prevWorkflow) => ({ ...prevWorkflow, pin: isPinProtectionEnabled ? null : "1234" }));
  };

  const handleProtectWorkflowPinChange = (pin: string) => {
    //check if pin only contains numbers
    const validation = /^\d+$/;
    const isValidPin = validation.test(pin);
    if (!isValidPin) return toast.error("PIN can only contain numbers");
    setLocalWorkflow({ ...localWorkflow, pin });
  };

  const handleProtectWorkflowPinBlurEvent = () => {
    if (!localWorkflow.pin) return setVerifyProtectWithPinError(null);

    const regexPattern = /^\d{4}$/;
    const isValidPin = regexPattern.test(`${localWorkflow.pin}`);

    if (!isValidPin) return setVerifyProtectWithPinError("PIN must be a four digit number.");
    setVerifyProtectWithPinError(null);
  };

  const handleWorkflowPinInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    if (exceptThisSymbols.includes(e.key)) e.preventDefault();
  };

  const handleRedirectUrlChange = (link: string) => {
    setRedirectUrl(link);
    setLocalWorkflow({ ...localWorkflow, redirectUrl: link });
  };

  const handleCloseWorkflowMessageToggle = () => {
    setWorkflowClosedMessageToggle((prev) => !prev);

    if (workflowClosedMessageToggle && localWorkflow.workflowClosedMessage) {
      setLocalWorkflow({ ...localWorkflow, workflowClosedMessage: null });
    }
  };

  const handleVerifyEmailToogle = () => {
    setVerifyEmailToggle((prev) => !prev);

    if (verifyEmailToggle && localWorkflow.verifyEmail) {
      setLocalWorkflow({ ...localWorkflow, verifyEmail: null });
    }
  };

  const handleCloseOnDateChange = (date: Date) => {
    const equivalentDate = date?.getDate();
    date?.setUTCHours(0, 0, 0, 0);
    date?.setDate(equivalentDate);

    setCloseOnDate(date);
    setLocalWorkflow({ ...localWorkflow, closeOnDate: date ?? null });
  };

  const handleClosedWorkflowMessageChange = ({
    heading,
    subheading,
  }: {
    heading?: string;
    subheading?: string;
  }) => {
    const message = {
      enabled: workflowCloseOnDateToggle,
      heading: heading ?? workflowClosedMessage.heading,
      subheading: subheading ?? workflowClosedMessage.subheading,
    };

    setWorkflowClosedMessage(message);
    setLocalWorkflow({ ...localWorkflow, workflowClosedMessage: message });
  };

  const handleSingleUseWorkflowToggle = () => {
    if (!localWorkflow.singleUse?.enabled) {
      setLocalWorkflow({
        ...localWorkflow,
        singleUse: { enabled: true, ...singleUseMessage, isEncrypted: singleUseEncryption },
      });
    } else {
      setLocalWorkflow({ ...localWorkflow, singleUse: { enabled: false, isEncrypted: false } });
    }
  };

  const handleSingleUseWorkflowMessageChange = ({
    heading,
    subheading,
  }: {
    heading?: string;
    subheading?: string;
  }) => {
    const message = {
      heading: heading ?? singleUseMessage.heading,
      subheading: subheading ?? singleUseMessage.subheading,
    };

    const localWorkflowSingleUseEnabled = localWorkflow.singleUse?.enabled ?? false;
    setSingleUseMessage(message);
    setLocalWorkflow({
      ...localWorkflow,
      singleUse: { enabled: localWorkflowSingleUseEnabled, ...message, isEncrypted: singleUseEncryption },
    });
  };

  const hangleSingleUseEncryptionToggle = () => {
    if (!singleUseEncryption) {
      setSingleUseEncryption(true);
      setLocalWorkflow({
        ...localWorkflow,
        singleUse: { enabled: true, ...singleUseMessage, isEncrypted: true },
      });
    } else {
      setSingleUseEncryption(false);
      setLocalWorkflow({
        ...localWorkflow,
        singleUse: { enabled: true, ...singleUseMessage, isEncrypted: false },
      });
    }
  };

  const handleVerifyEmailWorkflowDetailsChange = ({
    name,
    subheading,
  }: {
    name?: string;
    subheading?: string;
  }) => {
    const message = {
      name: name || verifyEmailWorkflowDetails.name,
      subheading: subheading || verifyEmailWorkflowDetails.subheading,
    };

    setVerifyEmailWorkflowDetails(message);
    setLocalWorkflow({ ...localWorkflow, verifyEmail: message });
  };

  useEffect(() => {
    if (localWorkflow.redirectUrl) {
      setRedirectUrl(localWorkflow.redirectUrl);
      setRedirectToggle(true);
    }

    if (!!localWorkflow.workflowClosedMessage) {
      setWorkflowClosedMessage({
        heading: localWorkflow.workflowClosedMessage.heading ?? workflowClosedMessage.heading,
        subheading: localWorkflow.workflowClosedMessage.subheading ?? workflowClosedMessage.subheading,
      });
      setWorkflowClosedMessageToggle(true);
    }

    if (localWorkflow.singleUse?.enabled) {
      setSingleUseMessage({
        heading: localWorkflow.singleUse.heading ?? singleUseMessage.heading,
        subheading: localWorkflow.singleUse.subheading ?? singleUseMessage.subheading,
      });
      setSingleUseEncryption(localWorkflow.singleUse.isEncrypted);
    }

    if (localWorkflow.verifyEmail) {
      setVerifyEmailWorkflowDetails({
        name: localWorkflow.verifyEmail.name!,
        subheading: localWorkflow.verifyEmail.subheading!,
      });
      setVerifyEmailToggle(true);
    }

    if (localWorkflow.closeOnDate) {
      setCloseOnDate(localWorkflow.closeOnDate);
      setWorkflowCloseOnDateToggle(true);
    }
  }, [localWorkflow]);

  const handleCheckMark = () => {
    if (autoComplete) {
      const updatedWorkflow = { ...localWorkflow, autoComplete: null };
      setLocalWorkflow(updatedWorkflow);
    } else {
      const updatedWorkflow = { ...localWorkflow, autoComplete: 25 };
      setLocalWorkflow(updatedWorkflow);
    }
  };

  const handleInputResponse = (e) => {
    const updatedWorkflow = { ...localWorkflow, autoComplete: parseInt(e.target.value) };
    setLocalWorkflow(updatedWorkflow);
  };

  const handleInputResponseBlur = (e) => {
    if (parseInt(e.target.value) === 0) {
      toast.error("Response limit can't be set to 0");
      return;
    }

    if (parseInt(e.target.value) <= responseCount) {
      toast.error(`Response limit needs to exceed number of received responses (${responseCount}).`);
      return;
    }
  };

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="w-full rounded-lg border border-slate-300 bg-white">
      <Collapsible.CollapsibleTrigger asChild className="h-full w-full cursor-pointer">
        <div className="inline-flex px-4 py-4">
          <div className="flex items-center pl-2 pr-5">
            <CheckCircleIcon className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Response Options</p>
            <p className="mt-1 text-sm text-slate-500">Decide how and how long people can respond.</p>
          </div>
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent>
        <hr className="py-1 text-slate-600" />
        <div className="p-3">
          {/* Close Workflow on Limit */}
          <AdvancedOptionToggle
            htmlId="closeOnNumberOfResponse"
            isChecked={autoComplete}
            onToggle={handleCheckMark}
            title="Close workflow on response limit"
            description="Automatically close the workflow after a certain number of responses."
            childBorder={true}>
            <label htmlFor="autoCompleteResponses" className="cursor-pointer bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Automatically mark the workflow as complete after
                <Input
                  autoFocus
                  type="number"
                  min={responseCount ? (responseCount + 1).toString() : "1"}
                  id="autoCompleteResponses"
                  value={localWorkflow.autoComplete?.toString()}
                  onChange={handleInputResponse}
                  onBlur={handleInputResponseBlur}
                  className="ml-2 mr-2 inline w-20 bg-white text-center text-sm"
                />
                completed responses.
              </p>
            </label>
          </AdvancedOptionToggle>
          {/* Close Workflow on Date */}
          <AdvancedOptionToggle
            htmlId="closeOnDate"
            isChecked={workflowCloseOnDateToggle}
            onToggle={handleWorkflowCloseOnDateToggle}
            title="Close workflow on date"
            description="Automatically closes the workflow at the beginning of the day (UTC)."
            childBorder={true}>
            <div className="flex cursor-pointer p-4">
              <p className="mr-2 mt-3 text-sm font-semibold text-slate-700">
                Automatically mark workflow as complete on:
              </p>
              <DatePicker date={closeOnDate} handleDateChange={handleCloseOnDateChange} />
            </div>
          </AdvancedOptionToggle>

          {/* Redirect on completion */}
          <AdvancedOptionToggle
            htmlId="redirectUrl"
            isChecked={redirectToggle}
            onToggle={handleRedirectCheckMark}
            title="Redirect on completion"
            description="Redirect user to specified link on workflow completion"
            childBorder={true}>
            <div className="w-full p-4">
              <div className="flex w-full cursor-pointer items-center">
                <p className="mr-2 w-[400px] text-sm font-semibold text-slate-700">
                  Redirect respondents here:
                </p>
                <Input
                  autoFocus
                  className="w-full bg-white"
                  type="url"
                  placeholder="https://www.example.com"
                  value={redirectUrl ? redirectUrl : ""}
                  onChange={(e) => handleRedirectUrlChange(e.target.value)}
                />
              </div>
            </div>
          </AdvancedOptionToggle>

          {localWorkflow.type === "link" && (
            <>
              {/* Adjust Workflow Closed Message */}
              <AdvancedOptionToggle
                htmlId="adjustWorkflowClosedMessage"
                isChecked={workflowClosedMessageToggle}
                onToggle={handleCloseWorkflowMessageToggle}
                title="Adjust 'Workflow Closed' message"
                description="Change the message visitors see when the workflow is closed."
                childBorder={true}>
                <div className="flex w-full items-center space-x-1 p-4 pb-4">
                  <div className="w-full cursor-pointer items-center  bg-slate-50">
                    <Label htmlFor="headline">Heading</Label>
                    <Input
                      autoFocus
                      id="heading"
                      className="mb-4 mt-2 bg-white"
                      name="heading"
                      defaultValue={workflowClosedMessage.heading}
                      onChange={(e) => handleClosedWorkflowMessageChange({ heading: e.target.value })}
                    />

                    <Label htmlFor="headline">Subheading</Label>
                    <Input
                      className="mt-2 bg-white"
                      id="subheading"
                      name="subheading"
                      defaultValue={workflowClosedMessage.subheading}
                      onChange={(e) => handleClosedWorkflowMessageChange({ subheading: e.target.value })}
                    />
                  </div>
                </div>
              </AdvancedOptionToggle>

              {/* Single User Workflow Options */}
              <AdvancedOptionToggle
                htmlId="singleUserWorkflowOptions"
                isChecked={!!localWorkflow.singleUse?.enabled}
                onToggle={handleSingleUseWorkflowToggle}
                title="Single-Use Workflow Links"
                description="Allow only 1 response per workflow link."
                childBorder={true}>
                <div className="flex w-full items-center space-x-1 p-4 pb-4">
                  <div className="w-full cursor-pointer items-center  bg-slate-50">
                    <div className="row mb-2 flex cursor-default items-center space-x-2">
                      <Label htmlFor="howItWorks">How it works</Label>
                    </div>
                    <ul className="mb-3 ml-4 cursor-default list-inside list-disc space-y-1">
                      <li className="text-sm text-slate-600">
                        Blocks workflow if the workflow URL has no Single Use Id (suId).
                      </li>
                      <li className="text-sm text-slate-600">
                        Blocks workflow if a submission with the Single Use Id (suId) in the URL exists
                        already.
                      </li>
                    </ul>
                    <Label htmlFor="headline">&lsquo;Link Used&rsquo; Message</Label>
                    <Input
                      autoFocus
                      id="heading"
                      className="mb-4 mt-2 bg-white"
                      name="heading"
                      defaultValue={singleUseMessage.heading}
                      onChange={(e) => handleSingleUseWorkflowMessageChange({ heading: e.target.value })}
                    />

                    <Label htmlFor="headline">Subheading</Label>
                    <Input
                      className="mb-4 mt-2 bg-white"
                      id="subheading"
                      name="subheading"
                      defaultValue={singleUseMessage.subheading}
                      onChange={(e) => handleSingleUseWorkflowMessageChange({ subheading: e.target.value })}
                    />
                    <Label htmlFor="headline">URL Encryption</Label>
                    <div>
                      <div className="mt-2 flex items-center space-x-1 ">
                        <Switch
                          id="encryption-switch"
                          checked={singleUseEncryption}
                          onCheckedChange={hangleSingleUseEncryptionToggle}
                        />
                        <Label htmlFor="encryption-label">
                          <div className="ml-2">
                            <p className="text-sm font-normal text-slate-600">
                              Enable encryption of Single Use Id (suId) in workflow URL.
                            </p>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </AdvancedOptionToggle>

              {/* Verify Email Section */}
              <AdvancedOptionToggle
                htmlId="verifyEmailBeforeSubmission"
                isChecked={verifyEmailToggle}
                onToggle={handleVerifyEmailToogle}
                title="Verify email before submission"
                description="Only let people with a real email respond."
                childBorder={true}>
                <div className="flex w-full items-center space-x-1 p-4 pb-4">
                  <div className="w-full cursor-pointer items-center  bg-slate-50">
                    <p className="text-md font-semibold">How it works</p>
                    <p className="mb-4 mt-2 text-sm text-slate-500">
                      Respondants will receive the workflow link via email.
                    </p>
                    <Label htmlFor="headline">Workflow Name (Public)</Label>
                    <Input
                      autoFocus
                      id="heading"
                      className="mb-4 mt-2 bg-white"
                      name="heading"
                      placeholder="Job Application Form"
                      defaultValue={verifyEmailWorkflowDetails.name}
                      onChange={(e) => handleVerifyEmailWorkflowDetailsChange({ name: e.target.value })}
                    />

                    <Label htmlFor="headline">Subheader (Public)</Label>
                    <Input
                      className="mt-2 bg-white"
                      id="subheading"
                      name="subheading"
                      placeholder="Thanks for applying as a full stack engineer"
                      defaultValue={verifyEmailWorkflowDetails.subheading}
                      onChange={(e) => handleVerifyEmailWorkflowDetailsChange({ subheading: e.target.value })}
                    />
                  </div>
                </div>
              </AdvancedOptionToggle>
              <AdvancedOptionToggle
                htmlId="protectWorkflowWithPin"
                isChecked={isPinProtectionEnabled}
                onToggle={handleProtectWorkflowWithPinToggle}
                title="Protect Workflow with a PIN"
                description="Only users who have the PIN can access the workflow."
                childBorder={true}>
                <div className="flex w-full items-center space-x-1 p-4 pb-4">
                  <div className="w-full cursor-pointer items-center  bg-slate-50">
                    <Label htmlFor="headline">Add PIN</Label>
                    <Input
                      autoFocus
                      id="pin"
                      isInvalid={Boolean(verifyProtectWithPinError)}
                      className="mb-4 mt-2 bg-white"
                      name="pin"
                      placeholder="1234"
                      onBlur={handleProtectWorkflowPinBlurEvent}
                      defaultValue={localWorkflow.pin ? localWorkflow.pin : undefined}
                      onKeyDown={handleWorkflowPinInputKeyDown}
                      onChange={(e) => handleProtectWorkflowPinChange(e.target.value)}
                    />
                    {verifyProtectWithPinError && (
                      <p className="text-sm text-red-700">{verifyProtectWithPinError}</p>
                    )}
                  </div>
                </div>
              </AdvancedOptionToggle>
            </>
          )}
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
