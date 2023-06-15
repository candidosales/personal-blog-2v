<script>
  import Link from "./icons/Link.svelte";
  export let label = "";
  export let title = "";
  export let href = "";
</script>

<a
  class="underline underline-offset-4 text-blue-600"
  font-medium
  {href}
  target="_blank"
  {title}>{label}</a
>
