<script lang="ts">
    import { sileo } from "$lib";
    import type { SileoPosition } from "$lib/types";
    import DocsReference from "../components/docs-reference.svelte";
    import Footer from "../components/footer.svelte";
    import Hero from "../components/hero.svelte";
    import QuickSetup from "../components/quick-setup.svelte";
    import ToastDemo from "../components/toast-demo.svelte";

    let position = $state<SileoPosition>("top-right");

    function handlePositionChange(pos: SileoPosition) {
        sileo.setPosition(pos);
        position = pos;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: "svelte-sileo",
        description:
            "A physics-based toast library for Svelte with gooey SVG morphing, promise flows, inline actions, and support for custom Svelte components.",
        codeRepository: "https://github.com/alexisgvrcia/svelte-sileo",
        url: "https://svelte-sileo.alexisgvrcia.dev/",
        programmingLanguage: "TypeScript",
        runtimePlatform: "Svelte 5",
        license: "https://opensource.org/license/mit"
    };
</script>

<svelte:head>
    <script type="application/ld+json">
        {JSON.stringify(schema)}
    </script>
</svelte:head>

<div class="min-h-svh w-full flex flex-col">
    <div class="max-w-4xl w-full mx-auto px-6 flex-1 flex flex-col">
        <div class="flex-1 flex flex-col gap-12">
            <Hero />
            <QuickSetup />
            <ToastDemo {position} onpositionchange={handlePositionChange} />
            <DocsReference />
        </div>
        <Footer />
    </div>
</div>
