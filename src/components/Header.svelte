<script lang="ts">
  import Home from './icons/Home.svelte';
  import User from './icons/User.svelte';
  import PencilSquare from './icons/PencilSquare.svelte';
  import AdpList from './icons/AdpList.svelte';
  import Presentation from './icons/Presentation.svelte';
  import Sparkles from './icons/Sparkles.svelte';
  import TabBar from './TabBar.svelte';

  import {
    getLangFromUrl,
    useTranslations,
    useTranslatedPath,
  } from '@i18n/utils';
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);
  const translatePath = useTranslatedPath(lang);

  const tabs = [
    { href: translatePath('/'), label: t('menu.home'), targetBlank: false, icon: Home },
    { href: translatePath('/blog'), label: t('menu.blog'), targetBlank: false, icon: PencilSquare },
    { href: translatePath('/ui-lab'), label: t('menu.lab'), targetBlank: false, icon: Sparkles },
    { href: translatePath('/about'), label: t('menu.about'), targetBlank: false, icon: User },
  ];
  const more = [
    { href: translatePath('/presentations'), label: t('menu.presentations'), targetBlank: false, icon: Presentation },
    { href: 'https://adplist.org/mentors/candido-sales-gomes', label: t('menu.mentorship'), targetBlank: true, icon: AdpList },
  ];
</script>

<div class="relative max-w-6xl mx-auto px-4 sm:px-6 mbs-20">
  <a href={tabs[0].href} class="inline-flex items-center h-[64px]">
    <span class="sr-only">Candido Sales</span>
    <img
      height="64"
      width="64"
      class="w-auto h-11 md:h-14 rounded-full profile-image"
      src="/me-2.webp"
      alt=""
    />
  </a>
</div>
<TabBar
  {tabs}
  {more}
  moreLabel={t('menu.more')}
  chat={{ href: translatePath('/chat'), label: t('menu.chat'), placeholder: t('chat.placeholder') }}
/>
