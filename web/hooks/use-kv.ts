import { useState, useEffect } from 'react';

// Simple key-value store replacement for GitHub Spark's useKV
export function useKv<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from storage:`, error);
    }
  }, [key]);

  // Save to localStorage when value changes
  const updateValue = (newValue: T) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.warn(`Failed to save ${key} to storage:`, error);
    }
  };

  return {
    data: value,
    mutate: updateValue,
    loading
  };
}

// Export both versions for compatibility
export const useKV = useKv;
export default useKv;
