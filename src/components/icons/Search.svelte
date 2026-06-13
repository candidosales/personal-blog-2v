<script lang="ts">
  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  class="w-6 h-6"
  {...rest}
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
  />
</svg>