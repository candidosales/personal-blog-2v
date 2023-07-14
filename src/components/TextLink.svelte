<script>
  export let label = "";
  export let title = "";
  export let href = "";
</script>

<a
  class="underline underline-offset-4 text-blue-600 after:content-['_↗'] flex flex-row align-middle items-center"
  font-medium
  {href}
  target="_blank"
  {title}><slot /> {label}</a
>
