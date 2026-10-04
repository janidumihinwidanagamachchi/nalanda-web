"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ASSET_BASE,
  NAV_PRIMARY,
  NAV_UTILITY,
  ROUTES,
  type NavItem,
} from "@/constants/site";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * The site header.
 *
 * Navigation comes from `NAV_PRIMARY` / `NAV_UTILITY` in constants/site.ts, so
 * the header, the footer and the mobile drawer cannot disagree about what
 * exists. An item with children opens a dropdown; the header previously had its
 * own hardcoded list which had drifted, promoting "Scores" (the sports page) to
 * a top-level item while burying fourteen other routes in one flat menu.
 *
 * Two pieces of state: which dropdown is open, and whether the header has been
 * scrolled. Both are deliberately kept out of the render path — the scroll flag
 * is written straight to the class list, because re-rendering the header on
 * every scroll frame is the cost a scroll listener should never carry.
 *
 * The dropdown is a plain button plus two listeners rather than a Radix menu.
 * That trades the library's roving-focus behaviour for a great deal less code
 * on something this size, but it does mean `Escape`, outside-click and focus
 * return are each handled explicitly below.
 */
export function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const panelId = useId();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  /**
   * Scroll state goes straight to the class list rather than through React
   * state: the header re-renders on every scroll frame otherwise, which is the
   * kind of cost a scroll listener should never carry.
   */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Closed during render rather than in an effect: React discards this render
  // and retries with the new state, which avoids an extra commit.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
  }

  // A dropdown stays open only while the pointer is over the header, so the
  // whole strip is the hit area rather than just the trigger. Leaving the
  // header closes it, which is what a reader expects from a hover menu and
  // cannot get from a click-only one.
  useEffect(() => {
    if (!openMenu) return;
    const nav = navRef.current;
    if (!nav) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!nav.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const label = openMenu;
      setOpenMenu(null);
      triggerRefs.current.get(label)?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  /** A parent is current when the reader is anywhere inside it. */
  const isActive = (item: NavItem) => {
    const paths = [item.href, ...(item.children?.map((c) => c.href) ?? [])];
    return paths.some((href) =>
      href === ROUTES.home ? pathname === href : pathname.startsWith(href),
    );
  };

  const isCurrent = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[var(--z-nav)] border-b border-line bg-panel/85 backdrop-blur-md"
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link
          href={ROUTES.home}
          className="flex items-center gap-3"
          aria-label={`${SITE.name}, home`}
        >
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border bg-panel">
            <Image
              src={`${ASSET_BASE}/brand/crest.png`}
              alt=""
              width={36}
              height={36}
              priority
              className="size-full object-cover"
            />
          </span>
          <span className="font-serif text-lg leading-tight">
            {/*
              The name sits on one line at every width so the header never
              reflows on a narrow phone.
            */}
            <span className="block whitespace-nowrap">{SITE.name}</span>
            <span className="field mt-0.5 block">{SITE.place}</span>
          </span>
        </Link>

        {/*
          The toggle is its own flex child rather than inside either nav, so it
          stays reachable at every width — including the narrow phone layout
          where the desktop nav is hidden and the sheet is closed.
        */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div
            ref={navRef}
            className="relative hidden items-center gap-6 lg:flex"
            onMouseLeave={() => setOpenMenu(null)}
          >
            <nav className="flex items-center gap-6" aria-label="Main">
              {NAV_PRIMARY.map((item) =>
                item.children ? (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      ref={(node) => {
                        if (node) triggerRefs.current.set(item.label, node);
                        else triggerRefs.current.delete(item.label);
                      }}
                      aria-expanded={openMenu === item.label}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenMenu((v) => (v === item.label ? null : item.label))
                      }
                      className={`flex items-center gap-1 text-sm transition-colors duration-[var(--motion-fast)] ${
                        isActive(item)
                          ? "text-brand"
                          : "text-ink hover:text-brand"
                      }`}
                    >
                      {item.label}
                      <span aria-hidden className="text-[0.6rem] leading-none">
                        &#9662;
                      </span>
                    </button>

                    {openMenu === item.label ? (
                      <div
                        id={panelId}
                        className="absolute left-0 top-[calc(100%+0.75rem)] w-60 rounded-xl border bg-floating p-1.5 shadow-[0_12px_40px_color-mix(in_srgb,var(--ink)_14%,transparent)]"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            aria-current={
                              isCurrent(child.href) ? "page" : undefined
                            }
                            onClick={() => setOpenMenu(null)}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors duration-[var(--motion-fast)] ${
                              isCurrent(child.href)
                                ? "bg-alt text-ink"
                                : "text-quiet-ink hover:bg-alt hover:text-ink"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={`wipe text-sm transition-colors duration-[var(--motion-fast)] ${
                      isCurrent(item.href)
                        ? "text-brand"
                        : "text-ink hover:text-brand"
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <Button asChild size="sm">
              <Link href={ROUTES.admissions}>Admissions</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="font-serif text-xl">
                {SITE.name}
              </SheetTitle>
              <nav className="grid gap-4" aria-label="Main">
                {NAV_PRIMARY.map((item) => (
                  <div key={item.label} className="grid gap-1">
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          isCurrent(item.href)
                            ? "text-brand"
                            : "text-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                    {item.children?.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={
                            isCurrent(child.href) ? "page" : undefined
                          }
                          className={`rounded-md py-1.5 pl-6 pr-3 text-sm ${
                            isCurrent(child.href)
                              ? "text-brand"
                              : "text-quiet-ink"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                ))}

                <div className="rule my-1" />

                {NAV_UTILITY.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={`rounded-md px-3 py-2 text-sm ${
                        isCurrent(item.href)
                          ? "text-brand"
                          : "text-quiet-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild className="mt-6 w-full">
                  <Link href={ROUTES.admissions}>Admissions</Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}