"use client";

import { CheckCircle, Question, WarningCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type Props = {
  platform: string;
  children: ReactNode;
  className?: string;
};

export function EmbedSlot({ platform, children, className = "" }: Props) {
  const instagramToken = process.env.NEXT_PUBLIC_INSTAGRAM_TOKEN;
  const facebookAppId = process.env.NEXT_PUBLIC_FB_APP_ID;

  return (
    <div
      className={`rounded-[var(--radius-card)] border border-line bg-surface-raised p-7 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl">{platform}</h3>
        <FallbackState
          enabled={platform === "Instagram" ? Boolean(instagramToken) : Boolean(facebookAppId)}
        />
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function FallbackState({ enabled }: { enabled: boolean }) {
  if (enabled) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-dashed border-line-strong px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
      <Question size={12} />
      Fallback
    </span>
  );
}

export function VerificationNote() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-raised p-7">
      <div className="flex items-start gap-3">
        <WarningCircle size={20} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <h3 className="font-display text-lg">How these links were checked</h3>
          <p className="measure mt-3 text-sm leading-relaxed text-ink-muted">
            Links marked with a tick were requested directly and returned a live
            response. Facebook returns a success response for pages that do not
            exist, and Instagram does the same for handles, so neither can be
            machine-checked. Those links are included as supplied and should be
            confirmed by hand.
          </p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          Checked over HTTP, live
        </li>
        <li className="flex items-center gap-2">
          <Question size={16} className="text-ink-subtle" />
          Not machine-checkable
        </li>
      </ul>
    </div>
  );
}