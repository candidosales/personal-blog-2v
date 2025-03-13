<script lang="ts">
    interface Props {
        [key: string]: any;
    }

    let { ...rest }: Props = $props();
</script>

<svg viewBox="0 0 24 24" fill="currentColor" {...rest}>
    <path
        fill="currentColor"
        d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"
    />
    <path
        fill="currentColor"
        d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"
    />
</svg>
