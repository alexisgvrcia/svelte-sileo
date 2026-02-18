<div class="relative overflow-hidden rounded-lg min-h-24 p-3 flex flex-col justify-end border border-white/15">
	<video
		class="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
		disablepictureinpicture
		disableremoteplayback
		aria-hidden="true"
	>
		<source src="/background-toast.mp4" type="video/mp4" />
	</video>
	<div class="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/55"></div>
	<div class="relative z-10 space-y-1">
		<p class="text-sm font-semibold text-white">Sileo for Svelte is now live.</p>
		<p class="text-xs text-white/85">Gooey morphing, spring feel, and typed APIs included.</p>
	</div>
</div>
