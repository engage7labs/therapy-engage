import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmergencyContactManager } from './emergency-contact-manager'
import { 
  Plus,
  Calendar,
  FileText,
  Phone,
  VideoCamera,
  Users,
  Play,
  TestTube,
  Shield,
  ClipboardText,
  Globe,
  Siren,
  MessageCircle
} from 'lucide-react'

interface QuickActionsProps {
  onNavigate?: (view: string) => void
  patients?: any[] // Add patients prop for emergency contact manager
}

export function QuickActions({ onNavigate, patients = [] }: QuickActionsProps) {
  const quickActions = [
    {
      icon: <Shield className="h-4 w-4" />,
      label: 'Secure Session Recording',
      description: 'GDPR compliant recording with consent',
      action: () => onNavigate?.('secure-sessions'),
      variant: 'default' as const
    },
    {
      icon: <Clipboard className="h-4 w-4" />,
      label: 'Consent Management',
      description: 'View and manage patient consents',
      action: () => onNavigate?.('consent-management'),
      variant: 'secondary' as const
    },
    {
      icon: <Globe className="h-4 w-4" />,
      label: 'International Consent Testing',
      description: 'Multi-language consent workflows',
      action: () => onNavigate?.('international-consent'),
      variant: 'default' as const
    },
    {
      icon: <TestTube className="h-4 w-4" />,
      label: 'GDPR Consent Tester',
      description: 'Test digital consent workflows',
      action: () => onNavigate?.('gdpr-tester'),
      variant: 'outline' as const
    },
    {
      icon: <Video className="h-4 w-4" />,
      label: 'Start Video Call',
      description: 'Connect with patients via video',
      action: () => onNavigate?.('video-calls'),
      variant: 'outline' as const
    },
    {
      icon: <Play className="h-4 w-4" />,
      label: 'Video Test Scenarios',
      description: 'Comprehensive therapy session testing',
      action: () => onNavigate?.('comprehensive-test'),
      variant: 'outline' as const
    },
    {
      icon: <Siren className="h-4 w-4" />,
      label: 'Emergency Alert Simulator',
      description: 'Test critical patient alert system',
      action: () => onNavigate?.('emergency-simulator'),
      variant: 'destructive' as const
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: 'Emergency Call',
      description: 'Immediate consultation',
      action: () => onNavigate?.('video-calls'),
      variant: 'destructive' as const
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Emergency Contact Manager */}
        <EmergencyContactManager 
          patients={patients}
          onPatientUpdate={(patientId, updates) => {
            console.log('Patient updated:', patientId, updates)
            // In real app, this would update the patient data
          }}
        />
        
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto p-3"
            onClick={action.action}
          >
            <div className="flex items-center space-x-3">
              {action.icon}
              <div className="text-left">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}