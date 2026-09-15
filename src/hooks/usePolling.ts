import { useEffect, useRef, useState } from "react";

export function usePolling<T>(fn: () => Promise<T>, delayMs: number, enabled = true): [T | null, Error | null] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const result = await fn();
        if (mounted.current) { setData(result); setError(null); }
      } catch (e) {
        if (mounted.current) setError(e instanceof Error ? e : new Error(String(e)));
      }
      if (mounted.current) timer = setTimeout(poll, delayMs);
    };
    poll();

    return () => { mounted.current = false; clearTimeout(timer); };
  }, [fn, delayMs, enabled]);

  return [data, error];
}
