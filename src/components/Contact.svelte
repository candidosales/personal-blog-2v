<script lang="ts">
  import Github from './icons/Github.svelte';
  import Linkedin from './icons/Linkedin.svelte';
  import Mail from './icons/Mail.svelte';
  import Twitter from './icons/Twitter.svelte';
  import Bluesky from './icons/Bluesky.svelte';

  interface Props {
    place?: 'default' | 'mobile';
  }

  let { place = 'default' }: Props = $props();

  let stylePlace = {
    default:
      'bg-blue-100/80 px-2 backdrop-blur-md border border-solid border-blue-200 rounded-full',
    mobile: 'w-full justify-between p-2',
  };

  const links = [
    {
      href: 'mailto:candidosg@gmail.com',
      label: 'E-mail',
      targetBlank: true,
      icon: Mail,
    },
    {
      href: 'https://bsky.app/profile/candidosales.bsky.social',
      label: 'Bluesky',
      targetBlank: true,
      icon: Bluesky,
    },
    {
      href: 'https://twitter.com/candidosales',
      label: 'Twitter',
      targetBlank: true,
      icon: Twitter,
    },
    {
      href: 'https://github.com/candidosales',
      label: 'Github',
      targetBlank: true,
      icon: Github,
    },
    {
      href: 'https://www.linkedin.com/in/candidosales/',
      label: 'Linkedin',
      targetBlank: true,
      icon: Linkedin,
    },
  ];
</script>

<footer class="w-full flex flex-row justify-center items-center lowercase">
  <div class={`flex flex-row ${stylePlace[place]}`}>
    {#each links as l}
      <div class={place === 'mobile' ? 'm-0' : 'm-4'}>
        <a
          class="font-inclusive no-underline hover:underline hover:underline-offset-4 flex flex-row align-middle items-center text-blue-800 hover:text-blue-900"
          href={l.href}
          title={l.label}
          target="_blank"
          ><div
            class="w-5 h-5 md:w-4 md:h-4 mr-0 md:mr-2 flex items-center align-middle"
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
