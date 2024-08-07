<script lang="ts">
  import ButtonCup from './ButtonCup.svelte';

  const buttons = [
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

      sendVote(buttons[index].value);
    }
  }

  function sendVote(value: string) {}
</script>

<div class="cup-buttons h-screen flex flex-col justify-center">
  {#each buttons as { label, color, info, selected }, index}
    <ButtonCup {label} {color} {info} {selected} on:click={() => vote(index)} />
  {/each}
</div>
