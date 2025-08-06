import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Toaster } from '@/components/ui/sonner'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { EnhancedLogoutTooltip } from '@/components/auth/enhanced-logout-tooltip'
import { MiniSessionStatus } from '@/components/dashboard/mini-session-status'
import { CompactSessionStatus } from '@/components/dashboard/compact-session-status'
import { QuickThemeLanguageToggle } from '@/components/settings/quick-theme-language-toggle'
import { useTheme } from '../../contexts/theme-context'
import { useLogoutConfirmation } from '../../hooks/use-logout-confirmation'
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  Brain, 
  Settings, 
  User,
  Video,
  House,
  Play,
  TestTube,
  Shield,
  Clipboard,
  Globe,
  Siren,
  Timer,
  Info
} from 'lucide-react'

interface DashboardLayoutProps {
  readonly children: ReactNode
  readonly therapist: {
    readonly id: string
    readonly name: string
    readonly license: string
    readonly specialization: string
  }
  readonly activeView?: string
  readonly onNavigate?: (view: string) => void
}

export function DashboardLayout({ children, therapist, activeView = 'dashboard', onNavigate }: DashboardLayoutProps) {
  const { t } = useTheme()
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation()
  
  const navigationItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: House },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
    { id: 'tooltip-demo', label: 'Tooltip Demo', icon: Info },
    { id: 'login-tester', label: 'Login System Test', icon: TestTube },
    { id: 'timeout-tester', label: 'Session Timeout Test', icon: Timer },
    { id: 'timeout-guide', label: 'Session Timeout Guide', icon: Info },
    { id: 'secure-sessions', label: 'Secure Recording', icon: Shield },
    { id: 'consent-management', label: 'Consent Manager', icon: Clipboard },
    { id: 'brazilian-consent', label: 'Brasil LGPD 🇧🇷', icon: Shield },
    { id: 'international-consent', label: 'International Consent', icon: Globe },
    { id: 'gdpr-tester', label: 'GDPR Tester', icon: TestTube },
    { id: 'emergency-simulator', label: 'Emergency Simulator', icon: Siren },
    { id: 'video-calls', label: 'Video Calls', icon: Video },
    { id: 'comprehensive-test', label: 'Video Tests', icon: Play },
    { id: 'sessions', label: 'Basic Sessions', icon: Calendar },
    { id: 'patients', label: t('nav.patients'), icon: Users },
    { id: 'insights', label: 'AI Insights', icon: Brain }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                Therapy Engage
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Clinical Platform
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <CompactSessionStatus 
              onOpenAlerts={() => onNavigate?.('dashboard')} />
            
            <MiniSessionStatus 
              onExpand={() => onNavigate?.('dashboard')} />

            {/* Theme and Language Controls */}
            <QuickThemeLanguageToggle />

            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium">{therapist.name}</p>
                <p className="text-xs text-muted-foreground">{therapist.license}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('tooltip.profile')}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator orientation="vertical" className="h-6" />
            
            <EnhancedLogoutTooltip 
              onLogoutRequest={requestLogout}
              variant="ghost"
              size="sm" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r bg-card">
          <div className="p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id
                
                return (
                  <Button 
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => onNavigate?.(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog />
    </div>
  )
}