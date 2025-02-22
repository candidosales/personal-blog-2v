/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
	],
	plugins: [
		require('flowbite/plugin')
	],
};
