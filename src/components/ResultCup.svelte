<script lang="ts">
  import { onMount } from 'svelte';
  import type { VoteResult } from 'src/env';

  let okBar: HTMLElement | undefined;
  let uncertainBar: HTMLElement | undefined;
  let stopBar: HTMLElement | undefined;

  let okBarLabel: HTMLElement | undefined;
  let uncertainBarLabel: HTMLElement | undefined;
  let stopBarLabel: HTMLElement | undefined;

  let count: VoteResult | undefined;

  async function result() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('urlParams', urlParams.get('delete'));

    const url = urlParams.get('delete')
      ? `/api/result?delete=${urlParams.get('delete')}`
      : '/api/result';

    const res = await fetch(url, {
      method: 'GET',
    });

    count = await res.json();
    renderGraph(count);
  }

  function renderGraph(counts: VoteResult) {
    if (okBar && okBarLabel) {
      okBar.style.height = `${(counts.ok / counts.total) * 100}%`;
      okBarLabel.textContent = `${counts.ok} (${((counts.ok / counts.total) * 100).toFixed()}%)`;
    }

    if (uncertainBar && uncertainBarLabel) {
      uncertainBar.style.height = `${(counts.uncertain / counts.total) * 100}%`;
      uncertainBarLabel.textContent = `${counts.uncertain} (${((counts.uncertain / counts.total) * 100).toFixed()}%)`;
    }

    if (stopBar && stopBarLabel) {
      stopBar.style.height = `${(counts.stop / counts.total) * 100}%`;
      stopBarLabel.textContent = `${counts.stop} (${((counts.stop / counts.total) * 100).toFixed()}%)`;
    }
  }

  onMount(() => {
    void result();

    setInterval(() => {
      void result();
    }, 60000);
  });
</script>

<div class="graph">
  <div class="bar-graph mb-8">
    <div class="bar green-bar" bind:this={okBar}>
      <div class="label">Ok</div>
      <div class="value" bind:this={okBarLabel}>0</div>
    </div>
    <div class="bar yellow-bar" bind:this={uncertainBar}>
      <div class="label">Incerto</div>
      <div class="value" bind:this={uncertainBarLabel}>0</div>
    </div>
    <div class="bar red-bar" bind:this={stopBar}>
      <div class="label">Parar</div>
      <div class="value" bind:this={stopBarLabel}>0</div>
    </div>
  </div>
  <p class="text-sm text-center">
    Total {count?.total}
  </p>
</div>

<style lang="scss">
  .graph {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .bar-graph {
    display: flex;
    align-items: flex-end;
    height: 80vh;
    padding: 10px;
    box-sizing: border-box;
    @apply bg-slate-100 rounded-md pb-10 pt-20 shadow-lg;
  }

  .bar {
    flex: 1;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    border-radius: 10px;
  }

  .bar .label {
    position: absolute;
    bottom: -25px;
  }

  .bar .value {
    position: absolute;
    top: -25px;
  }

  .green-bar {
    @apply bg-green-500;
  }

  .yellow-bar {
    @apply bg-yellow-500;
  }

  .red-bar {
    @apply bg-red-500;
  }
</style>
