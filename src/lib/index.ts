export { default as Toaster } from "./toaster.svelte";

export { sileo, toastStore, setStorePosition, setStoreOptions } from "./store";
export type { SileoItem, SileoPromiseOptions } from "./store";

export type {
  SileoOptions,
  SileoDescription,
  SileoPosition,
  SileoState,
  SileoStyles,
  SileoButton,
} from "./types";
export { SILEO_POSITIONS } from "./types";
