import Head from "next/head";
import { useRouter } from "next/router";

interface Props {
  title: string;
  description: string;
  publishedTime?: string;
  updatedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  ogImage?: string;
}

export default function MetaInformation({
  title,
  description,
  publishedTime,
  updatedTime,
  authors,
  section,
  tags,
  ogImage,
}: Props) {
  const router = useRouter();
  const pageTitle = `${title}`;
  const BASE_URL = `typeflowai.com`;
  const canonicalLink = `https://${BASE_URL}${router.asPath}`;
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="image" content={`https://${BASE_URL}/favicon.ico`} />
      <meta property="og:image" content={`https://${BASE_URL}${ogImage ? ogImage : `/social-image.png`}`} />
      <link rel="icon" type="image/x-icon" href={`https://${BASE_URL}/favicon.ico`} />
      <link rel="canonical" href={canonicalLink} />
      <meta name="msapplication-TileColor" content="#7b4cfa" />
      <meta name="msapplication-TileImage" content={`https://${BASE_URL}/favicon.ico`} />
      <meta property="og:image:alt" content="TypeflowAI Next-Gen AI Forms with GPT Superpowers" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="TypeflowAI Next-Gen AI Forms with GPT Superpowers" />
      <meta property="article:publisher" content="TypeflowAI" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {updatedTime && <meta property="article:updated_time" content={updatedTime} />}
      {authors && <meta property="article:author" content={authors.join(", ")} />}
      {section && <meta property="article:section" content={section} />}
      {tags && <meta property="article:tag" content={tags.join(", ")} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@typeflowai" />
      <meta name="twitter:creator" content="@typeflowai" />
      <meta name="twitter:title" content="TypeflowAI | Next-Gen AI Forms with GPT Superpowers" />
      <meta
        name="twitter:description"
        content="Convert form questions into dynamic merge tags to craft high-level prompts and build sophisticated AI tools."
      />
      <meta
        name="keywords"
        content="AI forms, smart data collection, conversational engagement, TypeflowAI, advanced form builder, user experience design, form automation, GPT technology, personalized forms, typeform alternative, involve.me alternative, youform.io alternative, formwise.ai alternative, data-driven insights"
      />
      <meta name="theme-color" content="#2e1065" />
    </Head>
  );
}
