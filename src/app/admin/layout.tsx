import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminGate } from "@/components/admin/gate";

/**
 * The admin route group.
 *
 * It deliberately sits outside `app/(site)/`, so it carries none of the public
 * chrome — no site navigation, no footer, no colour theme scripts beyond those the
 * root layout already provides. An editor is looking at a different job from a
 * visitor, and a navbar full of links out of a tool you are about to publish from
 * is one stray click too many.
 *
 * `noindex` is belt and braces. The panel is built into the static output like
 * any other route, and there is no server to keep it out of a crawler; the
 * database's policies are the real protection, but a login page has no business in
 * a search index either.
 */
export const metadata: Metadata = {
  title: {
    default: "Content administration",
    template: "%s · Nalanda College administration",
  },
  robots: { index: false, follow: false, nocache: true },
  referrer: "same-origin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}