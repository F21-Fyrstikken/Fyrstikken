import { useEffect, useState } from "react";

interface IUseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useSanityData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
): IUseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData(): Promise<void> {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          console.error("Error fetching data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}
