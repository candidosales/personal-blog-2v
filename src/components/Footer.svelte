<script lang="ts">
  import TextLink from "./TextLink.svelte";
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
    },
  ];
</script>

<footer class="w-full flex flex-row justify-center items-center lowercase">
  {#each links as l}
    <div class="m-4">
      <TextLink href={l.href} title={l.label} label={l.label}
        ><div class="w-4 h-4 mr-2 flex items-center align-middle text-blue-600">
          <svelte:component this={l.icon} />
        </div></TextLink
      >
    </div>
  {/each}
</footer>
