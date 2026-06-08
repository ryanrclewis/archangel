import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

// Node.js built-ins used only by admin API routes (local dev only).
// Mark them external so they are never bundled into the Cloudflare Worker.
// The Worker will never call these routes, so the runtime import() will
// never execute in production.
const NODE_ONLY_EXTERNALS = ["fs", "path", "child_process"];

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
  build: {
    rollupOptions: {
      external: NODE_ONLY_EXTERNALS,
    },
  },
  ssr: {
    external: NODE_ONLY_EXTERNALS,
  },
});