import { useCallback, useEffect, useId, useRef, type ChangeEvent, type RefObject } from "react";

const WAIT = 300;

export function useToolbarSearch(search: string, onSearchChange?: (v: string) => void) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const t = useRef<number | null>(null);
  const cb = useRef(onSearchChange);
  useEffect(() => { cb.current = onSearchChange }, [onSearchChange]);
  useSearchInputSync(ref, search);
  const clear = useCallback(function clear() {
    if (t.current === null) return;
    window.clearTimeout(t.current);
    t.current = null;
  }, []);
  useEffect(() => clear, [clear]);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    clear();
    t.current = window.setTimeout(() => {
      t.current = null;
      if (next !== search) cb.current?.(next);
    }, WAIT);
  }, [clear, search]);

  return { id, ref, onChange };
}

function useSearchInputSync(ref: RefObject<HTMLInputElement | null>, search: string) {
  useEffect(() => {
    const input = ref.current;
    if (!input || document.activeElement === input || input.value === search) return;
    input.value = search;
  }, [ref, search]);
}
