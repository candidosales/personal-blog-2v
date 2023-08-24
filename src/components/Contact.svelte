<script lang="ts">
  import AdpList from "./icons/AdpList.svelte";
  import Github from "./icons/Github.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Mail from "./icons/Mail.svelte";
  import Twitter from "./icons/Twitter.svelte";

  export let place: "default" | "mobile" = "default";

  let stylePlace = {
    default:
      "bg-slate-100/80 px-2 backdrop-blur-md border border-solid border-slate-200 rounded-full",
    mobile: "w-full justify-between p-2",
  };

  const links = [
    {
      href: "mailto:candidosg@gmail.com",
      label: "E-mail",
      targetBlank: true,
      icon: Mail,
    },
    {
      href: "/twitter",
      label: "Twitter",
      targetBlank: true,
      icon: Twitter,
    },
    {
      href: "/github",
      label: "Github",
      targetBlank: true,
      icon: Github,
    },
    {
      href: "/linkedin",
      label: "Linkedin",
      targetBlank: true,
      icon: Linkedin,
    },
    {
      href: "/mentorship",
      label: "Mentoring",
      targetBlank: true,
      icon: AdpList,
    },
  ];
</script>

<footer
  class="w-full flex flex-row justify-center items-center lowercase slide-fade-in"
>
  <div class={`flex flex-row ${stylePlace[place]}`}>
    {#each links as l}
      <div class={place === "mobile" ? "m-0" : "m-4"}>
        <a
          class="no-underline hover:underline hover:underline-offset-4 flex flex-row align-middle items-center text-slate-600 hover:text-slate-800"
          href={l.href}
          title={l.label}
          target="_blank"
          ><div
            class="w-5 h-5 md:w-4 md:h-4 mr-0 md:mr-2 flex items-center align-middle"
          >
            <svelte:component this={l.icon} />
          </div>
          <span class="hidden md:block after:content-['_↗']">
            {l.label}</span
          ></a
        >
      </div>
    {/each}
  </div>
</footer>
