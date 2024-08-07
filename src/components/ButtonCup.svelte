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

<div class="flex flex-col text-center mb-16">
  <button
    on:click={click}
    class={`${selected ? `bg-${color}-500` : `bg-${color}-400`} hover:bg-${color}-700 text-center text-white font-bold py-4 px-6 rounded-full mb-2 transition-all`}
  >
    {#if selected}
      <CheckmarkSolid class="mr-4 size-6 absolute" />
    {/if}
    {label}
  </button>
  <p class="text-sm">{info}</p>
</div>

<style>
  .bg-green-400 {
    background-color: #4ade80;
  }
  .bg-yellow-400 {
    background-color: #facc15;
  }
  .bg-red-400 {
    background-color: #f87171;
  }
</style>
