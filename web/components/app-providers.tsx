'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { ClientOnly } from '@/components/client-only'
import { Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface AppProvidersProps {
  readonly children: React.ReactNode
}

interface ErrorFallbackProps {
  readonly error: Error
  readonly resetErrorBoundary: () => void
}

interface LoadingScreenProps {
  readonly message: string
}

// Error fallback component for the therapy platform
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-8 max-w-md">
        <div className="text-xl font-semibold text-destructive">
          Erro na Plataforma
        </div>
        <div className="text-sm text-muted-foreground">
          {error.message || 'Ocorreu um erro inesperado na plataforma de terapia.'}
        </div>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}

// Loading component with better UX for therapy platform
function LoadingScreen({ message }: LoadingScreenProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-lg text-muted-foreground">
          {message}{dots}
        </div>
        <div className="text-sm text-muted-foreground/70">
          Plataforma Therapy Engage
        </div>
      </div>
    </div>
  )
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ClientOnly
        fallback={<LoadingScreen message="Carregando plataforma" />}
      >
        <Suspense fallback={<LoadingScreen message="Inicializando sistemas" />}>
          <TooltipProvider 
            delayDuration={300} 
            skipDelayDuration={200}
            disableHoverableContent={false}
          >
            <ThemeProvider>
              <AuthProvider>
                <Suspense fallback={<LoadingScreen message="Configurando autenticação" />}>
                  {children}
                </Suspense>
              </AuthProvider>
            </ThemeProvider>
          </TooltipProvider>
        </Suspense>
      </ClientOnly>
    </ErrorBoundary>
  )
}
