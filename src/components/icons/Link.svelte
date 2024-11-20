<script lang="ts">
  interface Props {
    [key: string]: any
  }

  let { ...rest }: Props = $props();
</script>

<svg
  viewBox="0 0 24 24"
  focusable="false"
  stroke="currentColor"
  class="w-6 h-6"
  {...rest}
  ><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"
    ><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path
      d="M15 3h6v6"
    /><path d="M10 14L21 3" /></g
  ></svg
>
