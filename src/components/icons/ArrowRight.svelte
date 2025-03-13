<script lang="ts">
    interface Props {
        [key: string]: any;
    }

    let { ...rest }: Props = $props();
</script>

<svg
    class="overflow-visible ml-3 text-slate-800 group-hover:text-slate-400"
    width="3"
    height="6"
    viewBox="0 0 3 6"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    {...rest}><path d="M0 0L3 3L0 6" /></svg
>
