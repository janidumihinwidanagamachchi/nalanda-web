"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { DURATION, EASE } from "@/constants/motion";
import { GALLERY_SLOTS, type MediaSlot } from "@/data/media";
import { useFinePointer } from "@/lib/pointer";

export function GalleryGrid() {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [open, setOpen] = useState<MediaSlot | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_SLOTS.map((slot, index) => (
          <motion.button
            key={slot.id}
            type="button"
            onClick={() => setOpen(slot)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-sunken text-left"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: DURATION.reveal,
              delay: reduce ? 0 : (index % 3) * 0.07,
              ease: EASE.strongOut,
            }}
            whileHover={reduce || !fine ? undefined : { scale: 0.985 }}
          >
            <Image
              src={slot.src}
              alt={slot.alt}
              width={slot.width}
              height={slot.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface/90 to-transparent p-4 pt-10">
              <span className="block text-sm text-ink">
                {slot.alt.replace(/^Placeholder: /, "")}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
                {slot.placeholder ? "Placeholder" : "Photograph"}
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center bg-surface/95 p-6 backdrop-blur-sm"
            style={{ overscrollBehavior: "contain" }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: DURATION.dropdown, ease: EASE.strongOut }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.alt}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-line"
              aria-label="Close"
            >
              <X size={18} weight="bold" />
            </button>
            <motion.figure
              className="relative w-full max-w-4xl"
              initial={reduce ? false : { scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduce ? undefined : { scale: 0.96, y: 12 }}
              transition={{ duration: DURATION.modal, ease: EASE.strongOut }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={open.src}
                alt={open.alt}
                width={open.width}
                height={open.height}
                sizes="100vw"
                className="w-full rounded-[var(--radius-card)] object-contain"
              />
              <figcaption className="mt-4 text-sm text-ink-muted">
                {open.credit}
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}