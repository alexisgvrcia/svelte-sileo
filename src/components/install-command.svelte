<script lang="ts">
	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText("npm install svelte-sileo");
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	class="group h-10 pl-4 pr-3 rounded-xl text-sm font-medium bg-accent hover:bg-accent-hover active:scale-[0.96] transition-[transform,background-color] duration-300 ease-out flex items-center gap-3 cursor-pointer"
	onclick={copy}
>
	<span class="font-code text-muted-foreground select-none">$</span>
	<span class="font-code text-[13px] text-foreground"
		>npm install svelte-sileo</span
	>
	<span
		class="relative size-6 rounded-lg bg-accent/80 text-muted-foreground flex items-center justify-center transition-[background-color,color] duration-300 ease-out group-hover:bg-accent-hover group-hover:text-foreground"
	>
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="absolute inset-0 m-auto transition-[transform,opacity,filter] duration-300 ease-out {copied ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-[2px]'}"
			>
				<path d="M20 6 9 17l-5-5"></path>
			</svg>
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="absolute inset-0 m-auto transition-[transform,opacity,filter] duration-300 ease-out {copied ? 'opacity-0 scale-75 blur-[2px]' : 'opacity-100 scale-100 blur-0'}"
			>
				<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
				<path
					d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
				></path>
			</svg>
	</span>
</button>
