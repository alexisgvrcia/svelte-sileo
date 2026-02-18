import type { Component } from "svelte";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SileoDescription =
  | string
  | Component
  | (abstract new (...args: any[]) => any);

export type SileoState =
  | "success"
  | "loading"
  | "error"
  | "warning"
  | "info"
  | "action";

export interface SileoStyles {
  title?: string;
  description?: string;
  badge?: string;
  button?: string;
}

export interface SileoButton {
  title: string;
  onClick: () => void;
}

export const SILEO_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

export type SileoPosition = (typeof SILEO_POSITIONS)[number];

export interface SileoOptions {
  title?: string;
  description?: SileoDescription;
  position?: SileoPosition;
  duration?: number | null;
  icon?: Component | null;
  styles?: SileoStyles;
  fill?: string;
  roundness?: number;
  autopilot?: boolean | { expand?: number; collapse?: number };
  button?: SileoButton;
}
