import { Layout } from "@/components/docs/Layout";
import { type Section } from "@/components/docs/SectionProvider";
import glob from "fast-glob";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - TypeflowAI Docs",
    default: "TypeflowAI Docs",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let pages = await glob("**/*.mdx", { cwd: "app/docs" });
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      "/docs/" + filename.replace(/(^|\/)page\.mdx$/, ""),
      (await import(`./${filename}`)).sections,
    ])
  )) as Array<[string, Array<Section>]>;
  let allSections = Object.fromEntries(allSectionsEntries);

  return (
    <div className="w-full">
      <Layout allSections={allSections}>{children}</Layout>
    </div>
  );
}
