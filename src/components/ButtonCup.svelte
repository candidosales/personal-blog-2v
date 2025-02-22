<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CheckmarkSolid from './icons/CheckmarkSolid.svelte';

  interface Props {
    label?: string;
    info?: string;
    color?: string;
    selected?: boolean;
  }

  let {
    label = 'button',
    info = 'info',
    color = 'blue',
    selected = false,
  }: Props = $props();

  const dispatch = createEventDispatcher();
  const click = (): void => {
    dispatch('click');
  };
</script>

<div class="flex flex-col text-center w-full">
  <button
    onclick={click}
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
</style>
