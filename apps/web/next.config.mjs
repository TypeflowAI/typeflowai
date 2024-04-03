import nextMDX from "@next/mdx";
import { withPlausibleProxy } from "next-plausible";

import { recmaPlugins } from "./mdx/recma.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { remarkPlugins } from "./mdx/remark.mjs";
import withSearch from "./mdx/search.mjs";

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  transpilePackages: ["@typeflowai/ui", "@typeflowai/lib"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/AsrygKkE8H",
        permanent: true,
      },
      {
        source: "/roadmap",
        destination: "https://github.com/orgs/typeflowai/projects/1",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/TypeflowAI/typeflowai",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/docs/introduction/what-is-typeflowai",
        permanent: true,
      },
      {
        source: "/docs/getting-started/nextjs",
        destination: "/docs/getting-started/framework-guides#next-js",
        permanent: true,
      },
      {
        source: "/docs/typeflowai-hq/self-hosting",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/getting-started",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/work-with-components",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/react-form-library/introduction",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/typeflowai-hq/schema",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/events/why",
        destination: "/docs/actions/why",
        permanent: true,
      },
      {
        source: "/docs/events/code",
        destination: "/docs/actions/code",
        permanent: true,
      },
      {
        source: "/docs/events/code",
        destination: "/docs/actions/code",
        permanent: true,
      },
      {
        source: "/pmf",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cla",
        destination: "https://typeflowai.com/clucgi29800008y770tjtzgim",
        permanent: true,
      },
      {
        source: "/docs/contributing/gitpod",
        destination: "/docs/contributing/setup#gitpod",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/:path*",
          destination: `https://dashboard.typeflowai.com/s/:path*`,
        },
      ],
    };
  },
};

export default withPlausibleProxy()(withSearch(withMDX(nextConfig)));
