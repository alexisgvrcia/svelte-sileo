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

</script>

<div class="min-h-svh w-full flex flex-col">
    <div class="max-w-4xl w-full mx-auto px-6 flex-1 flex flex-col">
        <div class="flex-1 flex flex-col gap-12">
            <div class="animate-enter-up">
                <Hero />
            </div>
            <div class="animate-enter-up [animation-delay:80ms] [animation-fill-mode:both]">
                <QuickSetup />
            </div>
            <div class="animate-enter-up [animation-delay:160ms] [animation-fill-mode:both]">
                <ToastDemo {position} onpositionchange={handlePositionChange} />
            </div>
            <div class="animate-enter-soft [animation-delay:220ms] [animation-fill-mode:both]">
                <DocsReference />
            </div>
        </div>
        <div class="animate-enter-soft [animation-delay:300ms] [animation-fill-mode:both]">
            <Footer />
        </div>
    </div>
</div>
