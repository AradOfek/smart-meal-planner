import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a rapidly changing value (e.g., search input keystrokes)
 * so side effects (like database GET requests) only execute after typing pauses.
 */
export function useDebounce<T>(value: T, delayMs: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
