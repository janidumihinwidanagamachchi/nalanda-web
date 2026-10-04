"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

/**
 * Radix Dialog styled as a side sheet.
 *
 * Radix supplies the behaviour that is genuinely hard to get right by hand:
 * focus trapping, `Escape` to dismiss, scroll locking, and restoring focus to
 * the trigger on close. It also sets `data-state` for enter/exit transitions,
 * which this project deliberately ignores — there is no slide or fade, the
 * panel is simply present or absent.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-[var(--z-overlay)] bg-black/50"
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-[var(--z-modal)] flex w-full max-w-sm flex-col gap-6 overflow-y-auto border-l bg-panel p-6 text-panel-ink shadow-xl",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-md px-2 py-1 font-mono text-xs uppercase tracking-[0.14em] text-quiet-ink hover:bg-alt hover:text-alt-ink"
          aria-label="Close menu"
        >
          Close
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}