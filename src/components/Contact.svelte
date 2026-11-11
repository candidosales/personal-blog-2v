<script lang="ts" module>
  import Github from './icons/Github.svelte';
  import Linkedin from './icons/Linkedin.svelte';
  import Twitter from './icons/Twitter.svelte';
  import Bluesky from './icons/Bluesky.svelte';
  import IconAt from './icons/IconAt.svelte';

  export const links = [
    { href: 'mailto:candidosg@gmail.com', label: 'E-mail', icon: IconAt },
    { href: 'https://bsky.app/profile/candidosales.bsky.social', label: 'Bluesky', icon: Bluesky },
    { href: 'https://twitter.com/candidosales', label: 'Twitter', icon: Twitter },
    { href: 'https://github.com/candidosales', label: 'Github', icon: Github },
    { href: 'https://www.linkedin.com/in/candidosales/', label: 'Linkedin', icon: Linkedin },
  ];
</script>

<footer class="w-full flex flex-row justify-center items-center lowercase">
  <div class="flex flex-row bg-blue-100/80 px-2 backdrop-blur-md border border-solid border-blue-200 rounded-full">
    {#each links as l}
      <div class="m-4">
        <a
          class="font-inclusive no-underline hover:underline hover:underline-offset-4 flex flex-row align-middle items-center text-blue-800 hover:text-blue-900"
          href={l.href}
          title={l.label}
          target="_blank"
          ><div
            class="w-5 h-5 md:w-4 md:h-4 me-0 md:me-2 flex items-center align-middle"
          >
            <l.icon />
          </div>
          <span class="hidden md:block after:content-['_↗']">
            {l.label}</span
          ></a
        >
      </div>
    {/each}
  </div>
</footer>
