<script lang="ts">
  import Home from './icons/Home.svelte';

  import User from './icons/User.svelte';
  import Store from './icons/Store.svelte';
  import MenuMobile from './MenuMobile.svelte';
  import PencilSquare from './icons/PencilSquare.svelte';
  import AdpList from './icons/AdpList.svelte';

  import {
    getLangFromUrl,
    useTranslations,
    useTranslatedPath,
  } from '@i18n/utils';
  import Presentation from './icons/Presentation.svelte';
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);
  const translatePath = useTranslatedPath(lang);

  const menuItems = [
    {
      href: translatePath('/'),
      label: t('menu.home'),
      targetBlank: false,
      icon: Home,
    },
    {
      href: translatePath('/blog'),
      label: t('menu.blog'),
      targetBlank: false,
      icon: PencilSquare,
    },
    {
      href: translatePath('/presentations'),
      label: t('menu.presentations'),
      targetBlank: false,
      icon: Presentation,
    },
    {
      href: translatePath('/about'),
      label: t('menu.about'),
      targetBlank: false,
      icon: User,
    },
    {
      href: 'https://adplist.org/mentors/candido-sales-gomes',
      label: t('menu.mentorship'),
      targetBlank: true,
      icon: AdpList,
    },
    {
      href: 'https://store.candidosales.me',
      label: t('menu.store'),
      targetBlank: true,
      icon: Store,
    },
  ];
</script>

<div class="relative max-w-7xl mx-auto px-4 sm:px-6 mt-20">
  <nav
    class="w-full flex items-center justify-end sm:h-10"
    aria-label="navigation"
  >
    <div class="flex items-center flex-1">
      <div class="flex items-center justify-between w-full md:w-auto">
        <a href="/">
          <span class="sr-only">Candido Sales</span>
          <img
            height="64"
            width="64"
            class="w-auto h-11 md:h-14 rounded-full"
            src="/me-2.webp"
            alt=""
          />
        </a>
      </div>
    </div>
    <div
      class="hidden md:flex bg-blue-100/80 px-2 rounded-full backdrop-blur-md border border-solid border-slate-200"
    >
      {#each menuItems as m}
        <a
          href={m.href}
          class="p-4 font-medium text-blue-800 hover:text-blue-950 transition-colors"
          target={m.targetBlank ? '_blank' : ''}
        >
          {m.label}
        </a>
      {/each}
    </div>
  </nav>
</div>
<MenuMobile {menuItems} client:load />

<style lang="scss">
  nav a {
    font-family: 'Inclusive Sans', sans-serif;
  }
</style>
