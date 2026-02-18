<script lang="ts">
	import CodePreview from "./code-preview.svelte";

	const styleCode = `sileo.success({
  title: 'Dark mode',
  fill: '#171717',
  styles: {
    title: 'text-white',
    description: 'text-neutral-300',
    badge: 'bg-white/10',
    button: 'bg-white/10 hover:bg-white/20'
  }
});`;

	const utilsCode = `import { sileo } from 'svelte-sileo';

sileo.setPosition('bottom-center');
sileo.setMultiple(true);
sileo.setOptions({ duration: 3000 });

const id = sileo.success({ title: 'Queued' });
sileo.dismiss(id);
sileo.clear();`;
</script>

<section id="docs" class="w-full max-w-xl mx-auto flex flex-col gap-8 pb-10">
	<div class="text-center space-y-3">
		<p class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium">Documentation</p>
		<h2 class="text-3xl sm:text-4xl font-semibold tracking-tight">Reference</h2>
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Core API</h3>
			<div class="flex flex-wrap gap-2">
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">success</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">error</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">warning</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">info</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">action</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">show</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">dismiss</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">clear</span>
			</div>
		</div>
		<div class="rounded-xl border border-border bg-accent/20 p-4">
			<p class="text-xs text-muted-foreground leading-relaxed">Use <span class="font-code">id</span> for deterministic replacement behavior.</p>
		</div>
		<CodePreview code={utilsCode} codeOnly />
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Styling</h3>
			<p class="text-sm text-muted-foreground">
				Control background with <span class="font-code">fill</span> and override classes per part with
				<span class="font-code">styles</span>.
			</p>
		</div>
		<CodePreview code={styleCode} codeOnly />
	</div>
</section>
