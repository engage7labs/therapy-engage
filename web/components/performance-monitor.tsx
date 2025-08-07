'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  connectionLatency: number
  renderTime: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now()
    
    // Get memory usage if available
    const getMemoryUsage = () => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize / 1024 / 1024 // MB
      }
      return 0
    }

    // Simulate connection latency check
    const measureLatency = async () => {
      const start = performance.now()
      try {
        // Ping a lightweight endpoint
        await fetch('/api/ping').catch(() => {})
        return performance.now() - start
      } catch {
        return 0
      }
    }

    // Measure render time
    const renderStart = performance.now()
    
    setTimeout(async () => {
      const latency = await measureLatency()
      const renderTime = performance.now() - renderStart
      
      setMetrics({
        loadTime: Math.round(loadTime),
        memoryUsage: Math.round(getMemoryUsage() * 100) / 100,
        connectionLatency: Math.round(latency),
        renderTime: Math.round(renderTime)
      })
    }, 100)

    // Show on development mode
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible || !metrics) return null

  const getPerformanceStatus = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      loadTime: { good: 1000, fair: 3000 },
      memoryUsage: { good: 50, fair: 100 },
      connectionLatency: { good: 100, fair: 500 },
      renderTime: { good: 100, fair: 300 }
    }
    
    const threshold = thresholds[metric]
    if (value <= threshold.good) return '🟢'
    if (value <= threshold.fair) return '🟡'
    return '🔴'
  }

  return (
    <div className="fixed top-4 right-4 p-3 bg-background/95 backdrop-blur border rounded-lg shadow-lg text-xs z-50 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Performance</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span>
            {getPerformanceStatus('loadTime', metrics.loadTime)} {metrics.loadTime}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Memory:</span>
          <span>
            {getPerformanceStatus('memoryUsage', metrics.memoryUsage)} {metrics.memoryUsage}MB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Latency:</span>
          <span>
            {getPerformanceStatus('connectionLatency', metrics.connectionLatency)} {metrics.connectionLatency}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Render:</span>
          <span>
            {getPerformanceStatus('renderTime', metrics.renderTime)} {metrics.renderTime}ms
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t text-[10px] text-muted-foreground">
        🟢 Excelente | 🟡 Bom | 🔴 Precisa otimizar
      </div>
    </div>
  )
}
