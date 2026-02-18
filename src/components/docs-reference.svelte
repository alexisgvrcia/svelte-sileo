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

	const descriptionComponentCode = `import InvoiceToast from './InvoiceToast.svelte';

sileo.success({
  title: 'Invoice sent',
  description: InvoiceToast,
  button: { title: 'View', onClick: () => {} }
});`;

	const actionExamples: { title: string; code: string }[] = [
		{
			title: "Success",
			code: `sileo.success({ title: 'Changes saved' });`,
		},
		{
			title: "Error",
			code: `sileo.error({
  title: 'Something went wrong',
  description: 'Please try again later.'
});`,
		},
		{
			title: "Warning",
			code: `sileo.warning({ title: 'Storage almost full' });`,
		},
		{
			title: "Info",
			code: `sileo.info({ title: 'New update available' });`,
		},
		{
			title: "Action",
			code: `sileo.action({
  title: 'File uploaded',
  description: 'Share it with your team?',
  button: { title: 'Share', onClick: () => {} }
});`,
		},
		{
			title: "Custom Icon",
			code: `import RocketIcon from './RocketIcon.svelte';

sileo.success({
  title: 'Deployed',
  icon: RocketIcon
});`,
		},
		{
			title: "Promise",
			code: `sileo.promise(new Promise((r) => setTimeout(r, 2000)), {
  loading: { title: 'Saving record...' },
  success: { title: 'Record saved' },
  error: { title: 'Failed to save' }
});`,
		},
	];

	const toasterCode = `<Toaster
  position="top-right"
  multiple={false}
  offset={8}
  options={{
    duration: 6000,
    autopilot: { expand: 150, collapse: 4000 }
  }}
/>`;
</script>

<section id="docs" class="w-full max-w-xl mx-auto flex flex-col gap-8 pb-10">
	<div class="text-center space-y-3">
		<p class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium">Documentation</p>
		<h2 class="text-3xl sm:text-4xl font-semibold tracking-tight">Reference</h2>
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Core API</h3>
		</div>
		<div class="rounded-xl border border-border bg-accent/20 p-4">
			<p class="text-xs text-muted-foreground leading-relaxed">Use <span class="font-code">id</span> for deterministic replacement behavior.</p>
		</div>
		<CodePreview code={utilsCode} codeOnly />
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Action Examples</h3>
		</div>
		<div class="space-y-3">
			{#each actionExamples as example}
				<div class="space-y-2">
					<p class="text-xs uppercase tracking-widest text-neutral-300 font-medium">{example.title}</p>
					<CodePreview code={example.code} codeOnly />
				</div>
			{/each}
		</div>
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Toaster Props</h3>
			<div class="flex flex-wrap gap-2">
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">position</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">offset</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">multiple</span>
				<span class="px-2.5 py-1 rounded-lg bg-accent text-xs font-code text-foreground">options</span>
			</div>
		</div>
		<CodePreview code={toasterCode} codeOnly />
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Important Options</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
				<div class="rounded-lg border border-border bg-accent/20 p-3 text-muted-foreground"><span class="font-code text-foreground">duration: null</span> keeps toast persistent.</div>
				<div class="rounded-lg border border-border bg-accent/20 p-3 text-muted-foreground"><span class="font-code text-foreground">autopilot: false</span> disables auto expand/collapse.</div>
				<div class="rounded-lg border border-border bg-accent/20 p-3 text-muted-foreground"><span class="font-code text-foreground">icon: null</span> hides the icon badge.</div>
				<div class="rounded-lg border border-border bg-accent/20 p-3 text-muted-foreground"><span class="font-code text-foreground">description: Component</span> renders custom Svelte content.</div>
			</div>
		</div>
	</div>

	<div class="space-y-6">
		<div class="space-y-2">
			<h3 class="text-xl font-semibold tracking-tight">Description as Component</h3>
			<p class="text-sm text-muted-foreground">
				You can pass a Svelte component to <span class="font-code">description</span> for rich content.
			</p>
		</div>
		<CodePreview code={descriptionComponentCode} codeOnly />
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
