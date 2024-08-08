<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CheckmarkSolid from './icons/CheckmarkSolid.svelte';

  export let label = 'button';
  export let info = 'info';
  export let color = 'blue';
  export let selected = false;

  const dispatch = createEventDispatcher();
  const click = (): void => {
    dispatch('click');
  };
</script>

<div class="flex flex-col text-center w-full">
  <button
    on:click={click}
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
    @apply bg-green-700;
  }
  .yellow-selected {
    @apply bg-yellow-700;
  }
  .red-selected {
    @apply bg-red-700;
  }
</style>
