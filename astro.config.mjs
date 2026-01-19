import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import tailwindcss from "@tailwindcss/vite";

import partytown from '@astrojs/partytown';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.candidosales.me/',
	integrations: [compress(), sitemap({
		i18n: {
			defaultLocale: 'en',
			locales: ['en', 'pt-br'],
			routing: {
				prefixDefaultLocale: false,
			},
		},
	}), svelte(), partytown({
		config: {
			forward: ['dataLayer.push'],
		},
	}), react()],
	output: 'server',
	adapter: vercel(),
	vite: {
		plugins: [tailwindcss()],
	},
});