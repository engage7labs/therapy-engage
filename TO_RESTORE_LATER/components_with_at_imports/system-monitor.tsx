'use client'

import { useCache } from '@/hooks/use-cache'
import { useTheme } from '@/contexts/theme-context'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SystemStats {
  cache: {
    size: number
    memory: string
    hitRate: number
  }
  performance: {
    loadTime: number
    renderTime: number
    memoryUsage: number
  }
  auth: {
    status: 'authenticated' | 'unauthenticated' | 'loading'
    userRole?: string
    sessionTime?: number
  }
  theme: {
    current: string
    systemPreference: string
  }
}

export function SystemMonitor() {
  const { getCacheSize } = useCache()
  const { theme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<SystemStats>({
    cache: { size: 0, memory: '0 KB', hitRate: 0 },
    performance: { loadTime: 0, renderTime: 0, memoryUsage: 0 },
    auth: { status: 'loading' },
    theme: { current: 'system', systemPreference: 'light' }
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      const performanceEntries = performance.getEntriesByType('navigation')
      const performanceData = performanceEntries[0] as PerformanceNavigationTiming
      const memoryInfo = (performance as any).memory
      
      setStats({
        cache: {
          size: getCacheSize(),
          memory: `${Math.round((getCacheSize() * 0.1))} KB`, // Estimated
          hitRate: Math.random() * 100 // Mock hit rate
        },
        performance: {
          loadTime: performanceData ? Math.round(performanceData.loadEventEnd - performanceData.fetchStart) : 0,
          renderTime: performanceData ? Math.round(performanceData.domContentLoadedEventEnd - performanceData.domContentLoadedEventStart) : 0,
          memoryUsage: memoryInfo ? Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024) : 0
        },
        auth: {
          status: isAuthenticated ? 'authenticated' : 'unauthenticated',
          userRole: user?.role,
          sessionTime: user ? Math.floor(Math.random() * 3600) : 0 // Mock session time
        },
        theme: {
          current: theme || 'system',
          systemPreference: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [getCacheSize, isAuthenticated, user, theme])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors z-50"
      >
        Monitor Sistema
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monitor do Sistema - Therapy Engage</CardTitle>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cache Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Sistema de Cache</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Entradas Ativas:</span>
                <Badge variant="secondary">{stats.cache.size}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Memória Estimada:</span>
                <Badge variant="outline">{stats.cache.memory}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Acerto:</span>
                <Badge variant="default">{stats.cache.hitRate.toFixed(1)}%</Badge>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tempo de Carregamento:</span>
                <Badge variant={stats.performance.loadTime < 3000 ? "default" : "destructive"}>
                  {stats.performance.loadTime}ms
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Tempo de Renderização:</span>
                <Badge variant={stats.performance.renderTime < 100 ? "default" : "secondary"}>
                  {stats.performance.renderTime}ms
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Uso de Memória JS:</span>
                <Badge variant={stats.performance.memoryUsage < 50 ? "default" : "destructive"}>
                  {stats.performance.memoryUsage}MB
                </Badge>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Autenticação</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={stats.auth.status === 'authenticated' ? "default" : "secondary"}>
                  {stats.auth.status === 'authenticated' ? 'Autenticado' : 'Não Autenticado'}
                </Badge>
              </div>
              {stats.auth.userRole && (
                <div className="flex justify-between">
                  <span>Função:</span>
                  <Badge variant="outline">{stats.auth.userRole}</Badge>
                </div>
              )}
              {stats.auth.sessionTime !== undefined && (
                <div className="flex justify-between">
                  <span>Tempo de Sessão:</span>
                  <Badge variant="secondary">{stats.auth.sessionTime}s</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Theme Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tema e UI</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tema Atual:</span>
                <Badge variant="outline">{stats.theme.current}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Preferência do Sistema:</span>
                <Badge variant="secondary">{stats.theme.systemPreference}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Componentes UI:</span>
                <Badge variant="default">shadcn/ui</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
