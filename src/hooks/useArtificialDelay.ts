import { useEffect, useState } from 'react';

/**
 * Returns true for `ms` milliseconds after first render, then false.
 * Use to simulate a hydration / load delay so skeleton states surface.
 */
export function useArtificialDelay(ms = 800) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
