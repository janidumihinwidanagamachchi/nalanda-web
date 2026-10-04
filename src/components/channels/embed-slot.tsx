"use client";

import { CheckCircle, Question, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

type Props = {
  platform: string;
  children: ReactNode;
  className?: string;
};

export function EmbedSlot({ platform, children, className }: Props) {
  const instagramToken = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;
  const facebookAppId = process.env.NEXT_PUBLIC_FB_APP_ID;

  return (
    <div className={`rounded-xl border bg-panel p-7 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-xl">{platform}</h3>
        <FallbackState
          enabled={
            platform === "Instagram"
              ? Boolean(instagramToken)
              : Boolean(facebookAppId)
          }
        />
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

/**
 * Marks a slot whose live embed needs an API token the site does not ship.
 * Dashed edge, because it is a seam rather than content.
 */
function FallbackState({ enabled }: { enabled: boolean }) {
  if (enabled) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-field px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-quiet-ink">
      <Question size={12} />
      Fallback
    </span>
  );
}

export function VerificationNote() {
  return (
    <div className="rounded-xl border bg-panel p-7">
      <div className="flex items-start gap-3">
        <WarningCircle size={20} className="mt-0.5 shrink-0 text-brand" />
        <div>
          <h3 className="font-serif text-lg">How these links were checked</h3>
          <p className="measure mt-3 text-sm text-quiet-ink">
            Links marked with a tick were requested directly and returned a live
            response. Facebook returns a success response for pages that do not
            exist, and Instagram does the same for handles, so neither can be
            machine-checked. Those links are included as supplied and should be
            confirmed by hand.
          </p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 text-sm text-quiet-ink sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          Checked over HTTP, live
        </li>
        <li className="flex items-center gap-2">
          <Question size={16} />
          Not machine-checkable
        </li>
      </ul>
    </div>
  );
}