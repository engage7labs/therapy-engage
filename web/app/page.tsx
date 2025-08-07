'use client'

import { useCache } from '@/hooks/use-cache'
import { SystemMonitor } from '@/components/system-monitor'
import { TherapyDashboard } from '@/components/therapy-dashboard'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { getCacheSize, setCache, getCache } = useCache()
  const [cacheInfo, setCacheInfo] = useState({ size: 0, testData: null })
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    // Test cache functionality
    const testKey = 'homepage-test'
    const testValue = `Cache test at ${new Date().toISOString()}`
    
    setCache(testKey, testValue, 30000) // 30 seconds TTL
    
    setCacheInfo({
      size: getCacheSize(),
      testData: getCache(testKey)
    })
  }, [setCache, getCache, getCacheSize])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Therapy Engage Platform
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Sistema de terapia online em desenvolvimento
        </p>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Status do Sistema</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cache Status:</span>
                <span className="text-green-600">✓ Ativo</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Size:</span>
                <span>{cacheInfo.size} entradas</span>
              </div>
              <div className="flex justify-between">
                <span>TypeScript:</span>
                <span className="text-green-600">✓ Configurado</span>
              </div>
              <div className="flex justify-between">
                <span>Tailwind CSS:</span>
                <span className="text-green-600">✓ Ativo</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Next.js 14:</span>
                <span className="text-green-600">✓ Rodando</span>
              </div>
              <div className="flex justify-between">
                <span>Error Boundary:</span>
                <span className="text-green-600">✓ Implementado</span>
              </div>
              <div className="flex justify-between">
                <span>Performance:</span>
                <span className="text-green-600">✓ Monitorado</span>
              </div>
              <div className="flex justify-between">
                <span>Auth System:</span>
                <span className="text-orange-600">⚡ Pronto</span>
              </div>
            </div>
          </div>

          {cacheInfo.testData && (
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Teste de Cache: {cacheInfo.testData}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => window.location.href = '/login'}
          >
            Login Portal
          </button>
          <button 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => window.location.href = '/dashboard'}
          >
            Dashboard
          </button>
          <button 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setShowDashboard(!showDashboard)}
          >
            {showDashboard ? 'Ocultar' : 'Demo'} Dashboard
          </button>
        </div>
      </div>

      {/* Dashboard Demo Area */}
      {showDashboard && (
        <div className="mt-8">
          <TherapyDashboard />
        </div>
      )}
      
      <SystemMonitor />
    </div>
  )
}