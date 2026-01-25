<script lang="ts">
  import CheckmarkSolid from './icons/CheckmarkSolid.svelte';

  interface Props {
    label?: string;
    info?: string;
    color?: string;
    selected?: boolean;
    onclick?: () => void;
  }

  let {
    label = 'button',
    info = 'info',
    color = 'blue',
    selected = false,
    onclick,
  }: Props = $props();
</script>

<div class="flex flex-col text-center w-full">
  <button
    {onclick}
    class={`${selected ? `${color}-selected` : `bg-${color}-500`} hover:bg-${color}-800 text-center text-white font-bold py-4 px-6 rounded-full mb-2 transition-all tracking-normal font-inclusive`}
  >
    {#if selected}
      <CheckmarkSolid class="mr-4 size-6 absolute" />
    {/if}
    {label}
  </button>
  <p class="text-sm">{info}</p>
</div>

<style lang="scss">
  .green-selected {
    background-color: var(--color-green-700);
  }
  .yellow-selected {
    background-color: var(--color-yellow-700);
  }
  .red-selected {
    background-color: var(--color-red-700);
  }

  .bg-yellow-500 {
    background-color: var(--color-yellow-500);
  }
  .bg-green-500 {
    background-color: var(--color-green-500);
  }
  .bg-red-500 {
    background-color: var(--color-red-500);
  }
</style>
