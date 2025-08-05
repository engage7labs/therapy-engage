import { useState } from 'react'
import { useKV } from '../hooks/use-kv'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Play, 
  Stop, 
  Clock, 
  User, 
  Warning,
  CheckCircle,
  FirstAid,
  Brain,
  Heart,
  Target,
  TestTube,
  MicrophoneSlash,
  Microphone,
  Camera,
  CameraSlash,
  Phone,
  PhoneSlash,
  Info
} from '@phosphor-icons/react'
import { VideoCallInterface } from './video-call-interface'
import { toast } from 'sonner'

/**
 * Comprehensive Video Call Testing Component
 * 
 * Provides realistic therapy session testing with different patient scenarios,
 * risk levels, and therapeutic challenges to validate platform capabilities.
 */

interface TestPatient {
  id: string
  name: string
  age: number
  diagnosis: string
  scenarioType: string
  riskLevel: 'low' | 'moderate' | 'high'
  moodTrend: 'improving' | 'stable' | 'declining'
  isOnline: boolean
  sessionHistory: SessionRecord[]
  currentChallenges: string[]
  therapeuticGoals: string[]
  expectedBehaviors: string[]
  aiInsightTriggers: string[]
}

interface SessionRecord {
  date: string
  duration: number
  outcome: 'positive' | 'neutral' | 'concerning'
  notes: string
}

interface TestScenario {
  id: string
  name: string
  description: string
  estimatedDuration: number
  complexity: 'simple' | 'moderate' | 'complex'
  validationPoints: string[]
}

interface ActiveTest {
  scenarioId: string
  patientId: string
  startTime: Date
  currentPhase: string
  completedValidations: string[]
  testResults: TestResult[]
}

interface TestResult {
  checkpoint: string
  status: 'pass' | 'fail' | 'pending'
  timestamp: Date
  notes: string
}

export function ComprehensiveVideoTest() {
  const [activeTest, setActiveTest] = useState<ActiveTest | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [testInProgress, setTestInProgress] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)

  // Test session data persistence
  const [testResults, setTestResults] = useKV<TestResult[]>('video-test-results', [])
  const [sessionMetrics, setSessionMetrics] = useKV('session-metrics', {
    totalTests: 0,
    passedTests: 0,
    averageDuration: 0,
    criticalIssues: 0
  })

  // Comprehensive test patients with diverse scenarios
  const testPatients: TestPatient[] = [
    {
      id: 'test-patient-001',
      name: 'Ana Silva (Anxiety Progress)',
      age: 28,
      diagnosis: 'Generalized Anxiety Disorder',
      scenarioType: 'positive-progress',
      riskLevel: 'low',
      moodTrend: 'improving',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-10', duration: 45, outcome: 'positive', notes: 'Great engagement with CBT techniques' },
        { date: '2025-01-12', duration: 50, outcome: 'positive', notes: 'Homework completed, anxiety reduced' }
      ],
      currentChallenges: ['Social anxiety in group settings', 'Public speaking fears'],
      therapeuticGoals: ['Increase confidence', 'Practice exposure therapy', 'Maintain progress'],
      expectedBehaviors: [
        'Active participation and engagement',
        'Demonstrates learned coping strategies',
        'Positive body language and eye contact',
        'Reports symptom improvement'
      ],
      aiInsightTriggers: [
        'Positive sentiment in speech patterns',
        'Decreased anxiety-related vocabulary',
        'Confidence indicators in voice tone',
        'Progress milestone achievements'
      ]
    },
    {
      id: 'test-patient-002',
      name: 'Carlos Santos (Depression Stability)',
      age: 34,
      diagnosis: 'Major Depressive Disorder',
      scenarioType: 'mixed-progress',
      riskLevel: 'moderate',
      moodTrend: 'stable',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-08', duration: 50, outcome: 'neutral', notes: 'Medication adjustment needed' },
        { date: '2025-01-11', duration: 45, outcome: 'positive', notes: 'Better sleep patterns reported' }
      ],
      currentChallenges: ['Medication side effects', 'Work-related stress', 'Social isolation'],
      therapeuticGoals: ['Stabilize mood', 'Improve social connections', 'Address medication concerns'],
      expectedBehaviors: [
        'Initially withdrawn, gradual warming',
        'Reports mixed treatment results',
        'Some resistance to new interventions',
        'Concerns about medication effects'
      ],
      aiInsightTriggers: [
        'Fluctuating emotional patterns',
        'Medication-related discussions',
        'Social isolation indicators',
        'Gradual engagement improvement'
      ]
    },
    {
      id: 'test-patient-003',
      name: 'Maria Oliveira (PTSD Crisis)',
      age: 45,
      diagnosis: 'Post-Traumatic Stress Disorder',
      scenarioType: 'crisis-intervention',
      riskLevel: 'high',
      moodTrend: 'declining',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-09', duration: 60, outcome: 'concerning', notes: 'Increased flashbacks and nightmares' },
        { date: '2025-01-13', duration: 75, outcome: 'concerning', notes: 'Safety plan activated' }
      ],
      currentChallenges: ['Suicidal ideation', 'Severe flashbacks', 'Sleep disturbances', 'Social withdrawal'],
      therapeuticGoals: ['Ensure immediate safety', 'Stabilize symptoms', 'Strengthen support network'],
      expectedBehaviors: [
        'High emotional distress',
        'Difficulty concentrating',
        'Trauma-related triggers',
        'Safety concerns expressed'
      ],
      aiInsightTriggers: [
        'Crisis keywords detection',
        'Emotional distress indicators',
        'Risk assessment triggers',
        'Safety planning requirements'
      ]
    },
    {
      id: 'test-patient-004',
      name: 'João & Teresa (Couples Therapy)',
      age: 42,
      diagnosis: 'Relationship Counseling',
      scenarioType: 'relationship-counseling',
      riskLevel: 'low',
      moodTrend: 'improving',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-07', duration: 60, outcome: 'positive', notes: 'Communication exercises successful' },
        { date: '2025-01-14', duration: 55, outcome: 'positive', notes: 'Conflict resolution progress' }
      ],
      currentChallenges: ['Communication patterns', 'Financial stress', 'Work-life balance'],
      therapeuticGoals: ['Improve communication', 'Resolve conflicts constructively', 'Strengthen bond'],
      expectedBehaviors: [
        'Dual participant interaction',
        'Interruption patterns',
        'Collaborative problem-solving',
        'Emotional synchronization'
      ],
      aiInsightTriggers: [
        'Multiple speaker patterns',
        'Conflict resolution language',
        'Emotional matching between partners',
        'Communication skill improvements'
      ]
    },
    {
      id: 'test-patient-005',
      name: 'Lucas Santos (Teen Behavioral)',
      age: 16,
      diagnosis: 'Conduct Disorder',
      scenarioType: 'teen-behavioral-issues',
      riskLevel: 'moderate',
      moodTrend: 'stable',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-06', duration: 35, outcome: 'neutral', notes: 'Minimal engagement initially' },
        { date: '2025-01-12', duration: 40, outcome: 'positive', notes: 'Opened up about school issues' }
      ],
      currentChallenges: ['School behavioral issues', 'Family conflicts', 'Peer pressure'],
      therapeuticGoals: ['Build rapport', 'Address behavioral concerns', 'Improve family relations'],
      expectedBehaviors: [
        'Initially resistant or withdrawn',
        'Gradual engagement with activities',
        'Age-appropriate responses',
        'Family dynamic discussions'
      ],
      aiInsightTriggers: [
        'Age-specific language patterns',
        'Behavioral change indicators',
        'Family relationship themes',
        'Peer influence discussions'
      ]
    },
    {
      id: 'test-patient-006',
      name: 'Roberto Silva (Addiction Recovery)',
      age: 38,
      diagnosis: 'Substance Use Disorder',
      scenarioType: 'relapse-prevention',
      riskLevel: 'high',
      moodTrend: 'stable',
      isOnline: true,
      sessionHistory: [
        { date: '2025-01-05', duration: 50, outcome: 'concerning', notes: 'Reported increased cravings' },
        { date: '2025-01-10', duration: 60, outcome: 'positive', notes: 'Engaged with support group' }
      ],
      currentChallenges: ['High-stress triggers', 'Workplace pressure', 'Relationship strain'],
      therapeuticGoals: ['Maintain sobriety', 'Strengthen coping strategies', 'Build support network'],
      expectedBehaviors: [
        'Initial defensiveness about struggles',
        'Honesty about cravings and triggers',
        'Commitment to recovery process',
        'Insight development moments'
      ],
      aiInsightTriggers: [
        'Substance-related terminology',
        'Stress and trigger language',
        'Recovery commitment indicators',
        'Support system discussions'
      ]
    }
  ]

  // Test scenarios matching the comprehensive therapy situations
  const testScenarios: TestScenario[] = [
    {
      id: 'positive-progress',
      name: 'Positive Progress Session',
      description: 'Test platform with motivated patient showing consistent improvement',
      estimatedDuration: 45,
      complexity: 'simple',
      validationPoints: [
        'Session starts smoothly within 30 seconds',
        'Audio/video quality remains stable',
        'Patient engagement metrics tracked',
        'Positive sentiment analysis functioning',
        'Progress notes automatically generated'
      ]
    },
    {
      id: 'crisis-intervention',
      name: 'Crisis Intervention Session',
      description: 'High-risk patient requiring immediate safety assessment',
      estimatedDuration: 75,
      complexity: 'complex',
      validationPoints: [
        'Crisis keywords detected and flagged',
        'Emergency protocol activation ready',
        'Extended session time accommodation',
        'Safety plan integration available',
        'Risk assessment tools accessible',
        'Follow-up scheduling triggered'
      ]
    },
    {
      id: 'mixed-progress',
      name: 'Mixed Progress Session',
      description: 'Patient with ambivalent treatment response and resistance',
      estimatedDuration: 50,
      complexity: 'moderate',
      validationPoints: [
        'Resistance patterns identified',
        'Therapeutic alliance assessment',
        'Treatment modification suggestions',
        'Engagement fluctuation tracking',
        'Motivational interviewing prompts'
      ]
    },
    {
      id: 'relationship-counseling',
      name: 'Couples Therapy Session',
      description: 'Multi-participant session with relationship dynamics',
      estimatedDuration: 60,
      complexity: 'moderate',
      validationPoints: [
        'Multiple speaker identification',
        'Interruption pattern analysis',
        'Conflict resolution tracking',
        'Emotional synchronization metrics',
        'Communication skill assessments'
      ]
    },
    {
      id: 'teen-behavioral-issues',
      name: 'Adolescent Therapy Session',
      description: 'Age-specific therapeutic approach with behavioral challenges',
      estimatedDuration: 40,
      complexity: 'moderate',
      validationPoints: [
        'Age-appropriate interaction detection',
        'Behavioral change indicators',
        'Family involvement integration',
        'Shorter session adaptation',
        'Youth-specific assessment tools'
      ]
    },
    {
      id: 'relapse-prevention',
      name: 'Addiction Recovery Session',
      description: 'High-risk session with substance use triggers and recovery focus',
      estimatedDuration: 60,
      complexity: 'complex',
      validationPoints: [
        'Trigger identification and tracking',
        'Sobriety commitment assessment',
        'Support system evaluation',
        'Relapse risk calculation',
        'Recovery milestone tracking'
      ]
    }
  ]

  // Start comprehensive test
  const startComprehensiveTest = () => {
    if (!selectedScenario || !selectedPatient) {
      toast.error('Please select both a test scenario and patient')
      return
    }

    const newTest: ActiveTest = {
      scenarioId: selectedScenario,
      patientId: selectedPatient,
      startTime: new Date(),
      currentPhase: 'initialization',
      completedValidations: [],
      testResults: []
    }

    setActiveTest(newTest)
    setTestInProgress(true)
    setCurrentPhase(0)

    toast.success('Comprehensive video test session started')
  }

  // End test session
  const endTestSession = () => {
    if (activeTest) {
      const duration = Date.now() - activeTest.startTime.getTime()
      const passed = activeTest.completedValidations.length
      const total = testScenarios.find(s => s.id === activeTest.scenarioId)?.validationPoints.length || 0

      // Update metrics
      setSessionMetrics((prev) => ({
        totalTests: prev.totalTests + 1,
        passedTests: prev.passedTests + (passed === total ? 1 : 0),
        averageDuration: Math.round((prev.averageDuration * prev.totalTests + duration) / (prev.totalTests + 1)),
        criticalIssues: prev.criticalIssues + (passed < total * 0.7 ? 1 : 0)
      }))

      toast.success(`Test completed: ${passed}/${total} validations passed`)
    }

    setActiveTest(null)
    setTestInProgress(false)
    setCurrentPhase(0)
  }

  // Simulate test progression
  const progressTest = () => {
    if (!activeTest) return

    const scenario = testScenarios.find(s => s.id === activeTest.scenarioId)
    if (!scenario) return

    const nextValidation = scenario.validationPoints[currentPhase]
    if (nextValidation) {
      setActiveTest(prev => prev ? {
        ...prev,
        completedValidations: [...prev.completedValidations, nextValidation],
        testResults: [...prev.testResults, {
          checkpoint: nextValidation,
          status: 'pass',
          timestamp: new Date(),
          notes: 'Automated validation successful'
        }]
      } : null)

      setCurrentPhase(prev => prev + 1)
      toast.success(`Validation passed: ${nextValidation}`)
    }
  }

  // Get scenario by ID
  const getScenario = (id: string) => testScenarios.find(s => s.id === id)
  const getPatient = (id: string) => testPatients.find(p => p.id === id)

  // If test is active, show test interface
  if (testInProgress && activeTest) {
    const scenario = getScenario(activeTest.scenarioId)
    const patient = getPatient(activeTest.patientId)
    
    return (
      <div className="space-y-6">
        {/* Test Header */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Active Test: {scenario?.name}
              </h2>
              <p className="text-muted-foreground">Testing with: {patient?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={progressTest} variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Validation
              </Button>
              <Button onClick={endTestSession} variant="destructive" size="sm">
                <Stop className="h-4 w-4 mr-2" />
                End Test
              </Button>
            </div>
          </div>

          {/* Progress Tracker */}
          {scenario && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Test Progress</span>
                <span>{activeTest.completedValidations.length}/{scenario.validationPoints.length}</span>
              </div>
              <Progress 
                value={(activeTest.completedValidations.length / scenario.validationPoints.length) * 100} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {/* Video Call Interface */}
        <VideoCallInterface
          sessionId={`test-${activeTest.scenarioId}-${Date.now()}`}
          patientId={activeTest.patientId}
          patientName={patient?.name || 'Test Patient'}
          onEndCall={endTestSession}
          testMode={true}
          testScenario={scenario?.name}
        />

        {/* Real-time Validation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenario?.validationPoints.map((point, index) => {
                const isCompleted = activeTest.completedValidations.includes(point)
                const isCurrent = index === currentPhase
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isCompleted ? 'bg-green-50 border border-green-200' :
                      isCurrent ? 'bg-blue-50 border border-blue-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className={isCompleted ? 'text-green-800' : isCurrent ? 'text-blue-800' : 'text-gray-600'}>
                      {point}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <TestTube className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Comprehensive Video Call Testing</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Test the platform's video call capabilities with realistic therapy scenarios across different 
          patient types, risk levels, and therapeutic challenges to ensure robust clinical performance.
        </p>
      </div>

      {/* Test Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TestTube className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sessionMetrics.totalTests}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sessionMetrics.passedTests}</p>
                <p className="text-sm text-muted-foreground">Passed Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(sessionMetrics.averageDuration / 60000)}m</p>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Warning className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sessionMetrics.criticalIssues}</p>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Configuration */}
      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="patients">Test Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testScenarios.map((scenario) => (
              <Card 
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  selectedScenario === scenario.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    <Badge variant={
                      scenario.complexity === 'complex' ? 'destructive' :
                      scenario.complexity === 'moderate' ? 'secondary' : 'default'
                    }>
                      {scenario.complexity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{scenario.estimatedDuration} min</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Validations:</span>
                    <div className="mt-1 space-y-1">
                      {scenario.validationPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{point}</span>
                        </div>
                      ))}
                      {scenario.validationPoints.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{scenario.validationPoints.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {testPatients.map((patient) => (
              <Card 
                key={patient.id}
                className={`cursor-pointer transition-all ${
                  selectedPatient === patient.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPatient(patient.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        patient.riskLevel === 'high' ? 'destructive' :
                        patient.riskLevel === 'moderate' ? 'secondary' : 'default'
                      }>
                        {patient.riskLevel} risk
                      </Badge>
                      {patient.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {patient.age} years • {patient.diagnosis}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Scenario Type:</span>
                    <div className="font-medium">{patient.scenarioType.replace('-', ' ')}</div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Current Challenges:</span>
                    <div className="mt-1 space-y-1">
                      {patient.currentChallenges.slice(0, 2).map((challenge, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Expected Behaviors:</span>
                    <div className="mt-1 space-y-1">
                      {patient.expectedBehaviors.slice(0, 2).map((behavior, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{behavior}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Heart className={`h-3 w-3 ${
                        patient.moodTrend === 'improving' ? 'text-green-500' :
                        patient.moodTrend === 'stable' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      <span className="text-xs">{patient.moodTrend}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {patient.sessionHistory.length} sessions
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Start Test Button */}
      <div className="flex justify-center">
        <Button 
          onClick={startComprehensiveTest}
          disabled={!selectedScenario || !selectedPatient}
          size="lg"
          className="px-8"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Comprehensive Test
        </Button>
      </div>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Before Starting:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Select a test scenario that matches your validation goals</li>
                <li>• Choose a patient profile with appropriate risk level</li>
                <li>• Ensure microphone and camera permissions are granted</li>
                <li>• Review expected behaviors and validation points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">During Testing:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Monitor real-time validation checklist</li>
                <li>• Use "Mark Validation" for completed checkpoints</li>
                <li>• Test different audio/video scenarios</li>
                <li>• Observe AI insight generation and accuracy</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}