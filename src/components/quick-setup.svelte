<script lang="ts">
	import CodePreview from './code-preview.svelte';

	const code = `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

<Toaster position="top-right" />

<button onclick={() => sileo.success({ title: 'Changes saved' })}>
  Show Toast
</button>`;
</script>

<div class="w-full max-w-xl mx-auto">
	<p class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium text-center mb-3">
		Quick Setup
	</p>
	<p class="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
		Install the package, mount one <span class="font-code">Toaster</span>, and trigger toasts anywhere in
		your Svelte app.
	</p>
	<CodePreview {code} codeOnly />
</div>
