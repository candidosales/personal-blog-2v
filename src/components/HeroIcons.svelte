<script lang="ts">
  import Github from './icons/Github.svelte';
  import Linkedin from './icons/Linkedin.svelte';
  import IconAt from './icons/IconAt.svelte';
  import Mcp from './icons/Mcp.svelte';
  import CheckmarkSolid from './icons/CheckmarkSolid.svelte';

  const MCP_COMMAND = 'claude mcp add --transport http candidosales https://www.candidosales.me/mcp';
  let copied = $state(false);
  const copyMcp = async () => {
    await navigator.clipboard.writeText(MCP_COMMAND);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

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

<div class="flex flex-row mbs-5 md:mbs-6 gap-4 social-icons animate-fade-in-up [--i:2]">
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
  <button
    type="button"
    onclick={copyMcp}
    title={copied ? 'Copied' : `Copy: ${MCP_COMMAND}`}
    aria-label={copied ? 'Copied MCP command' : 'Copy MCP command'}
    class="flex cursor-pointer text-blue-800 transition-colors p-2 bg-blue-100/80 hover:bg-blue-200 backdrop-blur-md border border-solid border-blue-200 rounded-full active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
  >
    {#if copied}
      <CheckmarkSolid class="w-4 h-4 md:w-6 md:h-6" />
    {:else}
      <Mcp class="w-4 h-4 md:w-6 md:h-6" />
    {/if}
  </button>
</div>
