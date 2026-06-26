# svelte-sileo

> Opinionated toast library for Svelte with gooey SVG morphing, spring-driven motion, promise flows, inline actions, and support for custom Svelte components inside the toast body.

## Install

```bash
npm install svelte-sileo
```

## Quick Start

Render a single `<Toaster />` once in your app, usually in the root layout, then call `sileo` anywhere.

```svelte
<script lang="ts">
  import { Toaster, sileo } from "svelte-sileo";
</script>

<Toaster />

<button onclick={() => sileo.success({ title: "Changes saved" })}>
  Show toast
</button>
```

Default behavior: single-toast mode. A new toast replaces the current one unless you enable `multiple`.

## Mental Model

- `Toaster` is the mounted viewport and source of global defaults.
- `sileo` is the imperative API for creating, updating, and clearing toasts.
- In single mode, missing `id` falls back to a shared default id, so subsequent calls replace the visible toast.
- In multiple mode, missing `id` generates a unique id, so toasts stack.
- Passing a stable `id` gives deterministic in-place replacement behavior in both modes.
- `description` can be plain text or a Svelte component constructor.
- `button` adds an inline action button inside the expanded toast.
- `autopilot` controls the auto expand/collapse cycle for toasts with extra content.

## Core API

```ts
import { sileo } from "svelte-sileo";

sileo.success({ title: "Saved" });
sileo.error({ title: "Request failed", description: "Try again later." });
sileo.warning({ title: "Storage almost full" });
sileo.info({ title: "New update available" });
sileo.action({
  title: "File uploaded",
  description: "Share it with your team?",
  button: { title: "Share", onClick: () => {} },
});
sileo.show({ title: "Generic toast" });
```

## Promise API

Use `sileo.promise()` for async flows. It starts as `loading`, then updates the same toast to `success`, `error`, or `action`.

```ts
sileo.promise(saveRecord(), {
  loading: { title: "Saving record..." },
  success: { title: "Record saved" },
  error: { title: "Failed to save" },
});
```

Important constraints:

- `loading` only accepts `title` and `icon`.
- `success`, `error`, and `action` can include `description`, `button`, `styles`, `fill`, and other normal toast options.
- `success`, `error`, and `action` may also be functions that receive the resolved value or error.
- If `action` is provided, it takes precedence over `success` after the promise resolves.

Example with resolved data:

```ts
sileo.promise(fetchUser(), {
  loading: { title: "Loading user..." },
  success: (user) => ({ title: `Welcome, ${user.name}!` }),
  error: (err) => ({ title: `Error: ${err.message}` }),
});
```

## Toaster

```svelte
<Toaster
  position="top-right"
  multiple={false}
  offset={8}
  options={{
    duration: 6000,
    autopilot: { expand: 150, collapse: 4000 },
  }}
/>
```

`Toaster` props:

- `position`: `top-left | top-center | top-right | bottom-left | bottom-center | bottom-right`
- `multiple`: stack mode toggle, default `false`
- `offset`: number, CSS string, or edge object like `{ top, right, bottom, left }`
- `options`: default `SileoOptions` merged into every toast

## Toast Options

```ts
type SileoOptions = {
  id?: string;
  title?: string;
  description?: string | SvelteComponent;
  position?: SileoPosition;
  duration?: number | null;
  icon?: SvelteComponent | null;
  styles?: {
    title?: string;
    description?: string;
    badge?: string;
    button?: string;
  };
  fill?: string;
  roundness?: number;
  autopilot?: boolean | { expand?: number; collapse?: number };
  button?: { title: string; onClick: () => void };
};
```

Key behaviors:

- `duration: null` keeps the toast persistent.
- `icon: null` hides the icon badge.
- `fill` sets the gooey pill background color.
- `styles` overrides classes for individual parts: `title`, `description`, `badge`, `button`.
- `roundness` controls pill corner radius and indirectly the blur used by the gooey effect.
- `autopilot: false` disables automatic expand/collapse.

## Custom Svelte Content

You can pass a Svelte component as `description`.

```ts
import InvoiceToast from "./InvoiceToast.svelte";

sileo.success({
  title: "Invoice sent",
  description: InvoiceToast,
  button: { title: "View", onClick: () => {} },
});
```

This is the main escape hatch for rich content inside the toast body.

## Global Controls

```ts
sileo.setPosition("bottom-center");
sileo.setMultiple(true);
sileo.setOptions({ duration: 3000 });

const id = sileo.success({ title: "Queued" });
sileo.dismiss(id);
sileo.clear();
sileo.clear("top-right");
```

## Styling Notes

- The default look is a white gooey pill with state-colored accents.
- For dark toasts, set `fill` to a dark color and override text/button classes through `styles`.
- Global CSS variables can change state colors, dimensions, and animation duration.
- The library imports its own styles through the exported `Toaster` component.

## Guidance For AI Agents

When generating code for `svelte-sileo`, prefer these patterns:

- Mount exactly one `<Toaster />` high in the tree unless the user explicitly wants multiple viewports.
- Use `sileo.success`, `error`, `warning`, `info`, `action`, or `show` for imperative triggers.
- Use `sileo.promise()` for async mutations instead of manually chaining loading/success/error toasts.
- If the user wants a toast to update in place, provide a stable `id`.
- If the user wants stacked notifications, enable `<Toaster multiple />` or call `sileo.setMultiple(true)`.
- If the user wants custom body UI, pass a Svelte component to `description` instead of stuffing markup into strings.
- If the user wants a CTA, use the `button` option.
- If the user wants dark or branded toasts, prefer `fill` plus `styles` overrides.
- If the user wants a toast to stay visible, set `duration: null`.
- If the user wants manual-only expansion, set `autopilot: false`.

## Common Examples

```ts
sileo.success({ title: "Changes saved" });

sileo.error({
  title: "Checkout failed",
  description: "Your card was declined.",
  duration: null,
});

sileo.action({
  title: "Deploy complete",
  description: "Production build is ready.",
  button: { title: "Open", onClick: () => window.open("/deploys") },
});
```
