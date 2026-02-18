<script lang="ts">
    import { Toaster } from "$lib";
    import "./layout.css";

    let { children } = $props();
</script>

<Toaster
    offset={8}
    options={{
        fill: "#ffffff",
        styles: {
            description: "text-black/60!",
        },
    }}
/>

{@render children()}
