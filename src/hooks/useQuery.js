import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook for Neon query functions.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useQuery(getDisplayPages);
 *   const { data } = useQuery(getTargetingValues, keyId);  // pass args after the fn
 *
 * @param {Function} queryFn  - one of the exported functions from src/db/queries/
 * @param  {...any}  args     - arguments forwarded to queryFn
 */
export function useQuery(queryFn, ...args) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await queryFn(...args);
      setData(rows);
    } catch (err) {
      console.error('[useQuery]', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [queryFn, JSON.stringify(args)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
