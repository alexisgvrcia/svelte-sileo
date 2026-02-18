<div align="center">

https://github.com/user-attachments/assets/b9da913b-36ef-4b14-853b-3889db112de8

# Svelte-Sileo

![SvelteKit](https://img.shields.io/badge/SvelteKit-111111?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![TypeScript](https://img.shields.io/badge/TypeScript-111111?style=for-the-badge&logo=typescript&logoColor=3178C6)

</div>

## What is Svelte-Sileo?

An opinionated toast component for Svelte. Gooey SVG morphing, spring physics, and a minimal API — beautiful by default.

> A Svelte port of [hiaaryan/sileo](https://github.com/hiaaryan/sileo).

### Features

- **Gooey Morphing** — SVG-based pill shape that smoothly morphs when expanding.
- **Spring Physics** — All animations driven by spring easing for a natural feel.
- **Promise API** — First-class support for async operations with loading → success/error transitions.
- **Custom Components** — Pass a Svelte component as `description` for rich toast content.
- **Custom Icons** — Swap the default state icon with any Svelte component.
- **Action Button** — Inline button with a callback, styled per toast state.
- **Autopilot** — Toasts auto-expand to show the description, then collapse before dismissing.
- **Swipe to dismiss** — Native swipe gesture support on mobile.
- **6 Positions** — `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- **Fully typed** — Written in TypeScript with full type coverage.

## Installation

```bash
npm install svelte-sileo
# or
pnpm add svelte-sileo
# or
yarn add svelte-sileo
```

## Quick Start

Add `<Toaster />` to your layout. Then call `sileo` from anywhere.

```svelte
<script lang="ts">
  import { Toaster, sileo } from 'svelte-sileo';
</script>

<Toaster />

<button onclick={() => sileo.success({ title: 'Changes saved' })}>
  Toast
</button>
```

## API

### `sileo.success(opts)`

```ts
sileo.success({ title: 'Changes saved' });
```

### `sileo.error(opts)`

```ts
sileo.error({
  title: 'Something went wrong',
  description: 'Please try again later.'
});
```

### `sileo.warning(opts)`

```ts
sileo.warning({ title: 'Storage almost full' });
```

### `sileo.info(opts)`

```ts
sileo.info({ title: 'New update available' });
```

### `sileo.action(opts)`

Renders a toast with an inline action button.

```ts
sileo.action({
  title: 'File uploaded',
  description: 'Share it with your team?',
  button: {
    title: 'Share',
    onClick: () => {}
  }
});
```

### `sileo.promise(promise, opts)`

Starts in a loading state and transitions to success or error automatically.

```ts
sileo.promise(
  new Promise((resolve) => setTimeout(resolve, 2000)),
  {
    loading: { title: 'Saving record...' },
    success: { title: 'Record saved' },
    error:   { title: 'Failed to save' }
  }
);
```

You can also pass a function to `success` or `error` to use the resolved value or error:

```ts
sileo.promise(fetchUser(), {
  loading: { title: 'Loading user...' },
  success: (data) => ({ title: `Welcome, ${data.name}!` }),
  error:   (err)  => ({ title: `Error: ${err.message}` })
});
```

When the promise resolves you can show an `action` state instead of `success`:

```ts
sileo.promise(uploadFile(), {
  loading: { title: 'Uploading...' },
  success: { title: 'Done' },
  action:  { title: 'File ready', button: { title: 'Download', onClick: () => {} } },
  error:   { title: 'Upload failed' }
});
```

### `sileo.show(opts)`

Generic toast with no default state icon.

```ts
sileo.show({ title: 'Hello world' });
```

### `sileo.dismiss(id)`

Dismiss a specific toast by id.

```ts
const id = sileo.success({ title: 'Saved' });

sileo.dismiss(id);
```

### `sileo.clear(position?)`

Dismiss all toasts, optionally scoped to a position.

```ts
sileo.clear();
sileo.clear('top-right');
```

## Options

Every method accepts a `SileoOptions` object:

| Option | Type | Description |
|---|---|---|
| `title` | `string` | Main toast text. |
| `description` | `string \| Component` | Expandable body. Accepts plain text or a Svelte component. |
| `button` | `{ title: string, onClick: () => void }` | Inline action button. |
| `icon` | `Component \| null` | Replaces the default state icon. |
| `duration` | `number \| null` | Auto-dismiss delay in ms. `null` = persistent. Default `6000`. |
| `position` | `SileoPosition` | Overrides the `<Toaster>` position for this toast. |
| `fill` | `string` | Background fill color of the pill. Default `#FFFFFF`. |
| `roundness` | `number` | Border radius of the pill. Default `16`. |
| `autopilot` | `boolean \| { expand?: number, collapse?: number }` | Auto-expand/collapse timing. |
| `styles` | `SileoStyles` | Per-element class overrides (`title`, `description`, `badge`, `button`). |

## Toaster Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `SileoPosition` | `top-right` | Where toasts appear. |
| `offset` | `number \| string \| object` | — | Edge offset. Accepts a value or `{ top, right, bottom, left }`. |
| `options` | `Partial<SileoOptions>` | — | Default options applied to every toast. |

## Custom Description Component

Pass any Svelte component as `description` for rich content:

```svelte
<!-- InvoiceToast.svelte -->
<div class="flex flex-col gap-2">
  <span class="text-xs opacity-50">Invoice #INV-2024-001</span>
  <span class="font-medium">$1,200.00 · 3 items</span>
</div>
```

```ts
import InvoiceToast from './InvoiceToast.svelte';

sileo.success({
  title: 'Invoice sent',
  description: InvoiceToast,
  button: { title: 'View', onClick: () => {} }
});
```

## Custom Icon

```ts
import RocketIcon from './RocketIcon.svelte';

sileo.success({
  title: 'Deployed',
  icon: RocketIcon
});
```

## Positions

```svelte
<!-- Available: top-left · top-center · top-right · bottom-left · bottom-center · bottom-right -->
<Toaster position="bottom-center" />
```

## License

[![LICENSE - MIT](https://img.shields.io/badge/LICENSE-MIT-111111?style=for-the-badge&labelColor=111111&logo=open-source-initiative&logoColor=white)](LICENSE)