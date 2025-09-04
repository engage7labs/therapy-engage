'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  CheckCircle,
  Clock,
  User,
  Video,
  FileText,
  Settings,
  Eye,
  Download,
  Monitor,
  Smartphone,
  Users,
  Shield,
  Award
} from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  category: 'setup' | 'therapist' | 'patient' | 'admin' | 'evaluation'
  duration: number
  status: 'pending' | 'active' | 'completed' | 'skipped'
  requirements?: string[]
  actions: string[]
  expectedOutcome: string
}

interface DemoScenario {
  id: string
  name: string
  description: string
  duration: number
  participants: string[]
  steps: string[]
  isActive: boolean
}

export default function CompleteDemoWorkflow() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [, setActiveScenario] = useState<string | null>(null)
  const [demoProgress, setDemoProgress] = useState(0)

  const demoSteps: DemoStep[] = [
    // Setup Phase
    {
      id: 'setup-1',
      title: 'Platform Initialization',
      description: 'Initialize the therapy platform with demo data and configurations',
      category: 'setup',
      duration: 2,
      status: 'pending',
      requirements: ['Demo data generated', 'Environment configured'],
      actions: [
        'Load demo database',
        'Configure user accounts',
        'Set up session environments',
        'Verify system connectivity'
      ],
      expectedOutcome: 'Platform ready with realistic demo data and user accounts'
    },
    {
      id: 'setup-2',
      title: 'User Account Setup',
      description: 'Demonstrate user account creation and role assignment',
      category: 'setup',
      duration: 3,
      status: 'pending',
      actions: [
        'Create therapist accounts',
        'Set up patient profiles',
        'Configure access permissions',
        'Validate authentication flow'
      ],
      expectedOutcome: 'All user roles properly configured and accessible'
    },

    // Therapist Workflow
    {
      id: 'therapist-1',
      title: 'Therapist Login & Dashboard',
      description: 'Showcase therapist login process and main dashboard overview',
      category: 'therapist',
      duration: 4,
      status: 'pending',
      actions: [
        'Demonstrate secure login',
        'Navigate to therapist dashboard',
        'Review daily schedule',
        'Check patient notifications',
        'Access quick actions menu'
      ],
      expectedOutcome: 'Therapist can efficiently access and navigate their workspace'
    },
    {
      id: 'therapist-2',
      title: 'Session Scheduling',
      description: 'Demonstrate the appointment scheduling and management system',
      category: 'therapist',
      duration: 5,
      status: 'pending',
      actions: [
        'Open calendar interface',
        'Schedule new appointment',
        'Modify existing session',
        'Set recurring sessions',
        'Send patient notifications'
      ],
      expectedOutcome: 'Comprehensive session scheduling capabilities demonstrated'
    },
    {
      id: 'therapist-3',
      title: 'Patient Management',
      description: 'Show patient profile management and clinical documentation',
      category: 'therapist',
      duration: 6,
      status: 'pending',
      actions: [
        'Access patient profiles',
        'Review treatment history',
        'Update clinical notes',
        'Track progress metrics',
        'Generate treatment plans'
      ],
      expectedOutcome: 'Robust patient management and documentation system showcased'
    },
    {
      id: 'therapist-4',
      title: 'Video Session Conduct',
      description: 'Conduct a live therapy session with video recording capabilities',
      category: 'therapist',
      duration: 8,
      status: 'pending',
      actions: [
        'Initiate video session',
        'Use session tools (notes, timer)',
        'Record session segments',
        'Manage session flow',
        'Complete session documentation'
      ],
      expectedOutcome: 'Complete video therapy session workflow demonstrated'
    },

    // Patient Experience
    {
      id: 'patient-1',
      title: 'Patient Portal Access',
      description: 'Demonstrate patient login and portal navigation',
      category: 'patient',
      duration: 3,
      status: 'pending',
      actions: [
        'Patient login process',
        'Navigate patient dashboard',
        'View upcoming appointments',
        'Access personal resources',
        'Update profile information'
      ],
      expectedOutcome: 'Patient can easily access and use their portal'
    },
    {
      id: 'patient-2',
      title: 'Session Participation',
      description: 'Show patient joining and participating in therapy sessions',
      category: 'patient',
      duration: 6,
      status: 'pending',
      actions: [
        'Join scheduled session',
        'Test audio/video connectivity',
        'Use session features',
        'Complete session feedback',
        'Access session recordings'
      ],
      expectedOutcome: 'Seamless patient session participation experience'
    },
    {
      id: 'patient-3',
      title: 'Progress Tracking',
      description: 'Demonstrate patient progress visualization and self-assessment tools',
      category: 'patient',
      duration: 4,
      status: 'pending',
      actions: [
        'View progress dashboard',
        'Complete self-assessments',
        'Track mood and wellness',
        'Review treatment milestones',
        'Access educational resources'
      ],
      expectedOutcome: 'Comprehensive patient progress tracking and engagement tools'
    },

    // Administrative Features
    {
      id: 'admin-1',
      title: 'System Administration',
      description: 'Showcase administrative controls and system management',
      category: 'admin',
      duration: 5,
      status: 'pending',
      actions: [
        'Access admin dashboard',
        'Manage user accounts',
        'Configure system settings',
        'Review security logs',
        'Generate compliance reports'
      ],
      expectedOutcome: 'Comprehensive administrative capabilities demonstrated'
    },
    {
      id: 'admin-2',
      title: 'Analytics & Reporting',
      description: 'Display platform analytics and reporting capabilities',
      category: 'admin',
      duration: 4,
      status: 'pending',
      actions: [
        'View platform analytics',
        'Generate usage reports',
        'Analyze session metrics',
        'Export data summaries',
        'Configure automated reports'
      ],
      expectedOutcome: 'Robust analytics and reporting system showcased'
    },

    // Evaluation Phase
    {
      id: 'evaluation-1',
      title: 'Academic Assessment',
      description: 'Demonstrate academic evaluation tools and grading framework',
      category: 'evaluation',
      duration: 6,
      status: 'pending',
      actions: [
        'Access evaluation dashboard',
        'Review assessment criteria',
        'Generate evaluation reports',
        'Export academic documentation',
        'Validate compliance metrics'
      ],
      expectedOutcome: 'Complete academic evaluation framework demonstrated'
    }
  ]

  const demoScenarios: DemoScenario[] = [
    {
      id: 'quick-overview',
      name: 'Quick Platform Overview',
      description: 'Brief 15-minute demonstration of core platform features',
      duration: 15,
      participants: ['Therapist', 'Patient'],
      steps: ['setup-1', 'therapist-1', 'patient-1', 'therapist-4'],
      isActive: false
    },
    {
      id: 'complete-workflow',
      name: 'Complete Therapy Workflow',
      description: 'Comprehensive demonstration of full therapy session lifecycle',
      duration: 45,
      participants: ['Therapist', 'Patient', 'Administrator'],
      steps: ['setup-1', 'setup-2', 'therapist-1', 'therapist-2', 'therapist-3', 'patient-1', 'patient-2', 'therapist-4', 'patient-3'],
      isActive: false
    },
    {
      id: 'academic-evaluation',
      name: 'Academic Evaluation Demo',
      description: 'Full academic assessment workflow for university evaluation',
      duration: 60,
      participants: ['Evaluator', 'Therapist', 'Patient', 'Administrator'],
      steps: demoSteps.map(step => step.id),
      isActive: false
    },
    {
      id: 'technical-deep-dive',
      name: 'Technical Architecture Review',
      description: 'In-depth technical demonstration for development teams',
      duration: 30,
      participants: ['Developer', 'Architect'],
      steps: ['setup-1', 'therapist-1', 'therapist-4', 'admin-1', 'admin-2', 'evaluation-1'],
      isActive: false
    }
  ]

  const [steps, setSteps] = useState<DemoStep[]>(demoSteps)
  const [scenarios] = useState<DemoScenario[]>(demoScenarios)

  const startDemo = (scenarioId?: string) => {
    setIsRunning(true)
    setCurrentStep(0)
    setDemoProgress(0)
    setActiveScenario(scenarioId || null)
    
    // Reset all steps to pending
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
    
    // Start first step
    executeStep(0)
  }

  const pauseDemo = () => {
    setIsRunning(false)
  }

  const stopDemo = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setDemoProgress(0)
    setActiveScenario(null)
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
  }

  const executeStep = async (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      // Demo completed
      setIsRunning(false)
      setDemoProgress(100)
      return
    }

    // Mark current step as active
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      status: index === stepIndex ? 'active' : 
              index < stepIndex ? 'completed' : 'pending'
    })))

    // Simulate step execution
    const currentStepData = steps[stepIndex]
    const stepDuration = currentStepData.duration * 1000 // Convert to milliseconds

    await new Promise(resolve => setTimeout(resolve, stepDuration))

    // Mark step as completed and move to next
    setCurrentStep(stepIndex + 1)
    setDemoProgress(((stepIndex + 1) / steps.length) * 100)

    if (isRunning && stepIndex + 1 < steps.length) {
      executeStep(stepIndex + 1)
    }
  }

  const skipCurrentStep = () => {
    if (currentStep < steps.length) {
      setSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, status: 'skipped' } : step
      ))
      setCurrentStep(prev => prev + 1)
      executeStep(currentStep + 1)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'setup': return <Settings className="h-4 w-4" />
      case 'therapist': return <User className="h-4 w-4" />
      case 'patient': return <Users className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      case 'evaluation': return <Award className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'setup': return 'bg-gray-500'
      case 'therapist': return 'bg-blue-500'
      case 'patient': return 'bg-green-500'
      case 'admin': return 'bg-purple-500'
      case 'evaluation': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'skipped': return <SkipForward className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Demo Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Play className="h-6 w-6" />
            Complete Demo Workflow
          </CardTitle>
          <p className="text-muted-foreground">
            Interactive demonstration system for comprehensive platform evaluation
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={() => startDemo()} 
              disabled={isRunning}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Full Demo
            </Button>
            <Button 
              onClick={pauseDemo} 
              disabled={!isRunning}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button 
              onClick={stopDemo}
              variant="outline"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button 
              onClick={skipCurrentStep}
              disabled={!isRunning}
              variant="outline"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Step
            </Button>
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length} • {Math.round(demoProgress)}%
              </span>
            </div>
            <Progress value={demoProgress} className="h-3" />
            
            {isRunning && currentStep < steps.length && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                  <span className="font-medium text-blue-800">
                    Currently Executing: {steps[currentStep]?.title}
                  </span>
                </div>
                <p className="text-sm text-blue-600">
                  {steps[currentStep]?.description}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-configured Demo Scenarios</CardTitle>
          <p className="text-muted-foreground">
            Choose from predefined demonstration workflows for different audiences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map(scenario => (
              <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scenario.description}
                      </p>
                    </div>
                    <Badge variant="outline">{scenario.duration} min</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Participants:</p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.participants.map(participant => (
                          <Badge key={participant} variant="secondary" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => startDemo(scenario.id)}
                        disabled={isRunning}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start Scenario
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview Steps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Steps */}
      <Tabs defaultValue="steps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="steps">Demo Steps</TabsTrigger>
          <TabsTrigger value="devices">Device Testing</TabsTrigger>
          <TabsTrigger value="export">Export Results</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`${step.status === 'active' ? 'border-blue-300 bg-blue-50' : ''} 
                           ${step.status === 'completed' ? 'border-green-300 bg-green-50' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg text-white ${getCategoryColor(step.category)}`}>
                        {getCategoryIcon(step.category)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Step {index + 1}: {step.title}
                          {getStatusIcon(step.status)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {step.category} • {step.duration} minutes
                        </p>
                      </div>
                    </div>
                    <Badge className={step.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                    step.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-gray-100 text-gray-800'}>
                      {step.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Actions to Demonstrate:</h4>
                      <ul className="space-y-1">
                        {step.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Expected Outcome:</h4>
                      <p className="text-sm text-muted-foreground">{step.expectedOutcome}</p>
                      
                      {step.requirements && (
                        <div className="mt-3">
                          <h4 className="font-medium mb-2 text-sm">Requirements:</h4>
                          <div className="flex flex-wrap gap-1">
                            {step.requirements.map((req, reqIndex) => (
                              <Badge key={reqIndex} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cross-Device Testing</CardTitle>
              <p className="text-muted-foreground">
                Demonstrate platform responsiveness across different devices and browsers
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-medium">Desktop View</h4>
                  <p className="text-sm text-muted-foreground">Full feature demonstration</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </Card>
                
                <Card className="p-4 text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-medium">Mobile View</h4>
                  <p className="text-sm text-muted-foreground">Touch-optimized interface</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </Card>
                
                <Card className="p-4 text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-medium">Tablet View</h4>
                  <p className="text-sm text-muted-foreground">Hybrid experience</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Demo Results</CardTitle>
              <p className="text-muted-foreground">
                Generate comprehensive reports and documentation from demo sessions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Export Demo Report</span>
                  <span className="text-xs opacity-75">PDF with screenshots</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Generate Documentation</span>
                  <span className="text-xs opacity-75">Technical specifications</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col">
                  <Video className="h-6 w-6 mb-2" />
                  <span>Export Session Recordings</span>
                  <span className="text-xs opacity-75">MP4 video files</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex-col">
                  <Award className="h-6 w-6 mb-2" />
                  <span>Academic Evaluation</span>
                  <span className="text-xs opacity-75">Grading framework</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
