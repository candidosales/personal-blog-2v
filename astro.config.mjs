import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { pluginFileIcons } from '@xt0rted/expressive-code-file-icons';
import partytown from '@astrojs/partytown';
import astroExpressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.candidosales.me/',
  integrations: [
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
    react(),
    astroExpressiveCode({
      plugins: [
        pluginFileIcons({
          iconClass: 'size-4',
          titleClass: 'file-icon',
        }),
        pluginLineNumbers()
      ],
      frames: {
        extractFileNameFromCode: true,
      },
      shiki: {
        // Example: Only include languages 'astro' and 'sass'
        // in the bundle, reducing SSR bundle size by 80%
        bundledLangs: ['astro', 'sass', 'yaml', 'python', 'sql'],
      },
      themes: ['one-light']
    }),
  ],
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
