import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  use: { baseURL: "http://localhost:4399" },
  // In agent shells `astro dev` backgrounds itself and exits; `logs --follow` keeps the process alive.
  webServer: {
    command: "bunx astro dev --port 4399 && bunx astro dev logs --follow",
    url: "http://localhost:4399",
    reuseExistingServer: true,
  },
});
