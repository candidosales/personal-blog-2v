import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercelServerless from '@astrojs/vercel/serverless';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.candidosales.me/',
  integrations: [
    tailwind({
		nesting: true,
	}),
    compress(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'pt-br'],
        routing: {
          prefixDefaultLocale: false,
        },
      },
    }),
    svelte(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  output: 'server',
  adapter: vercelServerless(),
});
