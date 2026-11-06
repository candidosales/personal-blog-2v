<script lang="ts">
  import { Drawer, CloseButton } from 'flowbite-svelte';
  import { quintOut } from 'svelte/easing';
  import type { MenuItem } from '../env';
  import Contact from './Contact.svelte';
  import ChatBubble from './icons/ChatBubble.svelte';
  let drawerHidden = $state(true);
  let transitionParams = {
    x: 320,
    duration: 300,
    easing: quintOut,
  };

  interface Props {
    menuItems?: MenuItem[];
    chat: { href: string; label: string };
  }

  let { menuItems = [], chat }: Props = $props();
</script>

<div class="fixed w-full inset-be-6 inset-e-8 z-10 md:hidden">
  <div class="-me-2 flex justify-end gap-3 md:hidden">
    <a
      href={chat.href}
      aria-label={chat.label}
      class="size-12 bg-blue-700 text-white rounded-full inline-flex items-center justify-center transition-[scale] active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 drop-shadow-xl"
    >
      <ChatBubble />
    </a>
    <button
      class="text-md bg-blue-700 text-white backdrop-blur-md rounded-full px-4 py-3 inline-flex items-center justify-center font-medium transition-colors motion-safe:transition-[color,background-color,scale] active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 drop-shadow-xl font-inclusive"
      onclick={() => (drawerHidden = false)}
    >
      Menu
    </button>
  </div>
</div>
<Drawer
  {transitionParams}
  bind:hidden={drawerHidden}
  placement="right"
  id="sidebar2"
  class="overflow-y-auto z-50 p-4 bg-blue-100/90 backdrop-blur-md w-80 fixed inset-y-0 inset-e-0"
  client:load
>
  <div class="flex items-center w-full justify-between">
    <h5
      id="drawer-navigation-label-3"
      class="text-2xl font-medium text-blue-800 font-inclusive"
    >
      Menu
    </h5>
    <CloseButton
      onclick={() => (drawerHidden = true)}
      class="mbe-4 text-blue-800"
    />
  </div>
  <div class="absolute inset-be-4 w-[280px]">
    <div class="space-y-2">
      {#each menuItems as m}
        <a
          href={m.href}
          target={m.targetBlank ? '_blank' : ''}
          class="flex items-center p-2 font-normal text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <div class="w-6 h-6 me-2 text-blue-800">
            <m.icon />
          </div>
          <p class="text-blue-800 font-inclusive text-lg">
            {m.label}
          </p>
        </a>
      {/each}
    </div>
    <div class="pbs-4 mbs-4 border-bs border-blue-200">
      <Contact place={'mobile'} />
    </div>
  </div>
</Drawer>
