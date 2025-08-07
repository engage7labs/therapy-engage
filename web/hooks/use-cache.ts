'use client'

import { useCallback, useRef } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  size(): number {
    return this.cache.size
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

// Global cache instance
const globalCache = new MemoryCache()

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    globalCache.cleanup()
  }, 5 * 60 * 1000)
}

export function useCache() {
  const cacheRef = useRef(globalCache)

  const setCache = useCallback(<T>(key: string, data: T, ttl?: number) => {
    cacheRef.current.set(key, data, ttl)
  }, [])

  const getCache = useCallback(<T>(key: string): T | null => {
    return cacheRef.current.get<T>(key)
  }, [])

  const deleteCache = useCallback((key: string) => {
    return cacheRef.current.delete(key)
  }, [])

  const hasCache = useCallback((key: string) => {
    return cacheRef.current.has(key)
  }, [])

  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  const getCacheSize = useCallback(() => {
    return cacheRef.current.size()
  }, [])

  // Memoized cache with automatic caching
  const memoCache = useCallback(async <T>(
    key: string,
    fetcher: () => T | Promise<T>,
    ttl?: number
  ): Promise<T> => {
    try {
      // Check if we have cached data
      const cached = getCache<T>(key)
      if (cached !== null) {
        return cached
      }

      // Fetch new data
      const data = await fetcher()
      setCache(key, data, ttl)
      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }, [getCache, setCache])

  return {
    setCache,
    getCache,
    deleteCache,
    hasCache,
    clearCache,
    getCacheSize,
    memoCache
  }
}

export { globalCache }
export type { CacheEntry }
