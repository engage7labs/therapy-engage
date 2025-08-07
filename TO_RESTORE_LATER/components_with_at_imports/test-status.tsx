'use client'

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '@/hooks/use-theme'
import { useCache } from '@/hooks/use-cache'
import { usePatients, useSessions, useInsights } from '@/hooks/use-therapy-data'

export function TestStatus() {
  const { user, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { getCacheSize, clearCache } = useCache()
  const { patients, loading: patientsLoading } = usePatients()
  const { sessions, loading: sessionsLoading } = useSessions()
  const { insights, loading: insightsLoading } = useInsights()

  const handleClearCache = () => {
    clearCache()
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg max-w-sm z-50">
      <div className="text-sm space-y-2">
        <div className="font-semibold">Status da Plataforma</div>
        
        <div className="space-y-1">
          <div>Auth: {isAuthenticated ? '✅ Logado' : '❌ Não logado'}</div>
          {user && (
            <div>
              <div>Usuário: {user.name}</div>
              <div>Tipo: {user.role === 'therapist' ? '👨‍⚕️ Terapeuta' : '👤 Paciente'}</div>
            </div>
          )}
          <div>Tema: {theme === 'dark' ? '🌙 Escuro' : '☀️ Claro'}</div>
          <div>Cache: {getCacheSize()} entradas</div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs font-medium mb-1">Dados Carregados:</div>
          <div className="text-xs space-y-1">
            <div>
              Pacientes: {patientsLoading ? '⏳' : `✅ ${patients.length}`}
            </div>
            <div>
              Sessões: {sessionsLoading ? '⏳' : `✅ ${sessions.length}`}
            </div>
            <div>
              Insights: {insightsLoading ? '⏳' : `✅ ${insights.length}`}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <button 
            onClick={toggleTheme}
            className="w-full px-2 py-1 bg-primary text-primary-foreground rounded text-xs"
          >
            Alternar Tema
          </button>
          
          <button 
            onClick={handleClearCache}
            className="w-full px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs"
          >
            Limpar Cache
          </button>
        </div>
      </div>
    </div>
  )
}
