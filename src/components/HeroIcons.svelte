<script lang="ts">
  import Github from './icons/Github.svelte';
  import Linkedin from './icons/Linkedin.svelte';
  import Mail from './icons/Mail.svelte';

  const social = [
    {
      url: 'https://www.linkedin.com/in/candidosales/',
      title: 'Linkedin',
      icon: Linkedin,
    },
    {
      url: 'https://github.com/candidosales',
      title: 'Github',
      icon: Github,
    },
    {
      url: 'mailto:candidosg@gmail.com',
      title: 'Email',
      icon: Mail,
    },
  ];
</script>

<ul class="flex flex-row mt-3 md:mt-5 gap-4">
  {#each social as s}
    <li class="rounded-full p-2 bg-blue-100/90">
      <a
        href={s.url}
        title={s.title}
        target="_blank"
        class="flex w-4 h-4 md:w-6 md:h-6 text-blue-800"
      >
        {#if s.icon}
          <svelte:component this={s.icon} />
        {:else}
          {s.title}
        {/if}
      </a>
    </li>
  {/each}
</ul>
