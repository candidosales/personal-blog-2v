<script lang="ts">
  import Home from "./icons/Home.svelte";

  import User from "./icons/User.svelte";
  import Store from "./icons/Store.svelte";
  import MenuMobile from "./MenuMobile.svelte";

  const menuItems = [
    {
      href: "/",
      label: "Home",
      targetBlank: false,
      icon: Home,
    },
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

<div class="relative max-w-7xl mx-auto px-4 sm:px-6 mt-20">
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
<MenuMobile {menuItems} />
