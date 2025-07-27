import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debounced callbacks
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced callback function
 */
export const useDebounceCallback = (
  callback: (...args: any[]) => void,
  delay: number,
  deps?: React.DependencyList
) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const debouncedCallback = useMemo(() => {
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    };
  }, [callback, delay, ...(deps || [])]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};

/**
 * Custom hook for search functionality with debouncing
 * @param searchFn - Search function to execute
 * @param delay - Debounce delay in milliseconds
 * @returns Object with search query, setQuery, loading state, and results
 */
export const useDebounceSearch = <T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchFn(debouncedQuery);
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, searchFn]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults: () => setResults([]),
    clearError: () => setError(null)
  };
};
