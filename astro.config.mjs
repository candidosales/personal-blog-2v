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
import embeds from 'astro-embed/integration';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.candidosales.me/',
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
  integrations: [
    embeds(),
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
    mdx(),
    // CSS disabled: astro-compress's csso strips Tailwind v4 range media
    // queries (@media (width>=40rem)), breaking responsive in prod builds.
    // Astro/Vite already minify CSS via Lightning CSS.
    compress({ CSS: false }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          'pt-br': 'pt-BR',
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
  ],
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
