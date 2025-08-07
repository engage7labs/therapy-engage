'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook for localStorage-based key-value persistence
 * Compatible replacement for GitHub Spark's useKV hook
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize value from localStorage on mount (SSG-safe)
  useEffect(() => {
    // ###desabilitado_mvp### Check if we're in browser environment
    if (typeof window === 'undefined') {
      setIsInitialized(true)
      return
    }
    
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setValue(JSON.parse(stored))
      }
    } catch (error) {
      console.warn(`Failed to load value for key "${key}":`, error)
    } finally {
      setIsInitialized(true)
    }
  }, [key])

  // Update localStorage when value changes (SSG-safe)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.warn(`Failed to save value for key "${key}":`, error)
      }
    }
  }, [key, value, isInitialized])

  const updateValue = (newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue
      return nextValue
    })
  }

  const deleteValue = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
        setValue(defaultValue)
      } catch (error) {
        console.warn(`Failed to delete value for key "${key}":`, error)
      }
    } else {
      setValue(defaultValue)
    }
  }

  return [value, updateValue, deleteValue]
}