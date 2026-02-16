<script lang="ts">
  import Github from './icons/Github.svelte';
  import Linkedin from './icons/Linkedin.svelte';
  import IconAt from './icons/IconAt.svelte';

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
      title: 'e-mail',
      icon: IconAt,
    },
  ];
</script>

<div class="flex flex-row mt-5 md:mt-6 gap-4 social-icons animate-fade-in-up">
  {#each social as s}
    {#if s.icon}
      <a
        href={s.url}
        title={s.title}
        target="_blank"
        class="flex text-blue-800 transition-colors p-2 bg-blue-100/80 hover:bg-blue-200 backdrop-blur-md border border-solid border-blue-200 rounded-full"
      >
        <s.icon class="w-4 h-4 md:w-6 md:h-6" />
      </a>
    {/if}
  {/each}
</div>
