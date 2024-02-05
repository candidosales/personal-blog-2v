<script lang="ts">
  import {
    Drawer,
    Button,
    CloseButton,
    Sidebar,
    SidebarGroup,
    SidebarItem,
  } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  import type { MenuItem } from '../env';
  import Contact from './Contact.svelte';
  let drawerHidden = true;
  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  export let menuItems: MenuItem[] = [];
</script>

<div class="fixed w-full bottom-6 right-8 z-10 md:hidden">
  <div class="-mr-2 flex justify-end md:hidden">
    <Button
      class="bg-blue-700 text-white backdrop-blur-md rounded-full px-4 py-3 inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 drop-shadow-xl font-inclusive"
      on:click={() => (drawerHidden = false)}
    >
      Menu</Button
    >
  </div>
</div>
<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={drawerHidden}
  placement="right"
  id="sidebar2"
  divClass="overflow-y-auto z-50 p-4 bg-blue-100/90 backdrop-blur-md dark:bg-gray-800 w-80 fixed inset-y-0 right-0"
  client:load
>
  <div class="flex items-center">
    <h5
      id="drawer-navigation-label-3"
      class="text-2xl font-medium text-blue-800 font-inclusive"
    >
      Menu
    </h5>
    <CloseButton
      on:click={() => (drawerHidden = true)}
      class="mb-4 dark:text-white text-blue-800"
    />
  </div>
  <Sidebar class="absolute bottom-4">
    <SidebarGroup>
      {#each menuItems as m}
        <SidebarItem
          href={m.href}
          aClass="flex items-center p-2 font-normal text-blue-800 rounded-lg dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700"
        >
          <svelte:fragment slot="icon">
            <span class="text-blue-800">
              <svelte:component this={m.icon} class="w-5 h-5 mr-2 " />
            </span>
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="text-blue-800 font-inclusive text-lg">
              {m.label}
            </span>
          </svelte:fragment>
        </SidebarItem>
      {/each}
    </SidebarGroup>
    <SidebarGroup
      border
      borderClass={'pt-4 mt-4 border-t border-blue-200 dark:border-blue-700'}
    >
      <Contact place={'mobile'} />
    </SidebarGroup>
  </Sidebar>
</Drawer>
