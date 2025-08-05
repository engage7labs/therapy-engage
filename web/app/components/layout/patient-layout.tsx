import { ReactNode } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EnhancedLogoutTooltip } from '@/components/auth/enhanced-logout-tooltip'
import { useAuth } from '../../contexts/auth-context'
import { useTheme } from '../../contexts/theme-context'
import { useLogoutConfirmation } from '../../hooks/use-logout-confirmation'
import { User, Calendar, FileText, Video, Shield } from '@phosphor-icons/react'

interface PatientLayoutProps {
  children: ReactNode
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const { user, logout } = useAuth()
  const { t } = useTheme()
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Patient Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <User size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Portal do Paciente
                </h1>
                <p className="text-sm text-muted-foreground">
                  Therapy Engage Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Badge variant="outline" className="gap-1">
                    <User size={12} />
                    Paciente
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                👨‍🎓
              </div>
              <EnhancedLogoutTooltip 
                onLogoutRequest={requestLogout}
                variant="outline"
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Patient Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Calendar size={16} />
              Minhas Sessões
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <FileText size={16} />
              Consentimentos
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Video size={16} />
              Videochamadas
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Shield size={16} />
              Privacidade
            </Button>
          </div>
        </div>
      </nav>

      {/* Patient Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Patient Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield size={14} />
              Seus dados estão protegidos conforme GDPR/LGPD
            </div>
            <div>
              Therapy Engage Platform © 2025
            </div>
          </div>
        </div>
      </footer>
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog />
    </div>
  )
}