<script lang="ts">
  import { Drawer } from 'flowbite-svelte';
  import type { MenuItem } from '../env';
  import Contact from './Contact.svelte';

  let open = $state(false);

  interface Props {
    menuItems?: MenuItem[];
  }

  let { menuItems = [] }: Props = $props();
</script>

<div class="fixed w-full bottom-6 right-8 z-10 md:hidden animate-fade-in-portfolio">
  <div class="-mr-2 flex justify-end md:hidden">
    <button
      class="text-md bg-blue-700 text-white backdrop-blur-md rounded-full px-4 py-3 inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 drop-shadow-xl font-inclusive"
      onclick={() => (open = true)}
    >
      Menu
    </button>
  </div>
</div>
<Drawer
  bind:open
  placement="right"
  id="sidebar2"
  dismissable={false}
  class="overflow-y-auto p-4 bg-blue-100/90 backdrop-blur-md w-80"
>
  <div class="flex items-center w-full justify-between">
    <h5
      id="drawer-navigation-label-3"
      class="text-2xl font-medium text-blue-800 font-inclusive"
    >
      Menu
    </h5>
    <button
      onclick={() => (open = false)}
      class="mb-4 text-blue-800 hover:text-blue-600"
      aria-label="Close menu"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
  <div class="absolute bottom-4 w-70">
    <div class="space-y-2">
      {#each menuItems as m}
        <a
          href={m.href}
          target={m.targetBlank ? '_blank' : ''}
          class="flex items-center p-2 font-normal text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div class="w-6 h-6 mr-2 text-blue-800">
            <m.icon />
          </div>
          <p class="text-blue-800 font-inclusive text-lg">
            {m.label}
          </p>
        </a>
      {/each}
    </div>
    <div class="pt-4 mt-4 border-t border-blue-200">
      <Contact place={'mobile'} />
    </div>
  </div>
</Drawer>
