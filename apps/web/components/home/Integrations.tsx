import AirtableLogo from "@/images/integrations/airtable.svg";
import GoogleDocsLogo from "@/images/integrations/google-docs.svg";
import GoogleSheetsLogo from "@/images/integrations/google-sheets.svg";
import NotionLogo from "@/images/integrations/notion.svg";
import WebhookLogo from "@/images/integrations/webhook.svg";
import ZapierLogo from "@/images/integrations/zapier.svg";
import Image from "next/image";

export const Integrations: React.FC = () => {
  return (
    <section className="relative px-4 py-10 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-xl bg-lime-100 p-8 md:p-[5rem]">
        <div className="flex flex-col">
          <h2 className="mb-4 max-w-2xl text-left text-2xl font-medium uppercase text-lime-500">
            Integrations
          </h2>
          <div className="mb-10 md:grid md:grid-cols-2 md:gap-14 lg:gap-28">
            <div>
              <p className="mb-6 text-5xl font-semibold">Integrate and automate to run at full capacity</p>
            </div>
            <div>
              <p className="font-base mt-4 text-lg text-slate-500 sm:text-xl md:text-2xl">
                Use favorite apps to cut out repetitive tasks and concentrate on human-only tasks.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <div className="mb-8 flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={GoogleSheetsLogo} alt="Google Sheets logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Google Sheets</h3>
                  <p className="text-lg text-slate-600">Collect emails and responses on Google Sheets.</p>
                </div>
              </div>
              <div className="flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={GoogleDocsLogo} alt="Google Docs logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Google Docs</h3>
                  <p className="text-lg text-slate-600">Centralize ideas and content creation blueprints.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-8 flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={AirtableLogo} alt="Airtable logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Airtable</h3>
                  <p className="text-lg text-slate-600">
                    Create content calendars including pictures and designs.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={NotionLogo} alt="Notion logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Notion</h3>
                  <p className="text-lg text-slate-600">Connect with your all-in-one organization app.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-8 flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={ZapierLogo} alt="Zapier logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Zapier</h3>
                  <p className="text-lg text-slate-600">
                    Automate any possible task and integrate to even more apps.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="h-20 min-w-20 rounded-full bg-white align-middle">
                  <Image src={WebhookLogo} alt="Webhook logo" className="mx-auto h-full" />
                </div>
                <div className="ml-6 flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Webhooks</h3>
                  <p className="text-lg text-slate-600">
                    Make more automations without relying on any other app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
