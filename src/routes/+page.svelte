<script lang="ts">
    import { setPosition, sileo } from "$lib";
    import type { SileoPosition } from "$lib/types";
    import Footer from "../components/footer.svelte";
    import Hero from "../components/hero.svelte";
    import QuickSetup from "../components/quick-setup.svelte";
    import ToastDemo from "../components/toast-demo.svelte";

    let position = $state<SileoPosition>("top-right");

    function handlePositionChange(pos: SileoPosition) {
        sileo.clear();
        setPosition(pos);
        position = pos;
    }
</script>

<div class="min-h-dvh w-full flex flex-col">
    <div class="max-w-4xl w-full mx-auto px-6 flex-1 flex flex-col">
        <div class="flex-1 flex flex-col gap-12">
            <Hero />
            <QuickSetup />
            <ToastDemo {position} onpositionchange={handlePositionChange} />
        </div>
        <Footer />
    </div>
</div>
