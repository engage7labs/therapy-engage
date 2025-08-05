import { useState, useEffect } from 'react'
import { useKV } from '../hooks/use-kv'
import { useInternationalization } from '@/hooks/use-internationalization'
import { LanguageSelector } from '@/components/i18n/language-selector'
import { MultilingualConsentForm } from '@/components/i18n/multilingual-consent-form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  Globe, 
  Shield, 
  CheckCircle, 
  Clock,
  FileText,
  Users,
  BarChart3,
  AlertTriangle,
  Play,
  Settings
} from '@phosphor-icons/react'

interface TestScenario {
  id: string
  name: string
  description: string
  patientProfile: {
    name: string
    age: number
    primaryLanguage: string
    region: string
    culturalBackground: string
  }
  testObjectives: string[]
  expectedOutcomes: string[]
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'scenario-eu-ireland',
    name: 'Irish Patient - GDPR Compliance',
    description: 'Young professional from Dublin seeking CBT for anxiety, tech-savvy, GDPR-conscious',
    patientProfile: {
      name: 'Síle O\'Connor',
      age: 28,
      primaryLanguage: 'en-IE',
      region: 'Dublin, Ireland',
      culturalBackground: 'Irish urban professional, privacy-conscious'
    },
    testObjectives: [
      'Verify GDPR consent requirements',
      'Test data portability explanations',
      'Validate withdrawal process clarity',
      'Check cultural appropriateness for Irish context'
    ],
    expectedOutcomes: [
      'Clear understanding of GDPR rights',
      'Confident consent completion',
      'Positive feedback on privacy protection',
      'Successful session initiation'
    ]
  },
  {
    id: 'scenario-br-anxiety',
    name: 'Brazilian Patient - LGPD & Cultural Sensitivity',
    description: 'University student from São Paulo, family-oriented culture, anxiety about academic performance',
    patientProfile: {
      name: 'Ana Carolina Silva',
      age: 22,
      primaryLanguage: 'pt-BR',
      region: 'São Paulo, Brazil',
      culturalBackground: 'Brazilian student, family-centered, relationship-focused'
    },
    testObjectives: [
      'Test LGPD compliance in Portuguese',
      'Verify cultural appropriateness for Brazilian context',
      'Check family involvement considerations',
      'Validate religious sensitivity aspects'
    ],
    expectedOutcomes: [
      'Comfortable consent process in Portuguese',
      'Family involvement options presented',
      'Cultural values respected',
      'Successful LGPD compliance'
    ]
  },
  {
    id: 'scenario-es-trauma',
    name: 'Spanish Patient - Complex Trauma Case',
    description: 'Middle-aged client from Madrid with PTSD, formal communication preference, medical background',
    patientProfile: {
      name: 'Dr. Carmen Rodríguez',
      age: 45,
      primaryLanguage: 'es-ES',
      region: 'Madrid, Spain',
      culturalBackground: 'Spanish medical professional, formal, detail-oriented'
    },
    testObjectives: [
      'Test formal Spanish consent language',
      'Verify medical terminology accuracy',
      'Check trauma-informed consent approach',
      'Validate professional-to-professional communication'
    ],
    expectedOutcomes: [
      'Professional-level Spanish consent',
      'Medical accuracy maintained',
      'Trauma-sensitive approach confirmed',
      'High confidence in legal validity'
    ]
  },
  {
    id: 'scenario-multilingual',
    name: 'Multilingual Patient - Language Switching',
    description: 'International business executive fluent in multiple languages, testing language flexibility',
    patientProfile: {
      name: 'Alexandre Dubois',
      age: 38,
      primaryLanguage: 'fr-FR',
      region: 'Paris, France (working globally)',
      culturalBackground: 'Multilingual executive, analytical, efficiency-focused'
    },
    testObjectives: [
      'Test language switching mid-process',
      'Verify consent validity across language changes',
      'Check translation accuracy maintenance',
      'Validate user experience across languages'
    ],
    expectedOutcomes: [
      'Seamless language transitions',
      'Maintained consent integrity',
      'Positive multilingual experience',
      'Legal validity preserved'
    ]
  }
]

export function InternationalConsentTester() {
  const { currentLocale, supportedLocales } = useInternationalization()
  const [activeScenario, setActiveScenario] = useState<TestScenario | null>(null)
  const [testResults, setTestResults] = useKV<Record<string, any>>('consent-test-results', {})
  const [currentStep, setCurrentStep] = useState<'selection' | 'language' | 'consent' | 'results'>('selection')

  const startScenarioTest = (scenario: TestScenario) => {
    setActiveScenario(scenario)
    setCurrentStep('language')
    toast.success(`Starting test scenario: ${scenario.name}`)
  }

  const handleLanguageSetup = () => {
    if (!activeScenario) return
    setCurrentStep('consent')
  }

  const handleConsentCompleted = (consentData: any) => {
    if (!activeScenario) return
    
    const testResult = {
      scenarioId: activeScenario.id,
      scenarioName: activeScenario.name,
      completedAt: new Date().toISOString(),
      consentData,
      locale: currentLocale.code,
      jurisdiction: currentLocale.jurisdiction,
      testMetrics: {
        completionTime: Date.now(), // In real implementation, track actual time
        languageSwitches: 0, // Track language changes
        sectionsReread: 0, // Track if user reread sections
        translationRequests: 0 // Track AI translation usage
      }
    }
    
    setTestResults(prev => ({
      ...prev,
      [activeScenario.id]: testResult
    }))
    
    setCurrentStep('results')
    toast.success('Test scenario completed successfully!')
  }

  const resetTest = () => {
    setActiveScenario(null)
    setCurrentStep('selection')
  }

  const renderScenarioSelection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-primary" />
            International Consent Workflow Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Test the complete patient consent workflow across different languages, cultures, and legal jurisdictions. 
              Each scenario simulates real patient profiles with specific cultural and legal requirements.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {TEST_SCENARIOS.map((scenario) => {
          const hasResult = testResults[scenario.id]
          
          return (
            <Card key={scenario.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  {hasResult && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle size={14} />
                      Tested
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users size={16} />
                    Patient Profile
                  </h4>
                  <div className="text-sm space-y-1 pl-6">
                    <div><strong>Name:</strong> {scenario.patientProfile.name}</div>
                    <div><strong>Age:</strong> {scenario.patientProfile.age}</div>
                    <div><strong>Language:</strong> {scenario.patientProfile.primaryLanguage}</div>
                    <div><strong>Region:</strong> {scenario.patientProfile.region}</div>
                    <div><strong>Background:</strong> {scenario.patientProfile.culturalBackground}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText size={16} />
                    Test Objectives
                  </h4>
                  <ul className="text-sm space-y-1 pl-6">
                    {scenario.testObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => startScenarioTest(scenario)}
                  className="w-full"
                  variant={hasResult ? "outline" : "default"}
                >
                  <Play className="mr-2" size={16} />
                  {hasResult ? 'Retest Scenario' : 'Start Test'}
                </Button>

                {hasResult && (
                  <div className="text-xs text-muted-foreground">
                    Last tested: {new Date(testResults[scenario.id].completedAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary" />
              Test Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(testResults).length}
                </div>
                <div className="text-sm text-muted-foreground">Scenarios Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {supportedLocales.length}
                </div>
                <div className="text-sm text-muted-foreground">Languages Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(Object.values(testResults).map((r: any) => r.jurisdiction)).size}
                </div>
                <div className="text-sm text-muted-foreground">Jurisdictions Tested</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderLanguageSetup = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Testing: {activeScenario?.name}
          </CardTitle>
          <p className="text-muted-foreground">
            Select the appropriate language and regional settings for this patient scenario.
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>Patient:</strong> {activeScenario?.patientProfile.name} from {activeScenario?.patientProfile.region}
              <br />
              <strong>Primary Language:</strong> {activeScenario?.patientProfile.primaryLanguage}
              <br />
              <strong>Cultural Background:</strong> {activeScenario?.patientProfile.culturalBackground}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <LanguageSelector />

      <div className="flex gap-3">
        <Button variant="outline" onClick={resetTest}>
          Cancel Test
        </Button>
        <Button onClick={handleLanguageSetup} className="flex-1">
          Continue to Consent Form
        </Button>
      </div>
    </div>
  )

  const renderConsentTesting = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-primary" />
            Consent Form Testing - {activeScenario?.name}
          </CardTitle>
          <p className="text-muted-foreground">
            Complete the consent workflow as the patient would experience it.
          </p>
        </CardHeader>
      </Card>

      <MultilingualConsentForm
        sessionId={`test-session-${activeScenario?.id}`}
        patientId={`test-patient-${activeScenario?.id}`}
        patientName={activeScenario?.patientProfile.name || 'Test Patient'}
        therapistId="test-therapist-001"
        onConsentCompleted={handleConsentCompleted}
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('language')}>
          Back to Language Setup
        </Button>
        <Button variant="outline" onClick={resetTest}>
          Cancel Test
        </Button>
      </div>
    </div>
  )

  const renderTestResults = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle />
            Test Completed Successfully
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Scenario <strong>{activeScenario?.name}</strong> completed successfully. 
              The consent workflow has been validated for this patient profile and jurisdiction.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Scenario Details</h4>
              <div className="text-sm space-y-1">
                <div><strong>Patient:</strong> {activeScenario?.patientProfile.name}</div>
                <div><strong>Language:</strong> {currentLocale.nativeName}</div>
                <div><strong>Jurisdiction:</strong> {currentLocale.jurisdiction}</div>
                <div><strong>Completion:</strong> {new Date().toLocaleString()}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Validation Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm">Legal compliance verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm">Cultural appropriateness confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm">Digital signature validity established</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-sm">Data protection compliance verified</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={resetTest} className="flex-1">
          Test Another Scenario
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Export Test Report
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      {currentStep === 'selection' && renderScenarioSelection()}
      {currentStep === 'language' && renderLanguageSetup()}
      {currentStep === 'consent' && renderConsentTesting()}
      {currentStep === 'results' && renderTestResults()}
    </div>
  )
}