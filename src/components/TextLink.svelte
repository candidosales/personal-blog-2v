<script>
  export let title = "";
  export let href = "";
</script>

<a
  class="no-underline hover:underline hover:underline-offset-4 flex flex-row align-middle items-center"
  {href}
  {title}
  target="_blank"><slot /></a
>
