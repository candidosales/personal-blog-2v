<script lang="ts">
  import {
    Drawer,
    Button,
    CloseButton,
    Sidebar,
    SidebarGroup,
    SidebarItem,
  } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";
  import type { MenuItem } from "../env";
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
      class="bg-slate-100/80 backdrop-blur-md rounded-full border border-solid border-slate-200 px-4 py-3 inline-flex items-center justify-center font-medium text-slate-500 hover:text-slate-300  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
>
  <div class="flex items-center">
    <h5
      id="drawer-navigation-label-3"
      class="text-base font-medium text-slate-800"
    >
      Menu
    </h5>
    <CloseButton
      on:click={() => (drawerHidden = true)}
      class="mb-4 dark:text-white"
    />
  </div>
  <Sidebar class="absolute bottom-4">
    <SidebarGroup>
      {#each menuItems as m}
        <SidebarItem label={m.label} href={m.href}>
          <svelte:fragment slot="icon">
            <svelte:component this={m.icon} class="w-5 h-5 mr-2" />
          </svelte:fragment>
        </SidebarItem>
      {/each}
    </SidebarGroup>
  </Sidebar>
</Drawer>
