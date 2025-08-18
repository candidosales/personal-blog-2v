export const extrasData = (t: any) => {
    return [
        // {
        //   image: {
        //     url: "/were-not-really-strangers.png",
        //     alt: "We're Not Really Strangers",
        //   },
        //   title: "We're Not Really Strangers",
        //   description:
        //     "I ❤️ this game and wanted to create a possibility to play with my friends online and get to know each other even from a distance. (COVID tough times 😞)",
        //   url: "https://wnrs.app/",
        //   techs: [
        //     {
        //       icon: "nextjs",
        //       name: "NextJS",
        //     },
        //     {
        //       icon: "react",
        //       name: "React",
        //     },
        //     {
        //       icon: "chakra-ui",
        //       name: "Chakra UI",
        //     },
        //     {
        //       icon: "sass",
        //       name: "SASS",
        //     },
        //     {
        //       icon: "vercel",
        //       name: "Vercel",
        //     },
        //     {
        //       icon: "pwa",
        //       name: "PWA",
        //     },
        //   ],
        // },
        {
            image: {
                url: '/extras/receituario-medico-2.png',
                alt: t('extras.1.title'),
            },
            title: t('extras.1.title'),
            description: t('extras.1.description'),
            url: 'https://receituariomedico.app/',
            background: 'bg-teal-100',
            techs: [
                {
                    icon: 'nextjs',
                    name: 'NextJS',
                },
                {
                    icon: 'chakra-ui-3',
                    name: 'Chakra UI',
                },
                {
                    icon: 'meilisearch',
                    name: 'Meilisearch',
                },
                {
                    icon: 'vercel',
                    name: 'Vercel',
                },
                {
                    icon: 'pwa',
                    name: 'PWA',
                },
            ],
        },
        {
            image: {
                url: '/extras/template-social-generator.png',
                alt: t('extras.2.title'),
            },
            title: t('extras.2.title'),
            description: t('extras.2.description'),
            url: 'https://social-templates.vercel.app/',
            background: 'bg-gray-200',
            techs: [
                {
                    icon: 'svelte',
                    name: 'Svelte',
                },
                {
                    icon: 'tailwind',
                    name: 'Tailwind',
                },
                {
                    icon: 'vite',
                    name: 'Vite',
                },
                {
                    icon: 'vercel',
                    name: 'Vercel',
                },
            ],
        },
        {
            image: {
                url: '/extras/my-agenda-cultural.png',
                alt: t('extras.3.title'),
            },
            title: t('extras.3.title'),
            description: t('extras.3.description'),
            url: 'https://carnaval-sp-ec736.web.app/',
            background: 'bg-blue-100',
            techs: [
                {
                    icon: 'angular',
                    name: 'Angular',
                },
                {
                    icon: 'firebase',
                    name: 'Firebase',
                },
                {
                    icon: 'ruby',
                    name: 'Ruby',
                },
                {
                    icon: 'rails',
                    name: 'Rails',
                },
                {
                    icon: 'pwa',
                    name: 'PWA',
                },
            ],
        },
    ];
};
