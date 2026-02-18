<script lang="ts">
    import type { Component } from "svelte";
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";
    import {
        BLUR_RATIO,
        DEFAULT_ROUNDNESS,
        HEADER_EXIT_MS,
        HEIGHT,
        MIN_EXPAND_RATIO,
        PILL_PADDING,
        SPRING_CONFIG,
        SWAP_COLLAPSE_MS,
        WIDTH,
    } from "./constants";
    import ArrowRight from "./icons/ArrowRight.svelte";
    import Check from "./icons/Check.svelte";
    import CircleAlert from "./icons/CircleAlert.svelte";
    import LifeBuoy from "./icons/LifeBuoy.svelte";
    import LoaderCircle from "./icons/LoaderCircle.svelte";
    import XIcon from "./icons/X.svelte";
    import type { SileoButton, SileoState, SileoStyles } from "./types";

    interface Props {
        id: string;
        fill?: string;
        toastState?: SileoState;
        title?: string;
        description?:
            | string
            | Component
            | (abstract new (...args: any[]) => any);
        position?: "left" | "center" | "right";
        expand?: "top" | "bottom";
        className?: string;
        icon?: Component | null;
        styles?: SileoStyles;
        button?: SileoButton;
        roundness?: number;
        exiting?: boolean;
        autoExpandDelayMs?: number;
        autoCollapseDelayMs?: number;
        canExpand?: boolean;
        interruptKey?: string;
        refreshKey?: string;
        onmouseenter?: (e: MouseEvent) => void;
        onmouseleave?: (e: MouseEvent) => void;
        onDismiss?: () => void;
    }

    let {
        id,
        fill = "#FFFFFF",
        toastState = "success",
        title = toastState,
        description,
        position = "left",
        expand = "bottom",
        className,
        icon,
        styles,
        button,
        roundness,
        exiting = false,
        autoExpandDelayMs,
        autoCollapseDelayMs,
        canExpand,
        interruptKey,
        refreshKey,
        onmouseenter,
        onmouseleave,
        onDismiss,
    }: Props = $props();

    const STATE_ICONS: Record<SileoState, Component> = {
        success: Check,
        loading: LoaderCircle,
        error: XIcon,
        warning: CircleAlert,
        info: LifeBuoy,
        action: ArrowRight,
    };

    interface View {
        title?: string;
        description?:
            | string
            | Component
            | (abstract new (...args: any[]) => any);
        toastState: SileoState;
        icon?: Component | null;
        styles?: SileoStyles;
        button?: SileoButton;
        fill: string;
    }

    let next = $derived<View>({
        title,
        description,
        toastState,
        icon,
        styles,
        button,
        fill,
    });

    let view = $state<View>({
        title: "success",
        description: undefined,
        toastState: "success",
        icon: undefined,
        styles: undefined,
        button: undefined,
        fill: "#FFFFFF",
    });

    let applied = $state<string | undefined>(undefined);
    let isExpanded = $state(false);
    let ready = $state(false);
    let pillWidth = $state(0);
    let contentHeight = $state(0);

    let headerLayer = $state<{
        current: { key: string; view: View };
        prev: { key: string; view: View } | null;
    }>({
        current: {
            key: "success-success",
            view: {
                title: "success",
                description: undefined,
                toastState: "success",
                icon: undefined,
                styles: undefined,
                button: undefined,
                fill: "#FFFFFF",
            },
        },
        prev: null,
    });

    let initialized = false;

    $effect(() => {
        if (!initialized) {
            initialized = true;
            view = next;
            applied = refreshKey;
            const hk = `${next.toastState}-${next.title}`;
            headerLayer = {
                current: { key: hk, view: next },
                prev: null,
            };
        }
    });

    let isDescComponent = $derived(typeof view.description === "function");
    let hasDesc = $derived(Boolean(view.description) || Boolean(view.button));
    let isLoading = $derived(view.toastState === "loading");
    let open = $derived(hasDesc && isExpanded && !isLoading);
    let allowExpand = $derived(
        isLoading
            ? false
            : (canExpand ?? (!interruptKey || interruptKey === id)),
    );

    let filterId = $derived(`sileo-gooey-${id}`);
    let resolvedRoundness = $derived(
        Math.max(0, roundness ?? DEFAULT_ROUNDNESS),
    );
    let blur = $derived(resolvedRoundness * BLUR_RATIO);

    let buttonEl: HTMLButtonElement | undefined = $state();
    let headerEl: HTMLDivElement | undefined = $state();
    let contentEl: HTMLDivElement | undefined = $state();
    let innerEl: HTMLDivElement | undefined = $state();

    let headerPad: number | null = null;
    let headerExitTimer: ReturnType<typeof setTimeout> | null = null;
    let autoExpandTimer: ReturnType<typeof setTimeout> | null = null;
    let autoCollapseTimer: ReturnType<typeof setTimeout> | null = null;
    let swapTimer: ReturnType<typeof setTimeout> | null = null;
    let lastRefreshKey: string | undefined;
    let pending: { key?: string; payload: View } | null = null;

    const pillSpring = spring(
        { x: 0, width: HEIGHT, height: HEIGHT },
        SPRING_CONFIG,
    );

    const bodySpring = spring({ height: 0, opacity: 0 }, SPRING_CONFIG);

    let minExpanded = $derived(HEIGHT * MIN_EXPAND_RATIO);
    let rawExpanded = $derived(
        hasDesc ? Math.max(minExpanded, HEIGHT + contentHeight) : minExpanded,
    );

    let frozenExpanded = $state(HEIGHT * MIN_EXPAND_RATIO);

    $effect(() => {
        if (open) {
            frozenExpanded = rawExpanded;
        }
    });

    let expanded = $derived(open ? rawExpanded : frozenExpanded);
    let svgHeight = $derived(
        hasDesc ? Math.max(expanded, minExpanded) : HEIGHT,
    );
    let expandedContent = $derived(Math.max(0, expanded - HEIGHT));
    let resolvedPillWidth = $derived(Math.max(pillWidth || HEIGHT, HEIGHT));
    let pillHeight = $derived(HEIGHT + blur * 3);

    let pillX = $derived(
        position === "right"
            ? WIDTH - resolvedPillWidth
            : position === "center"
              ? (WIDTH - resolvedPillWidth) / 2
              : 0,
    );

    let viewBox = $derived(`0 0 ${WIDTH} ${svgHeight}`);

    let rootStyle = $derived(
        `--_h:${open ? expanded : HEIGHT}px;` +
            `--_pw:${resolvedPillWidth}px;` +
            `--_px:${pillX}px;` +
            `--_ht:translateY(${open ? (expand === "bottom" ? 3 : -3) : 0}px) scale(${open ? 0.9 : 1});` +
            `--_co:${open ? 1 : 0}`,
    );

    let canvasStyle = $derived(`filter:url(#${filterId})`);

    $effect(() => {
        if (!ready) {
            pillSpring.set(
                {
                    x: pillX,
                    width: resolvedPillWidth,
                    height: open ? pillHeight : HEIGHT,
                },
                { hard: true },
            );
        } else {
            pillSpring.set({
                x: pillX,
                width: resolvedPillWidth,
                height: open ? pillHeight : HEIGHT,
            });
        }
    });

    $effect(() => {
        bodySpring.stiffness = open ? SPRING_CONFIG.stiffness : 1;
        bodySpring.damping = open ? SPRING_CONFIG.damping : 1;
        bodySpring.set({
            height: open ? expandedContent : 0,
            opacity: open ? 1 : 0,
        });
    });

    let pillRo: ResizeObserver | null = null;
    let pillRaf = 0;
    let pillObservedEl: Element | null = null;

    function measurePill() {
        const el = innerEl;
        const header = headerEl;
        if (!el || !header) return;
        if (headerPad === null) {
            const cs = getComputedStyle(header);
            headerPad =
                parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        }
        const w = el.scrollWidth + headerPad + PILL_PADDING;
        if (w > PILL_PADDING) {
            pillWidth = w;
        }
    }

    $effect(() => {
        void headerLayer.current.key;
        measurePill();

        if (!pillRo) {
            pillRo = new ResizeObserver(() => {
                cancelAnimationFrame(pillRaf);
                pillRaf = requestAnimationFrame(() => {
                    const inner = innerEl;
                    const pad = headerPad ?? 0;
                    if (!inner) return;
                    const w = inner.scrollWidth + pad + PILL_PADDING;
                    if (w > PILL_PADDING) {
                        pillWidth = w;
                    }
                });
            });
        }

        const el = innerEl;
        if (el && pillObservedEl !== el) {
            if (pillObservedEl) {
                pillRo.unobserve(pillObservedEl);
            }
            pillRo.observe(el);
            pillObservedEl = el;
        }

        return () => {
            cancelAnimationFrame(pillRaf);
            pillRo?.disconnect();
            pillRo = null;
            pillObservedEl = null;
        };
    });

    $effect(() => {
        if (!hasDesc) {
            contentHeight = 0;
            return;
        }
        const el = contentEl;
        if (!el) return;
        const measure = () => {
            const h = el.scrollHeight;
            contentHeight = h;
        };
        measure();
        let rafId = 0;
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(measure);
        });
        ro.observe(el);
        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
        };
    });

    onMount(() => {
        const raf = requestAnimationFrame(() => {
            ready = true;
        });
        return () => cancelAnimationFrame(raf);
    });

    function applyView(newView: View) {
        const newKey = `${newView.toastState}-${newView.title}`;
        if (headerLayer.current.key !== newKey) {
            headerLayer = {
                prev: headerLayer.current,
                current: { key: newKey, view: newView },
            };
        } else if (headerLayer.current.view !== newView) {
            headerLayer = {
                ...headerLayer,
                current: { key: newKey, view: newView },
            };
        }
        view = newView;
    }

    $effect(() => {
        if (!headerLayer.prev) return;
        if (headerExitTimer) {
            clearTimeout(headerExitTimer);
        }
        headerExitTimer = setTimeout(() => {
            headerExitTimer = null;
            headerLayer = { ...headerLayer, prev: null };
        }, HEADER_EXIT_MS);
        return () => {
            if (headerExitTimer) {
                clearTimeout(headerExitTimer);
                headerExitTimer = null;
            }
        };
    });

    $effect(() => {
        const currentNext = next;
        const currentRefreshKey = refreshKey;

        if (currentRefreshKey === undefined) {
            applyView(currentNext);
            applied = undefined;
            pending = null;
            lastRefreshKey = currentRefreshKey;
            return;
        }

        if (lastRefreshKey === currentRefreshKey) return;
        lastRefreshKey = currentRefreshKey;

        if (swapTimer) {
            clearTimeout(swapTimer);
            swapTimer = null;
        }

        if (open) {
            pending = { key: currentRefreshKey, payload: currentNext };
            isExpanded = false;
            swapTimer = setTimeout(() => {
                swapTimer = null;
                if (!pending) return;
                applyView(pending.payload);
                applied = pending.key;
                pending = null;
            }, SWAP_COLLAPSE_MS);
        } else {
            pending = null;
            applyView(currentNext);
            applied = currentRefreshKey;
        }
    });

    $effect(() => {
        void applied;
        if (!hasDesc) return;

        if (autoExpandTimer) clearTimeout(autoExpandTimer);
        if (autoCollapseTimer) clearTimeout(autoCollapseTimer);

        if (exiting || !allowExpand) {
            isExpanded = false;
            return;
        }

        if (autoExpandDelayMs == null && autoCollapseDelayMs == null) return;

        const expandDelay = autoExpandDelayMs ?? 0;
        const collapseDelay = autoCollapseDelayMs ?? 0;

        if (expandDelay > 0) {
            autoExpandTimer = setTimeout(() => {
                isExpanded = true;
            }, expandDelay);
        } else {
            isExpanded = true;
        }

        if (collapseDelay > 0) {
            autoCollapseTimer = setTimeout(() => {
                isExpanded = false;
            }, collapseDelay);
        }

        return () => {
            if (autoExpandTimer) clearTimeout(autoExpandTimer);
            if (autoCollapseTimer) clearTimeout(autoCollapseTimer);
        };
    });

    function handleEnter(e: MouseEvent) {
        onmouseenter?.(e);
        if (hasDesc) isExpanded = true;
    }

    function handleLeave(e: MouseEvent) {
        onmouseleave?.(e);
        isExpanded = false;
    }

    function handleTransitionEnd(e: TransitionEvent) {
        if (e.propertyName !== "height" && e.propertyName !== "transform")
            return;
        if (open) return;
        if (!pending) return;
        if (swapTimer) {
            clearTimeout(swapTimer);
            swapTimer = null;
        }
        applyView(pending.payload);
        applied = pending.key;
        pending = null;
    }

    const SWIPE_DISMISS = 30;
    const SWIPE_MAX = 20;
    let pointerStart: number | null = null;

    function handlePointerMove(e: PointerEvent) {
        if (pointerStart === null || !buttonEl) return;
        const dy = e.clientY - pointerStart;
        const sign = dy > 0 ? 1 : -1;
        const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign;
        buttonEl.style.transform = `translateY(${clamped}px)`;
    }

    function handlePointerUp(e: PointerEvent) {
        if (pointerStart === null || !buttonEl) return;
        const dy = e.clientY - pointerStart;
        pointerStart = null;
        buttonEl.style.transform = "";
        buttonEl.removeEventListener("pointermove", handlePointerMove);
        buttonEl.removeEventListener("pointerup", handlePointerUp);
        if (Math.abs(dy) > SWIPE_DISMISS) {
            onDismiss?.();
        }
    }

    function handlePointerDown(e: PointerEvent) {
        if (exiting || !onDismiss) return;
        const target = e.target as HTMLElement;
        if (target.closest("[data-sileo-button]")) return;
        pointerStart = e.clientY;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        if (buttonEl) {
            buttonEl.addEventListener("pointermove", handlePointerMove, {
                passive: true,
            });
            buttonEl.addEventListener("pointerup", handlePointerUp, {
                passive: true,
            });
        }
    }

    function handleButtonClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        view.button?.onClick();
    }
</script>

<button
    bind:this={buttonEl}
    type="button"
    data-sileo-toast
    data-ready={ready}
    data-expanded={open}
    data-exiting={exiting}
    data-edge={expand}
    data-position={position}
    data-state={view.toastState}
    class={className}
    style={rootStyle}
    onmouseenter={handleEnter}
    onmouseleave={handleLeave}
    ontransitionend={handleTransitionEnd}
    onpointerdown={handlePointerDown}
>
    <div data-sileo-canvas data-edge={expand} style={canvasStyle}>
        <svg data-sileo-svg width={WIDTH} height={svgHeight} {viewBox}>
            <title>Sileo Notification</title>
            <defs>
                <filter
                    id={filterId}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    color-interpolation-filters="sRGB"
                >
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation={blur}
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                        result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </defs>
            <rect
                data-sileo-pill
                rx={resolvedRoundness}
                ry={resolvedRoundness}
                fill={view.fill}
                x={$pillSpring.x}
                width={$pillSpring.width}
                height={$pillSpring.height}
            />
            <rect
                data-sileo-body
                y={HEIGHT}
                width={WIDTH}
                rx={resolvedRoundness}
                ry={resolvedRoundness}
                fill={view.fill}
                height={$bodySpring.height}
                opacity={$bodySpring.opacity}
            />
        </svg>
    </div>

    <div bind:this={headerEl} data-sileo-header data-edge={expand}>
        <div data-sileo-header-stack>
            <div
                bind:this={innerEl}
                data-sileo-header-inner
                data-layer="current"
            >
                <div
                    data-sileo-badge
                    data-state={headerLayer.current.view.toastState}
                    class={headerLayer.current.view.styles?.badge}
                >
                    {#if headerLayer.current.view.icon}
                        {@const IconComp = headerLayer.current.view.icon}
                        <IconComp />
                    {:else}
                        {@const DefaultIcon =
                            STATE_ICONS[headerLayer.current.view.toastState]}
                        <DefaultIcon />
                    {/if}
                </div>
                <span
                    data-sileo-title
                    data-state={headerLayer.current.view.toastState}
                    class={headerLayer.current.view.styles?.title}
                >
                    {headerLayer.current.view.title}
                </span>
            </div>
            {#if headerLayer.prev}
                <div
                    data-sileo-header-inner
                    data-layer="prev"
                    data-exiting="true"
                >
                    <div
                        data-sileo-badge
                        data-state={headerLayer.prev.view.toastState}
                        class={headerLayer.prev.view.styles?.badge}
                    >
                        {#if headerLayer.prev.view.icon}
                            {@const PrevIconComp = headerLayer.prev.view.icon}
                            <PrevIconComp />
                        {:else}
                            {@const PrevDefaultIcon =
                                STATE_ICONS[headerLayer.prev.view.toastState]}
                            <PrevDefaultIcon />
                        {/if}
                    </div>
                    <span
                        data-sileo-title
                        data-state={headerLayer.prev.view.toastState}
                        class={headerLayer.prev.view.styles?.title}
                    >
                        {headerLayer.prev.view.title}
                    </span>
                </div>
            {/if}
        </div>
    </div>

    {#if hasDesc}
        <div data-sileo-content data-edge={expand} data-visible={open}>
            <div
                bind:this={contentEl}
                data-sileo-description
                class={view.styles?.description}
            >
                {#if isDescComponent}
                    {@const DescComp = view.description as Component}
                    <DescComp />
                {:else}
                    {view.description}
                {/if}
                {#if view.button}
                    <!-- svelte-ignore a11y_invalid_attribute -->
                    <a
                        href="#"
                        data-sileo-button
                        data-state={view.toastState}
                        class={view.styles?.button}
                        onclick={handleButtonClick}
                    >
                        {view.button.title}
                    </a>
                {/if}
            </div>
        </div>
    {/if}
</button>
