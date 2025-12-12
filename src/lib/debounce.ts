import { useRef, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function debouncedFunction(...args: Parameters<T>) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFunction;
}
