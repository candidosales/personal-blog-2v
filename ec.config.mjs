import { pluginFileIcons } from '@xt0rted/expressive-code-file-icons';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
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
});
