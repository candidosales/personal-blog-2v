<script lang="ts">
  import { onMount } from 'svelte';
  import ButtonCup from './ButtonCup.svelte';

  const room = '0001';

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

  function getFingerprint() {
    var fingerprint = [];
    fingerprint.push({ key: 'user_agent', value: navigator.userAgent });
    fingerprint.push({ key: 'language', value: navigator.language });
    fingerprint.push({ key: 'pixel_ratio', value: window.devicePixelRatio });
    fingerprint.push({
      key: 'hardware_concurrency',
      value: navigator.hardwareConcurrency,
    });
    fingerprint.push({
      key: 'resolution',
      value: [screen.width, screen.height],
    });
    fingerprint.push({
      key: 'available_resolution',
      value: [screen.availHeight, screen.availWidth],
    });
    fingerprint.push({
      key: 'timezone_offset',
      value: new Date().getTimezoneOffset(),
    });
    fingerprint.push({ key: 'session_storage', value: !window.sessionStorage });
    fingerprint.push({ key: 'local_storage', value: !window.localStorage });
    fingerprint.push({ key: 'indexed_db', value: !window.indexedDB });
    fingerprint.push({ key: 'open_database', value: !window.openDatabase });
    fingerprint.push({ key: 'navigator_platform', value: navigator.platform });
    fingerprint.push({ key: 'navigator_oscpu', value: navigator.oscpu });
    fingerprint.push({ key: 'do_not_track', value: navigator.doNotTrack });
    fingerprint.push({ key: 'touch_support', value: navigator.maxTouchPoints });

    fingerprint.push({ key: 'cookie_enabled', value: navigator.cookieEnabled });

    var short_fingerprint = '';
    for (let j = 0; j < fingerprint.length; j++) {
      if (fingerprint[j].value) {
        short_fingerprint += fingerprint[j].value
          .toString()
          .toLowerCase()
          .substring(0, 1);
      }
    }

    short_fingerprint += fingerprint.length;
    console.log('shortFingerprint', short_fingerprint);
  }

  function vote(index: number) {
    if (buttons[index].selected == false) {
      console.log('vote', index, buttons[index]);

      buttons.map((b) => {
        b.selected = false;
      });

      buttons[index].selected = true;

      void sendVote(buttons[index].value);
    }
  }

  async function sendVote(value: string) {
    const res = await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        room,
        value,
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

    getFingerprint();

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
