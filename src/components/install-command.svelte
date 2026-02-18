<script lang="ts">
	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText("npm install sileo");
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	class="h-10 pl-4 pr-3 rounded-xl text-sm font-medium bg-accent active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
	onclick={copy}
>
	<span class="font-code text-muted-foreground select-none">$</span>
	<span class="font-code text-[13px] text-foreground"
		>npm install svelte-sileo</span
	>
	<span
		class="size-6 rounded-lg bg-accent text-muted-foreground flex items-center justify-center hover:bg-accent-hover transition-colors"
	>
		{#if copied}
			<svg
				width="12"
				height="12"
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
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
				<path
					d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
				></path>
			</svg>
		{/if}
	</span>
</button>
