// The two link-button looks (Hala's DESIGN.md, Buttons): one primary action per view, and a
// secondary one beside it. 44px tall, settling 1px when pressed.
const base =
  "inline-flex h-11 items-center gap-2 rounded-control px-5 font-medium whitespace-nowrap active:translate-y-px motion-safe:transition-[background-color,transform]";

export const primaryButton = `${base} bg-primary text-primary-foreground hover:bg-primary-strong`;
export const secondaryButton = `${base} bg-secondary text-foreground hover:bg-secondary-strong`;
