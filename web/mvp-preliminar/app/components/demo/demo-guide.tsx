import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Info,
  Video,
  Brain,
  Shield,
  CheckCircle,
  TestTube,
  AlertTriangle,
  Target
} from 'lucide-react'
import { VideoCallTestSummary } from './video-call-test-summary'

interface DemoGuideProps {
  readonly onStartDemo?: () => void
}

export function DemoGuide({ onStartDemo }: DemoGuideProps) {
  const securityFeatures = [
    {
      icon: <Shield className="h-4 w-4 text-blue-600" />,
      title: "Patient Consent Management",
      description: "GDPR-compliant informed consent with digital signatures and granular permissions",
      count: "Full GDPR compliance"
    },
    {
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      title: "Secure Recording Pipeline", 
      description: "AES-256 encrypted recording with EU data residency and consent validation",
      count: "End-to-end encryption"
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
      title: "Audit Trail & Compliance",
      description: "Complete activity logging with consent tracking and regulatory reporting",
      count: "Full audit trail"
    }
  ]

  const demoSteps = [
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Patient Consent Workflow",
      description: "Experience comprehensive consent forms with GDPR compliance and digital signatures"
    },
    {
      icon: <Video className="h-4 w-4" />,
      title: "Secure Session Recording",
      description: "Test encrypted video recording with real-time consent validation and compliance monitoring"
    },
    {
      icon: <TestTube className="h-4 w-4" />,
      title: "Compliance Dashboard",
      description: "Explore consent management, audit trails, and regulatory compliance reporting"
    },
    {
      icon: <Brain className="h-4 w-4" />,
      title: "AI Analysis with Consent",
      description: "Watch consent-aware AI processing with granular permission controls"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Regulatory Validation",
      description: "Verify GDPR, HIPAA, and LGPD compliance with comprehensive audit documentation"
    }
  ]

  const features = [
    "GDPR-compliant patient consent forms",
    "Digital signatures with legal validation",
    "Granular recording permissions",
    "AES-256 encrypted video recording", 
    "EU data residency compliance",
    "Real-time consent validation",
    "Comprehensive audit trail logging",
    "Patient rights management (access, deletion, portability)",
    "Consent revocation workflows",
    "Regulatory compliance reporting",
    "Automated data retention policies",
    "Clinical justification documentation",
    "Witness support for vulnerable patients",
    "Multi-language consent forms",
    "Consent duration management",
    "Emergency consent protocols"
  ]

  return (
    <div className="space-y-6">
      {/* Demo Introduction */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Secure Therapy Recording Platform</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                GDPR-compliant session recording with comprehensive patient consent management and regulatory compliance
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default">
              <Shield className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary">
              <CheckCircle className="h-3 w-3 mr-1" />
              AES-256 Encrypted
            </Badge>
            <Badge variant="outline">
              <Info className="h-3 w-3 mr-1" />
              EU Data Residency
            </Badge>
            <Badge variant="outline">
              <Brain className="h-3 w-3 mr-1" />
              Consent-Aware AI
            </Badge>
          </div>
          
          {onStartDemo && (
            <Button onClick={onStartDemo} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Start Secure Session Demo
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance Features</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive privacy protection and regulatory compliance for mental health data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{feature.title}</h4>
                    <Badge variant="outline" className="text-xs">{feature.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Security Demo Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {demoSteps.map((step) => (
              <div key={step.title} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Standards */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance Standards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">GDPR Compliance:</span>
              <span className="clinical-data font-medium">Full Article 6 & 9 compliance</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Encryption:</span>
              <span className="clinical-data font-medium">AES-256 end-to-end</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Residency:</span>
              <span className="clinical-data font-medium">EU/Ireland only</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consent Validation:</span>
              <span className="clinical-data font-medium">Real-time verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audit Trail:</span>
              <span className="clinical-data font-medium">Complete activity logging</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Patient Rights:</span>
              <span className="clinical-data font-medium">Access, deletion, portability</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Retention Policy:</span>
              <span className="clinical-data font-medium">Configurable (session to 1 year)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Call Platform Status */}
      <VideoCallTestSummary onStartVideoCall={onStartDemo} />
    </div>
  )
}