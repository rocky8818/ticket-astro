import { defineConfig } from 'astro/config';
import db from "@astrojs/db";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), tailwind(), react()],
  vite: {
    optimizeDeps: {
      exclude: ["oslo"]
    }
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});