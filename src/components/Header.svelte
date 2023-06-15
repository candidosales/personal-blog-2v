<script lang="ts">
  import { createSelect } from "@melt-ui/svelte";
  const { trigger, menu } = createSelect();

  const menuItems = [
    {
      href: "/about",
      label: "About",
      targetBlank: false,
    },
    {
      href: "https://store.candidosales.me",
      label: "Store",
      targetBlank: true,
    },
  ];
</script>

<div class="fixed w-full top-2 z-10">
  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 mt-16">
    <nav
      class="w-full flex items-center justify-end sm:h-10"
      aria-label="Global"
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
            <button
              type="button"
              class="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              {...$trigger}
            >
              <span class="sr-only">Open main menu</span>
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
              </svg>
            </button>
            <ul class="menu w-36" {...$menu}>
              {#each menuItems as m}
                <li class="option">
                  <a href={m.href} target={m.targetBlank ? "_blank" : ""}
                    >{m.label}</a
                  >
                </li>
              {/each}
            </ul>
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

<style lang="postcss">
  .label {
    @apply py-1 pl-4 pr-4 font-semibold capitalize text-neutral-800;
  }
  .menu {
    @apply z-10 flex max-h-[300px] flex-col gap-2 overflow-y-auto;
    @apply rounded-md bg-white p-1 lg:max-h-none;
  }
  .option {
    @apply relative cursor-pointer rounded-md py-1 pl-8 pr-4 text-neutral-800;
    @apply outline-none focus:bg-slate-100 focus:text-slate-700;
  }
  .trigger {
    @apply flex h-10 w-[180px] items-center justify-between rounded-md bg-white px-3;
    @apply py-2 text-slate-700 outline-none hover:opacity-75 focus:ring focus:ring-slate-400;
  }
  .check {
    @apply absolute left-2 top-1/2 text-slate-500;
    translate: 0 calc(-50% + 1px);
  }
</style>
