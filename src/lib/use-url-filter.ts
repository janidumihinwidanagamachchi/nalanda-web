"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlFilter<T extends string>(
  key: string,
  allowed: readonly T[],
  allValue: T,
) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const raw = params.get(key);
  const current = (allowed as readonly string[]).includes(raw ?? "")
    ? (raw as T)
    : allValue;

  const setCurrent = useCallback(
    (next: T) => {
      const next2 = new URLSearchParams(params.toString());
      if (next === allValue) next2.delete(key);
      else next2.set(key, next);
      const query = next2.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [allValue, key, params, pathname, router],
  );

  return [current, setCurrent] as const;
}