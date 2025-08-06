import { useKV } from '@/hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Brain, 
  Download, 
  Share, 
  AlertTriangle,
  TrendUp,
  Clock,
  User
} from 'lucide-react'

interface SessionInsightsProps {
  sessionId: string
}

export function SessionInsights({ sessionId }: SessionInsightsProps) {
  const [sessionData] = useKV(`session-${sessionId}`, null)
  const [insights] = useKV(`insights-${sessionId}`, {
    transcript: {
      content: `Dr. Deleta: Good afternoon, Ana. How have you been feeling since our last session?

Ana Silva: Hello, Dr. Deleta. I've been doing better actually. The breathing exercises you taught me have been really helpful when I feel the anxiety starting.

Dr. Deleta: That's wonderful to hear. Can you tell me more about when you've been using them?

Ana Silva: Mostly at work when I have those presentation meetings. Before, I would just avoid them or make excuses, but last week I actually volunteered to present our quarterly results.

Dr. Deleta: That's a significant step forward. How did that feel?

Ana Silva: Scary at first, but I used the 4-7-8 breathing technique right before, and I felt much more in control. I even got positive feedback from my manager.

Dr. Deleta: I can see how proud you are of that accomplishment. This shows real progress in managing your anxiety symptoms. Have you noticed any other changes?

Ana Silva: Yes, I'm sleeping better too. The racing thoughts at night have decreased significantly.

Dr. Deleta: These are all very positive developments. Let's explore what other strategies we can build on for continued progress...`,
      duration: "45 minutes",
      wordCount: 2847,
      speakerRatio: "Therapist: 42% | Patient: 58%"
    },
    aiAnalysis: {
      keyThemes: [
        "Anxiety management progress",
        "Workplace presentation confidence",
        "Sleep quality improvement", 
        "Behavioral activation success"
      ],
      emotionalState: {
        baseline: "Anxious but motivated",
        progression: "Increasingly confident throughout session",
        riskLevel: "Low"
      },
      therapeuticGoals: [
        "Continue breathing exercise practice",
        "Expand presentation opportunities",
        "Maintain sleep hygiene improvements",
        "Introduce cognitive restructuring for remaining anxious thoughts"
      ],
      clinicalRecommendations: [
        "Schedule follow-up in 2 weeks to maintain momentum",
        "Assign homework: Practice presentation skills with trusted friend",
        "Consider introducing exposure therapy for larger speaking opportunities",
        "Monitor sleep patterns with simple tracking"
      ],
      riskAssessment: {
        level: "Low",
        factors: "No concerning indicators. Patient shows excellent engagement and progress.",
        followUpNeeded: false
      },
      progressMarkers: [
        "Voluntary presentation participation (breakthrough behavior)",
        "Consistent use of coping strategies",
        "Improved sleep quality",
        "Increased self-efficacy in workplace situations"
      ]
    },
    confidence: 0.89,
    generatedAt: new Date().toISOString(),
    reviewedBy: null,
    clinicalApproval: "pending"
  })

  if (!sessionData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">No session data available</p>
        </CardContent>
      </Card>
    )
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'default'
      case 'moderate': return 'outline' 
      case 'high': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Session Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="clinical-data">
                Confidence: {Math.round((insights.confidence || 0) * 100)}%
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground clinical-data">
                  {insights.transcript?.duration || '0 minutes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Word Count</p>
                <p className="text-sm text-muted-foreground clinical-data">
                  {insights.transcript?.wordCount?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Speaking Ratio</p>
                <p className="text-sm text-muted-foreground clinical-data">
                  {insights.transcript?.speakerRatio || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Risk Level</p>
                <Badge variant={getRiskBadgeVariant(insights.aiAnalysis?.riskAssessment?.level || 'unknown')}>
                  {insights.aiAnalysis?.riskAssessment?.level || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Session Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full rounded-md border p-4">
            <div className="space-y-4">
              {insights.transcript?.content?.split('\n\n').map((paragraph, index) => (
                <div key={index} className="text-sm">
                  {paragraph.split(': ').length > 1 ? (
                    <div>
                      <span className="font-medium text-primary">
                        {paragraph.split(': ')[0]}:
                      </span>
                      <span className="ml-2">
                        {paragraph.split(': ').slice(1).join(': ')}
                      </span>
                    </div>
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Clinical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Clinical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Themes */}
          <div>
            <h4 className="font-medium mb-3">Key Therapeutic Themes</h4>
            <div className="flex flex-wrap gap-2">
              {insights.aiAnalysis?.keyThemes?.map((theme, index) => (
                <Badge key={index} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Emotional State Assessment */}
          <div>
            <h4 className="font-medium mb-3">Emotional State Assessment</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Baseline</p>
                <p className="text-sm">{insights.aiAnalysis?.emotionalState?.baseline}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Progression</p>
                <p className="text-sm">{insights.aiAnalysis?.emotionalState?.progression}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                <Badge variant={getRiskBadgeVariant(insights.aiAnalysis?.emotionalState?.riskLevel || 'unknown')}>
                  {insights.aiAnalysis?.emotionalState?.riskLevel}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progress Markers */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Progress Markers
            </h4>
            <ul className="space-y-2">
              {insights.aiAnalysis?.progressMarkers?.map((marker, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  {marker}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Therapeutic Goals */}
          <div>
            <h4 className="font-medium mb-3">Therapeutic Goals</h4>
            <ul className="space-y-2">
              {insights.aiAnalysis?.therapeuticGoals?.map((goal, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Clinical Recommendations */}
          <div>
            <h4 className="font-medium mb-3">Clinical Recommendations</h4>
            <ul className="space-y-2">
              {insights.aiAnalysis?.clinicalRecommendations?.map((recommendation, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Risk Assessment Detail */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </h4>
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Level:</span>
                <Badge variant={getRiskBadgeVariant(insights.aiAnalysis?.riskAssessment?.level || 'unknown')}>
                  {insights.aiAnalysis?.riskAssessment?.level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {insights.aiAnalysis?.riskAssessment?.factors}
              </p>
              {insights.aiAnalysis?.riskAssessment?.followUpNeeded && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Immediate follow-up recommended</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Approval */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Review Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Awaiting Clinical Review</p>
              <p className="text-sm text-muted-foreground">
                AI analysis requires licensed therapist approval before clinical use
              </p>
            </div>
            <Button>
              <Share className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}