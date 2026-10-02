"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { NAV_PRIMARY, NAV_SECONDARY, ROUTES, Z } from "@/constants/site";
import { DURATION, EASE, SPRING } from "@/constants/motion";

type NavItem = (typeof NAV_PRIMARY)[number];

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const { scrollY } = useScroll();
  const [prevPath, setPrevPath] = useState(pathname);

  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
    setOpenGroup(null);
  }

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <header
      style={{ zIndex: Z.nav }}
      className={`sticky top-0 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-line bg-surface/85 backdrop-blur-xl"
          : "border-transparent bg-surface"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link
          href={ROUTES.home}
          className="group flex items-center gap-3"
          aria-label={`${"Nalanda College"} home`}
        >
          <CrestMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-medium tracking-tight">
              Nalanda College
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Colombo · Est. 1925
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_PRIMARY.map((item) => (
            <DesktopItem
              key={item.label}
              item={item}
              open={openGroup === item.label}
              onToggle={() =>
                setOpenGroup((g) => (g === item.label ? null : item.label))
              }
              onClose={() => setOpenGroup(null)}
              active={isActive(item.href)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={ROUTES.contact}
            className="rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-sm font-medium text-surface-raised transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-accent-hover"
          >
            Enquire
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex size-11 items-center justify-center rounded-[var(--radius-control)] border border-line text-ink lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain border-t border-line bg-surface md:top-[72px]"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingRight: "env(safe-area-inset-right)",
            }}
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: DURATION.dropdown, ease: EASE.strongOut }}
          >
            <div className="shell flex flex-col gap-1 py-6">
              {NAV_PRIMARY.map((item) => (
                <MobileGroup key={item.label} item={item} active={isActive(item.href)} />
              ))}
              <div className="my-4 h-px w-full bg-line" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {NAV_SECONDARY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2.5 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function DesktopItem({
  item,
  open,
  onToggle,
  onClose,
  active,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const hasChildren = "children" in item && Array.isArray(item.children);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`relative rounded-[var(--radius-control)] px-3.5 py-2 text-sm transition-colors duration-200 ${
          active ? "text-accent" : "text-ink-muted hover:text-ink"
        }`}
      >
        {item.label}
        {active ? <Underline /> : null}
      </Link>
    );
  }

  const children = (item as { children: readonly { label: string; href: string }[] })
    .children;

  return (
    <div
      className="relative"
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`relative flex items-center gap-1.5 rounded-[var(--radius-control)] px-3.5 py-2 text-sm transition-colors duration-200 ${
          active || open ? "text-accent" : "text-ink-muted hover:text-ink"
        }`}
      >
        {item.label}
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          aria-hidden
        >
          ▾
        </span>
        {active ? <Underline /> : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 6 }}
            transition={SPRING.gentle}
            className="absolute left-0 top-full z-10 w-60 border border-line bg-surface-raised p-1.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
          >
            {children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="block rounded-[var(--radius-control)] px-3 py-2.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-surface-sunken hover:text-ink"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Underline() {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute inset-x-3 -bottom-px h-px bg-accent"
      transition={SPRING.apple}
    />
  );
}

function MobileGroup({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const hasChildren = "children" in item && Array.isArray(item.children);

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={`border-b border-line py-4 font-display text-2xl ${
          active ? "text-accent" : "text-ink"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  const children = (item as { children: readonly { label: string; href: string }[] })
    .children;

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between py-4 text-left font-display text-2xl ${
          active ? "text-accent" : "text-ink"
        }`}
      >
        {item.label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING.gentle}
          aria-hidden
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.ul
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.dropdown, ease: EASE.strongOut }}
            className="overflow-hidden"
          >
            {children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block py-3 pl-4 text-sm text-ink-muted"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CrestMark() {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#fdfcfa] p-0.5 ring-1 ring-accent/25">
      <Image
        src="/brand/crest.png"
        alt=""
        width={36}
        height={36}
        priority
        className="size-full scale-[1.35] object-contain"
      />
    </span>
  );
}