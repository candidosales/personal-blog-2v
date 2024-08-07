<script lang="ts">
  import { onMount } from 'svelte';
  import ButtonCup from './ButtonCup.svelte';

  const room = '0001';
  export let ipAddress: string;

  let buttons = [
    {
      label: 'Estou ok',
      color: 'green',
      info: 'Estou confortável com meu entendimento e o ritmo da apresentação',
      value: 'ok',
      selected: false,
    },
    {
      label: 'Não tenho certeza',
      color: 'yellow',
      info: 'Estou tentando acompanhar, mas você poderia desacelerar um pouco ou revisar o conceito em que estamos',
      value: 'uncertain',
      selected: false,
    },
    {
      label: 'Pare',
      color: 'red',
      info: 'Não estou entendendo e tenho uma pergunta',
      value: 'stop',
      selected: false,
    },
  ];

  let blockUser = false;
  let fingerprint: string | undefined;

  async function getFingerprint() {
    const fingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      plugins: Array.from(navigator.plugins).map((p) => p.name),
      canvas: await getCanvasFingerprint(),
    };

    return hashFingerprint(JSON.stringify(fingerprint));
  }

  async function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('portfolio-candido', 2, 15);
    }
    return canvas.toDataURL();
  }

  async function hashFingerprint(fingerprint: string) {
    const msgUint8 = new TextEncoder().encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

  function vote(index: number) {
    if (buttons[index].selected == false) {
      buttons.map((b) => {
        b.selected = false;
      });

      buttons[index].selected = true;

      if (fingerprint && ipAddress) {
        void sendVote(buttons[index].value, fingerprint, ipAddress);
      }
    }
  }

  async function sendVote(
    value: string,
    fingerprint: string,
    ipAddress: string,
  ) {
    await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        room,
        value,
        fingerprint,
        ipAddress,
      }),
    });
    localStorage.setItem(`vote:${room}`, value);
  }

  function updateButton(value: string): void {
    if (value) {
      buttons.map((b) => {
        if (b.value === value) {
          b.selected = true;
        }
      });

      buttons = [...buttons];
    }
  }

  function checkMultipleTabs() {
    const channel = new BroadcastChannel('tab-candido-cup');
    let isPrimaryTab = true;

    channel.onmessage = function (event) {
      if (event.data === 'new-tab') {
        alert('Multiplas abas não são permitidas para votação');
        isPrimaryTab = false;
        blockUser = true;
      }
    };

    window.addEventListener('load', () => {
      channel.postMessage('new-tab');
    });

    window.addEventListener('unload', () => {
      if (isPrimaryTab) {
        channel.postMessage('tab-closed');
      }
    });
  }

  onMount(() => {
    const currentVote = localStorage.getItem(`vote:${room}`);
    if (currentVote) {
      updateButton(currentVote);
    }

    getFingerprint().then((hash) => {
      fingerprint = hash;
    });

    checkMultipleTabs();
  });
</script>

<div class="cup-buttons h-[90vh] flex flex-col justify-center">
  {#if !blockUser}
    {#each buttons as { label, color, info, selected }, index}
      <ButtonCup
        {label}
        {color}
        {info}
        {selected}
        on:click={() => vote(index)}
      />
    {/each}
  {/if}
</div>
