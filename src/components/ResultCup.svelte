<script lang="ts">
  import { onMount } from 'svelte';
  import type { VoteResult } from 'src/env';

  let okBar: HTMLElement | undefined = $state();
  let uncertainBar: HTMLElement | undefined = $state();
  let stopBar: HTMLElement | undefined = $state();

  let okBarLabel: HTMLElement | undefined = $state();
  let uncertainBarLabel: HTMLElement | undefined = $state();
  let stopBarLabel: HTMLElement | undefined = $state();

  let count: VoteResult | undefined = $state();

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
    if (count) {
      renderGraph(count);
    }
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
    background-color: var(--color-slate-100);
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding-bottom: 16px;
    padding-top: 32px;
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
    background-color: var(--color-green-500);
  }

  .yellow-bar {
    background-color: var(--color-yellow-500);
  }

  .red-bar {
    background-color: var(--color-red-500);
  }
</style>
