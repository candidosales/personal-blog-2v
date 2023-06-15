<script lang="ts">
  import {
    Drawer,
    Button,
    CloseButton,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
  } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";
  import User from "./icons/User.svelte";
  import Store from "./icons/Store.svelte";
  let drawerHidden = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

  const menuItems = [
    {
      href: "/about",
      label: "About",
      targetBlank: false,
      icon: User,
    },
    {
      href: "https://store.candidosales.me",
      label: "Store",
      targetBlank: true,
      icon: Store,
    },
  ];
</script>

<div class="fixed w-full top-2 z-10">
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 mt-16">
    <nav
      class="w-full flex items-center justify-end sm:h-10"
      aria-label="navigation"
      data-aos="zoom-out-down"
      data-aos-duration="2000"
    >
      <div class="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
        <div class="flex items-center justify-between w-full md:w-auto">
          <a href="/">
            <span class="sr-only">Candido Sales</span>
            <img
              height="64"
              width="64"
              class="h-8 w-auto sm:h-10 rounded-full"
              src="/me-2.webp"
              alt=""
            />
          </a>
          <div class="-mr-2 flex items-center md:hidden">
            <Button
              class="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              on:click={() => (drawerHidden = false)}
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg></Button
            >
          </div>
        </div>
      </div>
      <div
        class="hidden md:flex bg-slate-100/80 px-2 rounded-full backdrop-blur-md"
      >
        {#each menuItems as m}
          <a
            href={m.href}
            class="p-4 font-medium text-slate-500 hover:text-slate-900"
            target={m.targetBlank ? "_blank" : ""}
          >
            {m.label}
          </a>
        {/each}
      </div>
    </nav>
  </div>
</div>
<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={drawerHidden}
  id="sidebar2"
>
  <div class="flex items-center">
    <h5
      id="drawer-navigation-label-3"
      class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      Menu
    </h5>
    <CloseButton
      on:click={() => (drawerHidden = true)}
      class="mb-4 dark:text-white"
    />
  </div>
  <Sidebar>
    <SidebarWrapper divClass="overflow-y-auto py-4 rounded dark:bg-gray-800">
      <SidebarGroup>
        {#each menuItems as m}
          <SidebarItem label={m.label} href={m.href}>
            <svelte:fragment slot="icon">
              <svelte:component this={m.icon} class="w-5 h-5 mr-2" />
            </svelte:fragment>
          </SidebarItem>
        {/each}
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</Drawer>
