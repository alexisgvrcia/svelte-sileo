<script lang="ts">
    import { flip } from "svelte/animate";
    import type { Snippet } from "svelte";
    import { onDestroy } from "svelte";
    import { SvelteMap } from "svelte/reactivity";
    import { DEFAULT_TOAST_DURATION, EXIT_DURATION } from "./constants";
    import Sileo from "./sileo.svelte";
    import type { SileoItem } from "./store";
    import { sileo, toastStore } from "./store";
    import type { SileoOptions, SileoPosition } from "./types";
    import "./styles.css";

    type SileoOffsetValue = number | string;
    type SileoOffsetConfig = Partial<
        Record<"top" | "right" | "bottom" | "left", SileoOffsetValue>
    >;

    interface Props {
        children?: Snippet;
        position?: SileoPosition;
        offset?: SileoOffsetValue | SileoOffsetConfig;
        multiple?: boolean;
        options?: Partial<SileoOptions>;
    }

    let {
        children,
        position = "top-right",
        offset,
        multiple = false,
        options,
    }: Props = $props();

    const pillAlign = (pos: SileoPosition) =>
        pos.includes("right")
            ? "right"
            : pos.includes("center")
              ? "center"
              : "left";
    const expandDir = (pos: SileoPosition) =>
        pos.startsWith("top") ? ("bottom" as const) : ("top" as const);

    const timeoutKey = (t: SileoItem) => `${t.id}:${t.instanceId}`;
    const resolveDuration = (t: SileoItem) =>
        t.duration ?? DEFAULT_TOAST_DURATION;

    let toasts = $state<SileoItem[]>([]);
    let hoveredId = $state<string | undefined>(undefined);
    const timers = new SvelteMap<string, ReturnType<typeof setTimeout>>();
    const deadlines = new SvelteMap<string, number>();
    const remaining = new SvelteMap<string, number>();

    const handlersCache = new SvelteMap<
        string,
        {
            enter: () => void;
            leave: () => void;
            dismiss: () => void;
        }
    >();

    $effect(() => {
        sileo.setPosition(position);
        sileo.setMultiple(multiple);
        sileo.setOptions(options);
    });

    const unsubscribe = toastStore.subscribe((value) => {
        toasts = value;
    });

    onDestroy(() => {
        unsubscribe();
        clearAllTimers();
    });

    function clearAllTimers() {
        for (const t of timers.values()) clearTimeout(t);
        timers.clear();
        deadlines.clear();
        remaining.clear();
    }

    function dismissToast(id: string) {
        const item = toasts.find((t) => t.id === id);
        if (!item || item.exiting) return;

        toastStore.update((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
        );

        setTimeout(
            () => toastStore.update((prev) => prev.filter((t) => t.id !== id)),
            EXIT_DURATION,
        );
    }

    function schedule(items: SileoItem[]) {
        for (const item of items) {
            if (item.exiting) continue;
            if (item.id === hoveredId) continue;
            const key = timeoutKey(item);
            if (timers.has(key)) continue;

            const dur = remaining.get(key) ?? resolveDuration(item);
            if (dur === null || dur <= 0) continue;

            deadlines.set(key, Date.now() + dur);
            remaining.delete(key);
            timers.set(
                key,
                setTimeout(() => dismissToast(item.id), dur),
            );
        }
    }

    function pauseToastTimer(toastId: string) {
        const item = toasts.find((t) => t.id === toastId && !t.exiting);
        if (!item) return;

        const key = timeoutKey(item);
        const timer = timers.get(key);
        if (!timer) return;

        clearTimeout(timer);
        timers.delete(key);

        const deadline = deadlines.get(key);
        if (deadline !== undefined) {
            remaining.set(key, Math.max(0, deadline - Date.now()));
            deadlines.delete(key);
        }
    }

    function createHandlers(toastId: string) {
        return {
            enter: () => {
                hoveredId = toastId;
                pauseToastTimer(toastId);
            },
            leave: () => {
                hoveredId = undefined;
                schedule(toasts);
            },
            dismiss: () => dismissToast(toastId),
        };
    }

    $effect(() => {
        const toastKeys = new Set(toasts.map(timeoutKey));
        const toastIds = new Set(toasts.map((t) => t.id));
        for (const [key, timer] of timers) {
            if (!toastKeys.has(key)) {
                clearTimeout(timer);
                timers.delete(key);
                deadlines.delete(key);
                remaining.delete(key);
            }
        }
        for (const key of deadlines.keys()) {
            if (!toastKeys.has(key)) deadlines.delete(key);
        }
        for (const key of remaining.keys()) {
            if (!toastKeys.has(key)) remaining.delete(key);
        }
        for (const id of handlersCache.keys()) {
            if (!toastIds.has(id)) handlersCache.delete(id);
        }
        for (const toast of toasts) {
            if (!handlersCache.has(toast.id)) {
                handlersCache.set(toast.id, createHandlers(toast.id));
            }
        }

        const sliding = toasts.filter((t) => t.slideFrom);
        if (sliding.length > 0) {
            setTimeout(() => {
                toastStore.update((prev) =>
                    prev.map((t) =>
                        t.slideFrom ? { ...t, slideFrom: undefined } : t,
                    ),
                );
            }, 700);
        }

        schedule(toasts);
    });

    let latest = $derived.by(() => {
        for (let i = toasts.length - 1; i >= 0; i--) {
            if (!toasts[i].exiting) return toasts[i].id;
        }
        return undefined;
    });

    let activeId = $derived(hoveredId ?? latest);

    function getHandlers(toastId: string) {
        return handlersCache.get(toastId)!;
    }

    function getViewportStyle(pos: SileoPosition): string {
        if (offset === undefined) return "";

        const o =
            typeof offset === "object"
                ? offset
                : { top: offset, right: offset, bottom: offset, left: offset };

        const px = (v: SileoOffsetValue) =>
            typeof v === "number" ? `${v}px` : v;

        const parts: string[] = [];
        if (pos.startsWith("top") && o.top) parts.push(`top:${px(o.top)}`);
        if (pos.startsWith("bottom") && o.bottom)
            parts.push(`bottom:${px(o.bottom)}`);
        if (pos.endsWith("left") && o.left) parts.push(`left:${px(o.left)}`);
        if (pos.endsWith("right") && o.right)
            parts.push(`right:${px(o.right)}`);

        return parts.join(";");
    }

    let activePositions = $derived.by(() => {
        const map = new SvelteMap<SileoPosition, SileoItem[]>();
        for (const t of toasts) {
            const pos = t.position ?? position;
            const arr = map.get(pos);
            if (arr) {
                arr.push(t);
            } else {
                map.set(pos, [t]);
            }
        }
        return map;
    });
</script>

{#if children}
    {@render children()}
{/if}
{#each [...activePositions] as [pos, items] (pos)}
    {@const pill = pillAlign(pos)}
    {@const expandDirection = expandDir(pos)}
    <section
        data-sileo-viewport
        data-position={pos}
        aria-live="polite"
        style={getViewportStyle(pos)}
    >
        {#each items as item (item.id)}
            {@const h = getHandlers(item.id)}
            <div
                data-sileo-slide-wrapper
                data-slide-from={item.slideFrom ?? undefined}
                animate:flip={{ duration: EXIT_DURATION, easing: (t) => t }}
            >
                <Sileo
                    id={item.id}
                    toastState={item.state}
                    title={item.title}
                    description={item.description}
                    position={pill}
                    expand={expandDirection}
                    icon={item.icon}
                    fill={item.fill}
                    styles={item.styles}
                    button={item.button}
                    roundness={item.roundness}
                    exiting={item.exiting}
                    autoExpandDelayMs={item.autoExpandDelayMs}
                    autoCollapseDelayMs={item.autoCollapseDelayMs}
                    refreshKey={item.instanceId}
                    canExpand={activeId === undefined || activeId === item.id}
                    onmouseenter={h.enter}
                    onmouseleave={h.leave}
                    onDismiss={h.dismiss}
                />
            </div>
        {/each}
    </section>
{/each}
