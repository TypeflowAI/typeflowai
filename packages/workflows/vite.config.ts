import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

const buildPackage = process.env.WORKFLOWS_PACKAGE_BUILD || "workflows";

const entryPoint = buildPackage === "workflows" ? "src/index.ts" : "src/sideload/question-date/index.tsx";
const name = buildPackage === "workflows" ? "typeflowai-workflows" : "typeflowai-question-date";
const fileName = buildPackage === "workflows" ? "index" : "question-date";

const config = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    define: {
      "process.env": env,
    },
    build: {
      emptyOutDir: false,
      minify: "terser",
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, entryPoint),
        name,
        formats: ["cjs", "es", "umd"],
        fileName,
      },
    },
    plugins: [preact(), dts({ rollupTypes: true }), tsconfigPaths()],
  });
};

export default config;
