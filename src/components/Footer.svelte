<script lang="ts">
  import TextLink from "./TextLink.svelte";
  import AdpList from "./icons/AdpList.svelte";
  import Github from "./icons/Github.svelte";
  import Linkedin from "./icons/Linkedin.svelte";
  import Mail from "./icons/Mail.svelte";
  import Twitter from "./icons/Twitter.svelte";

  const links = [
    {
      href: "/contact",
      label: "E-mail",
      targetBlank: true,
      icon: Mail,
    },
    {
      href: "https://twitter.com/candidosales",
      label: "Twitter",
      targetBlank: true,
      icon: Twitter,
    },
    {
      href: "https://github.com/candidosales",
      label: "Github",
      targetBlank: true,
      icon: Github,
    },
    {
      href: "https://linkedin.com/in/candidosales",
      label: "Linkedin",
      targetBlank: true,
      icon: Linkedin,
    },
    {
      href: "https://adplist.org/mentors/candido-sales-gomes",
      label: "Mentoring",
      targetBlank: true,
      icon: AdpList,
    },
  ];
</script>

<footer
  class="w-full flex flex-row justify-center items-center lowercase"
  data-aos="fade-up"
  data-aos-duration="1500"
>
  <div
    class=" flex flex-row bg-slate-100/80 px-2 rounded-2xl md:rounded-full backdrop-blur-md border border-solid border-slate-200"
  >
    {#each links as l}
      <div class="m-4">
        <TextLink href={l.href} title={l.label}
          ><div
            class="w-5 h-5 md:w-4 md:h-4 mr-2 flex items-center align-middle text-blue-600 hover:text-blue-900"
          >
            <svelte:component this={l.icon} />
          </div>
          <span class="hidden md:block after:content-['_↗']">
            {l.label}</span
          ></TextLink
        >
      </div>
    {/each}
  </div>
</footer>
