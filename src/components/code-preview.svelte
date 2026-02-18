<script lang="ts">
	import { tokenize } from 'sugar-high';
	import type { Snippet } from 'svelte';

	interface Props {
		code: string;
		children?: Snippet;
		codeOnly?: boolean;
	}

	let { code, children, codeOnly = false }: Props = $props();

	let tab = $state<'preview' | 'code'>('preview');

	$effect(() => {
		if (codeOnly) tab = 'code';
	});
	let copied = $state(false);

	const TOKEN_COLORS = [
		'var(--sh-identifier)',
		'var(--sh-keyword)',
		'var(--sh-string)',
		'var(--sh-class)',
		'var(--sh-property)',
		'var(--sh-entity)',
		'var(--sh-jsxliterals)',
		'var(--sh-sign)',
		'var(--sh-comment)',
		'',
		''
	];

	let tokens = $derived(tokenize(code));

	async function copyCode() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="rounded-xl border border-border overflow-hidden transition-colors duration-150">
	<div
		class="flex items-center justify-between bg-accent/40 border-b border-border transition-colors duration-150"
	>
		<div class="flex items-center">
			{#if !codeOnly}
				<button
					type="button"
					onclick={() => (tab = 'preview')}
					class="px-4 h-10 text-[12px] font-medium transition-colors duration-150 cursor-pointer border-b-2 -mb-px {tab ===
					'preview'
						? 'text-foreground border-foreground'
						: 'text-muted-foreground border-transparent hover:text-foreground'}"
				>
					Preview
				</button>
				<button
					type="button"
					onclick={() => (tab = 'code')}
					class="px-4 h-10 text-[12px] font-medium transition-colors duration-150 cursor-pointer border-b-2 -mb-px {tab ===
					'code'
						? 'text-foreground border-foreground'
						: 'text-muted-foreground border-transparent hover:text-foreground'}"
				>
					Code
				</button>
			{:else}
				<span class="px-4 h-10 flex items-center text-[12px] font-medium text-muted-foreground">
					Code
				</span>
			{/if}
		</div>

		{#if tab === 'code'}
			<button
				type="button"
				onclick={copyCode}
				class="mr-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
				aria-label="Copy code"
			>
				{#if copied}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M20 6 9 17l-5-5"></path>
					</svg>
				{:else}
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
						<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
					</svg>
				{/if}
			</button>
		{/if}
	</div>

	{#if tab === 'preview' && children}
		<div class="flex items-center justify-center gap-2 flex-wrap px-6 py-10">
			{@render children()}
		</div>
	{:else}
		<pre
			class="p-4 text-[13px] leading-relaxed font-code overflow-x-auto"><code>{#each tokens as [type, value]}{#if TOKEN_COLORS[type]}<span style="color:{TOKEN_COLORS[type]}">{value}</span>{:else}{value}{/if}{/each}</code></pre>
	{/if}
</div>
