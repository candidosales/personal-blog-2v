import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://www.candidosales.me/",
  redirects: {
    "/twitter": "https://twitter.com/candidosales",
    "/linkedin": "https://www.linkedin.com/in/candidosales/",
    "/mentorship": "https://adplist.org/mentors/candido-sales-gomes",
    "/github": "https://github.com/candidosales",
  },
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    compress(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
        },
      },
    }),
    svelte(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
