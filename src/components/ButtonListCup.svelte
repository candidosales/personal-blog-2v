<script lang="ts">
  import { onMount } from 'svelte';
  import ButtonCup from './ButtonCup.svelte';
  import { getFingerprint } from '@lib/helpers/fingerprint';
  import { checkMultipleTabs } from '@lib/helpers/multiple-tabs';
  import { Toaster, toast } from 'svelte-sonner';

  const room = '0001';

  let buttons = $state([
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
      info: 'Estou acompanhando, mas você poderia desacelerar um pouco ou revisar o conceito em que estamos',
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
  ]);

  let blockUser = false;
  let fingerprint: string | undefined;

  function vote(index: number) {
    if (buttons[index].selected == false) {
      buttons.map((b) => {
        b.selected = false;
      });

      buttons[index].selected = true;

      if (fingerprint) {
        void sendVote(buttons[index].value, fingerprint);
      }
    }
  }

  async function sendVote(value: string, fingerprint: string) {
    const response = await fetch('/api/votes', {
      method: 'POST',
      body: JSON.stringify({
        room,
        value,
        fingerprint,
      }),
    });

    toast.success('Voto registrado');

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

  onMount(() => {
    const currentVote = localStorage.getItem(`vote:${room}`);
    if (currentVote) {
      updateButton(currentVote);
    }

    getFingerprint().then((hash) => {
      fingerprint = hash;
    });

    checkMultipleTabs(blockUser);
  });
</script>

<div class="cup-buttons h-[80svh] grid grid-rows-3 place-items-center mt-4">
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
<Toaster richColors position="bottom-center" />
