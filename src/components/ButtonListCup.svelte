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

    const json = await res.json();
    console.log('sendVote', json);

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
  });
</script>

<div class="cup-buttons h-screen flex flex-col justify-center">
  {#each buttons as { label, color, info, selected }, index}
    <ButtonCup {label} {color} {info} {selected} on:click={() => vote(index)} />
  {/each}
</div>
