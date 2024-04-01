import TryItCTA from "@/components/shared/TryItCTA";
import CTA from "@/images/ctas/cta1.svg";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Button } from "@typeflowai/ui/Button";

import Footer from "./Footer";
import Header from "./Header";
import MetaInformation from "./MetaInformation";
import { Prose } from "./Prose";
import UseCaseHeader from "./UseCaseHeader";

const useExternalLinks = (selector: string) => {
  useEffect(() => {
    const links = document.querySelectorAll(selector);

    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    return () => {
      links.forEach((link) => {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      });
    };
  }, [selector]);
};

interface Props {
  meta: {
    title: string;
    description: string;
    publishedTime: string;
    authors: string[];
    section: string;
    tags: string[];
  };
  children: JSX.Element;
  useCaseTitle?: string;
  useCaseTags?: string[];
}

export default function LayoutMdx({ meta, children, useCaseTitle, useCaseTags }: Props) {
  const plausible = usePlausible();
  const router = useRouter();
  useExternalLinks(".prose a");
  return (
    <div className="flex h-screen flex-col justify-between">
      <MetaInformation
        title={meta.title}
        description={meta.description}
        publishedTime={meta.publishedTime}
        authors={meta.authors}
        section={meta.section}
        tags={meta.tags}
      />
      <Header inverted isWhite />
      <main className="min-w-0 max-w-2xl max-w-none flex-auto xl:px-16">
        <div className="mx-auto my-16 max-w-7xl rounded-xl bg-violet-50 py-16">
          <article className="mx-auto max-w-5xl px-2">
            {useCaseTitle && <UseCaseHeader title={useCaseTitle} tags={useCaseTags} />}
            {meta.title && (
              <header className="mb-9 space-y-1">
                {meta.title && (
                  <h1 className="font-display text-3xl tracking-tight text-slate-800">{meta.title}</h1>
                )}
              </header>
            )}
            <Prose className="prose-h2:text-2xl prose-li:text-lg prose-h2:mt-4 prose-p:text-lg  prose-p:mb-4 prose-p:max-w-none prose-h3:text-xl prose-a:text-slate-900 prose-a:hover:text-slate-900 prose-a:text-decoration-brand prose-a:not-italic ">
              {children}
            </Prose>
            <Button
              variant="primary"
              size="lg"
              className="my-8 mr-3 px-6"
              onClick={() => {
                router.push("https://dashboard.typeflowai.com/auth/signup");
                plausible("UseCase_CTA_Bottom");
              }}>
              Try this template now
            </Button>
          </article>
        </div>
        <TryItCTA
          teaser="Try it now"
          headline="Create your first AI form"
          subheadline="Try a new way of making forms that use all the latest features AI has to offer"
          cta="Build AI form"
          href="https://dashboard.typeflowai.com/auth/signup"
          image={CTA}
        />
      </main>
      <Footer />
    </div>
  );
}
