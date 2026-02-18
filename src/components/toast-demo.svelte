<script lang="ts">
	import { sileo } from "$lib";
	import { SILEO_POSITIONS, type SileoPosition } from "$lib/types";

	import RocketIcon from "./icons/rocket-icon.svelte";
	import PdfRecordToast from "./utils/pdf-record-toast.svelte";
	import CodePreview from "./code-preview.svelte";

	interface Props {
		position: SileoPosition;
		onpositionchange: (pos: SileoPosition) => void;
	}

	let { position, onpositionchange }: Props = $props();

	let activeDemo = $state("success");
	let multiple = $state(false);

	const positionLabels: Record<SileoPosition, string> = {
		"top-left": "Top Left",
		"top-center": "Top Center",
		"top-right": "Top Right",
		"bottom-left": "Bottom Left",
		"bottom-center": "Bottom Center",
		"bottom-right": "Bottom Right",
	};

	const toasterTag = (pos: SileoPosition, isMultiple: boolean) =>
		`<Toaster${isMultiple ? " multiple" : ""} position="${pos}" />`;

	const demoSnippets: Record<string, (pos: SileoPosition, isMultiple: boolean) => string> = {
		success: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.success({ title: 'Changes saved' })}>
  Success
</button>`,
		error: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.error({
  title: 'Something went wrong',
  description: 'Please try again later.'
})}>
  Error
</button>`,
		warning: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.warning({ title: 'Storage almost full' })}>
  Warning
</button>`,
		info: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.info({ title: 'New update available' })}>
  Info
</button>`,
		action: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.action({
  title: 'File uploaded',
  description: 'Share it with your team?',
  button: {
    title: 'Share',
    onClick: () => {}
  }
})}>
  Action
</button>`,
		icon: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
  import RocketIcon from './RocketIcon.svelte';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.success({
  title: 'Deployed',
  icon: RocketIcon
})}>
  Icon
</button>`,
		promise: (pos, isMultiple) => `<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
  import PdfRecordToast from './pdf-record-toast.svelte';
<\/script>

${toasterTag(pos, isMultiple)}

<button onclick={() => sileo.promise(
  new Promise((r) => setTimeout(r, 2000)),
  {
    loading: { title: 'Saving record...' },
    success: {
      title: 'Record saved',
      description: PdfRecordToast,
      button: {
        title: 'Download',
        onClick: () => {}
      }
    },
    error: { title: 'Failed to save' }
  }
)}>
  Promise
</button>`,
	};

	const demos: { id: string; label: string; action: () => void }[] = [
		{
			id: "success",
			label: "Success",
			action: () => sileo.success({ title: "Changes saved" }),
		},
		{
			id: "error",
			label: "Error",
			action: () =>
				sileo.error({
					title: "Something went wrong",
					description: "Please try again later.",
				}),
		},
		{
			id: "warning",
			label: "Warning",
			action: () => sileo.warning({ title: "Storage almost full" }),
		},
		{
			id: "info",
			label: "Info",
			action: () => sileo.info({ title: "New update available" }),
		},
		{
			id: "action",
			label: "Action",
			action: () =>
				sileo.action({
					title: "File uploaded",
					description: "Share it with your team?",
					button: {
						title: "Share",
						onClick: () => sileo.success({ title: "Shared!" }),
					},
				}),
		},
		{
			id: "icon",
			label: "Icon",
			action: () =>
				sileo.success({
					title: "Deployed",
					icon: RocketIcon,
				}),
		},
		{
			id: "promise",
			label: "Promise",
			action: () => {
				sileo.promise(new Promise((r) => setTimeout(r, 2000)), {
					loading: { title: "Saving record..." },
					success: {
						title: "Record saved",
						description: PdfRecordToast,
						button: {
							title: "Download",
							onClick: () =>
								sileo.success({ title: "Download started!" }),
						},
					},
					error: { title: "Failed to save" },
				});
			},
		},
	];

	$effect(() => {
		sileo.setMultiple(multiple);
	});

	let playgroundCode = $derived(demoSnippets[activeDemo](position, multiple));

	function handleModeChange(enabled: boolean) {
		if (multiple === enabled) return;
		sileo.clear();
		sileo.setMultiple(enabled);
		multiple = enabled;
	}

	function handleDemo(demo: (typeof demos)[number]) {
		activeDemo = demo.id;
		demo.action();
	}
</script>

<div class="flex flex-col items-center gap-8 pb-8">
	<div class="w-full max-w-xl">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium text-center mb-3"
		>
			Playground
		</p>
		<CodePreview code={playgroundCode}>
			{#each demos as demo}
				<button
					type="button"
					class="inline-flex items-center justify-center font-medium transition-all cursor-pointer active:scale-95 h-9 px-4 rounded-xl text-xs {demo.id ===
					activeDemo
						? 'bg-foreground text-background'
						: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
					onclick={() => handleDemo(demo)}
				>
					{demo.label}
				</button>
			{/each}
		</CodePreview>
	</div>

	<div class="flex flex-col items-center gap-3">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium"
		>
			Mode
		</p>
		<div class="flex items-center justify-center gap-2 px-6">
			<button
				type="button"
				class="inline-flex items-center justify-center font-medium transition-all cursor-pointer active:scale-95 h-9 px-4 rounded-xl text-xs {!multiple
					? 'bg-foreground text-background'
					: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
				onclick={() => handleModeChange(false)}
			>
				Single
			</button>
			<button
				type="button"
				class="inline-flex items-center justify-center font-medium transition-all cursor-pointer active:scale-95 h-9 px-4 rounded-xl text-xs {multiple
					? 'bg-foreground text-background'
					: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
				onclick={() => handleModeChange(true)}
			>
				Multiple
			</button>
		</div>
		<p class="text-[11px] text-muted-foreground text-center">
			{multiple ? "Stack mode enabled." : "Single mode enabled."}
		</p>
	</div>

	<div class="flex flex-col items-center gap-3">
		<p
			class="text-[11px] text-neutral-300 tracking-widest uppercase font-medium"
		>
			Position
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2 px-6">
			{#each SILEO_POSITIONS as pos}
				<button
					type="button"
					class="inline-flex items-center justify-center font-medium transition-all cursor-pointer active:scale-95 h-9 px-4 rounded-xl text-xs {pos ===
					position
						? 'bg-foreground text-background'
						: 'bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground'}"
					onclick={() => onpositionchange(pos)}
				>
					{positionLabels[pos]}
				</button>
			{/each}
		</div>
		<p class="text-[11px] text-muted-foreground text-center mt-2">
			Available positions: {SILEO_POSITIONS.join(", ")}.
		</p>
	</div>
</div>
