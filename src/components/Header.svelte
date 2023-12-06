<script lang="ts">
  import Home from './icons/Home.svelte';

  import User from './icons/User.svelte';
  import Store from './icons/Store.svelte';
  import MenuMobile from './MenuMobile.svelte';
  import PencilSquare from './icons/PencilSquare.svelte';

  const menuItems = [
    {
      href: '/',
      label: 'Home',
      targetBlank: false,
      icon: Home,
    },
    {
      href: '/blog',
      label: 'Blog',
      targetBlank: false,
      icon: PencilSquare,
    },
    {
      href: '/about',
      label: 'About',
      targetBlank: false,
      icon: User,
    },
    {
      href: 'https://store.candidosales.me',
      label: 'Store',
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
          class="p-4 font-medium text-blue-800 hover:text-blue-900"
          target={m.targetBlank ? '_blank' : ''}
        >
          {m.label}
        </a>
      {/each}
    </div>
  </nav>
</div>
<MenuMobile {menuItems} />

<style lang="scss">
  nav a {
    font-family: 'Inclusive Sans', sans-serif;
  }
</style>
