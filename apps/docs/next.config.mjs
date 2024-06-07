import nextMDX from "@next/mdx";

import { recmaPlugins } from "./mdx/recma.mjs";
import { rehypePlugins } from "./mdx/rehype.mjs";
import { remarkPlugins } from "./mdx/remark.mjs";
import { Search as withSearch } from "./mdx/search.mjs";

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/docs",
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
        source: "/",
        destination: "/docs/introduction/what-is-typeflowai",
        permanent: true,
      },
    ];
  },
};

export default withSearch(withMDX(nextConfig));
