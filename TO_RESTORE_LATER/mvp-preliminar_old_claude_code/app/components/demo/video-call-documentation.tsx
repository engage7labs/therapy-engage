import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Video,
  Phone,
  Circle,
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Monitor,
  Users,
  Clock,
  Heart,
  Calendar
} from 'lucide-react'

export function VideoCallDocumentation() {
  const features = [
    {
      icon: <Video className="h-5 w-5 text-blue-500" />,
      title: "HD Video Quality",
      description: "High-definition video calls with adaptive quality based on connection"
    },
    {
      icon: <Circle className="h-5 w-5 text-red-500" />,
      title: "Session Recording",
      description: "Automatic recording of therapy sessions for later review and analysis"
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Real-time AI Insights",
      description: "Live analysis of patient mood, engagement, and risk indicators"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: "HIPAA Compliant",
      description: "End-to-end encryption and medical-grade security protocols"
    },
    {
      icon: <Phone className="h-5 w-5 text-orange-500" />,
      title: "Emergency Calls",
      description: "Priority routing for high-risk patients and crisis situations"
    },
    {
      icon: <Users className="h-5 w-5 text-teal-500" />,
      title: "Multi-participant",
      description: "Support for group therapy sessions and family consultations"
    }
  ]

  const riskLevels = [
    {
      level: "Low Risk",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Regular therapy sessions with stable patients",
      features: ["Standard video quality", "Optional recording", "Scheduled sessions"]
    },
    {
      level: "Moderate Risk",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50", 
      borderColor: "border-yellow-200",
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Patients requiring closer monitoring",
      features: ["Enhanced monitoring", "Automatic recording", "AI mood tracking"]
    },
    {
      level: "High Risk",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200", 
      icon: <Heart className="h-4 w-4" />,
      description: "Crisis intervention and emergency protocols",
      features: ["Priority connection", "Real-time alerts", "Emergency contacts"]
    }
  ]

  const callTypes = [
    {
      type: "Regular Session",
      duration: "45-60 minutes",
      description: "Standard therapy appointments with comprehensive recording and analysis"
    },
    {
      type: "Check-in Call",
      duration: "15-20 minutes",
      description: "Brief wellness checks and medication reviews"
    },
    {
      type: "Emergency Session",
      duration: "Variable",
      description: "Crisis intervention with immediate connection and support"
    },
    {
      type: "Group Therapy",
      duration: "60-90 minutes", 
      description: "Multi-participant sessions with specialized moderation tools"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Video Call Integration</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Professional-grade video therapy platform with AI-powered insights
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">WebRTC Powered</Badge>
            <Badge variant="secondary">HIPAA Compliant</Badge>
            <Badge variant="outline">Browser-based</Badge>
            <Badge variant="outline">No Downloads Required</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive video therapy capabilities designed for mental health professionals
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk-Based Protocols */}
      <Card>
        <CardHeader>
          <CardTitle>Risk-Based Call Protocols</CardTitle>
          <p className="text-sm text-muted-foreground">
            Adaptive features based on patient risk assessment and therapeutic needs
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskLevels.map((risk) => (
              <div key={risk.level} className={`p-4 rounded-lg border ${risk.borderColor} ${risk.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={risk.color}>
                    {risk.icon}
                  </div>
                  <h4 className={`font-medium ${risk.color}`}>{risk.level}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">{risk.description}</p>
                <div className="flex flex-wrap gap-2">
                  {risk.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Types */}
      <Card>
        <CardHeader>
          <CardTitle>Session Types</CardTitle>
          <p className="text-sm text-muted-foreground">
            Flexible call formats to meet diverse therapeutic requirements
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {callTypes.map((session) => (
              <div key={session.type} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{session.type}</h4>
                    <Badge variant="outline" className="text-xs">{session.duration}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Video Quality
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HD 1080p maximum resolution</li>
                <li>• Adaptive bitrate streaming</li>
                <li>• Automatic quality adjustment</li>
                <li>• Low-latency video processing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• End-to-end encryption</li>
                <li>• GDPR/LGPD compliance</li>
                <li>• Secure media recording</li>
                <li>• Access control & authentication</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Integration
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time sentiment analysis</li>
                <li>• Engagement level monitoring</li>
                <li>• Risk indicator detection</li>
                <li>• Automated session insights</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Session Management
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated scheduling</li>
                <li>• Session recordings archive</li>
                <li>• Progress tracking</li>
                <li>• Multi-timezone support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Pre-session Testing</p>
                <p className="text-xs text-muted-foreground">Always test audio/video before patient sessions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Emergency Protocols</p>
                <p className="text-xs text-muted-foreground">Ensure emergency contact information is current for high-risk patients</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Recording Consent</p>
                <p className="text-xs text-muted-foreground">Always obtain explicit consent before recording sessions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Privacy Environment</p>
                <p className="text-xs text-muted-foreground">Conduct calls in private, secure locations with stable internet</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}