import { useSyncExternalStore } from "react";

const POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(POINTER_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(POINTER_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export const useFinePointer = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);