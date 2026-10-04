"use client";

import Image from "next/image";
import { X } from "@phosphor-icons/react/dist/ssr";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { MediaSlot } from "@/data/media";
import { cn } from "@/lib/utils";
import { AwaitingPlate } from "@/components/ui/card";

/**
 * The gallery grid and its lightbox.
 *
 * The lightbox is Radix Dialog, which brings focus trapping, `Escape` to close
 * and scroll locking that a hand-rolled overlay only partly had.
 *
 * The selected slot lives in state because Radix renders one shared dialog
 * that every trigger opens, so there is no per-trigger content to read from.
 *
 * A slot still waiting on a photograph is not a trigger. It renders the drawn
 * plate and does not open anything, because there is nothing to enlarge — and
 * because the earlier behaviour opened a lightbox containing a `picsum.photos`
 * landscape under a caption about the college's own buildings.
 *
 * Slots arrive as a prop rather than an import: a client component cannot await
 * a build-time database read, and this subtree has to stay client-side for the
 * lightbox to work.
 */
export function GalleryGrid({ slots }: { slots: MediaSlot[] }) {
  const [open, setOpen] = useState<MediaSlot | null>(null);

  return (
    <Dialog.Root open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, index) =>
          slot.placeholder ? (
            <AwaitingPlate
              key={slot.id}
              slot={slot}
              className="aspect-[4/3] rounded-xl border"
            />
          ) : (
            <Dialog.Trigger asChild key={slot.id}>
              <button
                type="button"
                onClick={() => setOpen(slot)}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-xl border bg-alt text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                )}
              >
                <Image
                  src={slot.src}
                  alt={slot.alt}
                  width={slot.width}
                  height={slot.height}
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="size-full object-cover transition-transform duration-[var(--motion-base)] ease-[var(--ease-out-quint)] group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/90 to-transparent p-4 pt-12">
                  <span className="block text-sm text-ink">{slot.alt}</span>
                  <span className="field mt-1 block">Photograph</span>
                </span>
              </button>
            </Dialog.Trigger>
          ),
        )}
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-canvas/95 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-6">
          <Dialog.Title className="sr-only">{open?.alt ?? "Photograph"}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Enlarged view. Press Escape to close.
          </Dialog.Description>

          {open ? (
            <figure className="w-full max-w-4xl">
              <Image
                src={open.src}
                alt={open.alt}
                width={open.width}
                height={open.height}
                sizes="100vw"
                className="w-full rounded-xl object-contain"
              />
              <figcaption className="mt-4 text-sm text-quiet-ink">
                {open.credit}
              </figcaption>
            </figure>
          ) : null}

          <Dialog.Close
            className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border bg-panel"
            aria-label="Close"
          >
            <X size={18} weight="bold" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}