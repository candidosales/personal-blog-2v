<script>
  export let title = "";
  export let href = "";
</script>

<a
  class="underline underline-offset-4 text-blue-600 hover:text-blue-900 flex flex-row align-middle items-center"
  font-medium
  {href}
  {title}
  target="_blank"><slot /></a
>
