import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Info,
  Brain,
  Heart,
  Clock,
  Target
} from 'lucide-react'

/**
 * Test Scenarios Documentation Component
 * 
 * Provides comprehensive documentation of all therapy session test scenarios
 * with detailed descriptions of patient responses, risk assessments, and
 * expected therapeutic outcomes for platform validation.
 */

interface TestScenario {
  id: string
  name: string
  description: string
  riskLevel: 'low' | 'moderate' | 'high'
  patientProfile: string
  expectedResponses: string[]
  therapeuticGoals: string[]
  aiInsightExpected: string[]
  validationCriteria: string[]
}

const testScenarios: TestScenario[] = [
  {
    id: 'positive-progress',
    name: 'Positive Progress Scenario',
    description: 'Patient demonstrating consistent improvement and engagement with therapeutic interventions',
    riskLevel: 'low',
    patientProfile: 'Young adult with generalized anxiety disorder, highly motivated for change',
    expectedResponses: [
      'Cooperative and engaged throughout session',
      'Actively practices coping strategies',
      'Reports reduced anxiety symptoms',
      'Maintains good eye contact and open body language'
    ],
    therapeuticGoals: [
      'Reinforce successful coping strategies',
      'Gradually increase exposure challenges',
      'Build confidence in self-management',
      'Plan for maintenance phase'
    ],
    aiInsightExpected: [
      'Positive sentiment analysis in speech patterns',
      'Decreased anxiety-related keywords',
      'Increased confidence indicators',
      'Successful homework completion patterns'
    ],
    validationCriteria: [
      'Session duration within normal range (45-50 min)',
      'No crisis intervention required',
      'Positive therapeutic alliance scores',
      'Clear progress toward treatment goals'
    ]
  },
  {
    id: 'crisis-intervention',
    name: 'Crisis Intervention Scenario',
    description: 'High-risk patient requiring immediate safety assessment and intervention',
    riskLevel: 'high',
    patientProfile: 'Individual with PTSD experiencing acute trauma response and suicidal ideation',
    expectedResponses: [
      'Initially distressed and tearful',
      'Difficulty maintaining focus',
      'Reports intrusive thoughts and flashbacks',
      'Expresses feelings of hopelessness'
    ],
    therapeuticGoals: [
      'Ensure immediate safety',
      'Activate crisis support network',
      'Implement grounding techniques',
      'Develop safety plan'
    ],
    aiInsightExpected: [
      'High emotional distress indicators',
      'Risk-related keyword detection',
      'Disrupted speech patterns',
      'Safety planning recommendation triggers'
    ],
    validationCriteria: [
      'Extended session duration (60-75 min)',
      'Crisis protocol activation',
      'Safety plan documentation',
      'Follow-up scheduling within 24-48 hours'
    ]
  },
  {
    id: 'mixed-progress',
    name: 'Mixed Progress Scenario',
    description: 'Patient showing inconsistent progress with some resistance to treatment',
    riskLevel: 'moderate',
    patientProfile: 'Adult with depression, ambivalent about treatment, some medication compliance issues',
    expectedResponses: [
      'Initially resistant or withdrawn',
      'Gradual warming throughout session',
      'Reports mixed results with interventions',
      'Some defensive responses to challenges'
    ],
    therapeuticGoals: [
      'Address treatment ambivalence',
      'Strengthen therapeutic alliance',
      'Modify intervention approach',
      'Increase motivation for change'
    ],
    aiInsightExpected: [
      'Fluctuating engagement patterns',
      'Mixed emotional valence',
      'Resistance indicators early in session',
      'Gradual improvement in responsiveness'
    ],
    validationCriteria: [
      'Standard session duration with extensions as needed',
      'Therapeutic alliance assessment',
      'Modified treatment plan documentation',
      'Increased session frequency consideration'
    ]
  },
  {
    id: 'medication-adjustment',
    name: 'Medication Review Scenario',
    description: 'Session focused on medication effects, side effects, and dosage optimization',
    riskLevel: 'moderate',
    patientProfile: 'Patient experiencing medication side effects while showing therapeutic benefits',
    expectedResponses: [
      'Detailed reporting of side effects',
      'Concerns about medication dependency',
      'Questions about alternative treatments',
      'Desire to maintain therapeutic gains'
    ],
    therapeuticGoals: [
      'Assess medication effectiveness',
      'Address side effect concerns',
      'Coordinate with prescribing physician',
      'Optimize treatment balance'
    ],
    aiInsightExpected: [
      'Medication-related keyword clustering',
      'Side effect symptom descriptions',
      'Compliance pattern analysis',
      'Quality of life impact assessment'
    ],
    validationCriteria: [
      'Comprehensive medication review documentation',
      'Physician communication initiated',
      'Side effect severity assessment',
      'Treatment plan modification as needed'
    ]
  },
  {
    id: 'relapse-prevention',
    name: 'Relapse Prevention Scenario',
    description: 'High-risk session with patient experiencing substance use triggers and cravings',
    riskLevel: 'high',
    patientProfile: 'Individual in recovery from substance use disorder, facing high-stress life events',
    expectedResponses: [
      'Initially defensive about recent struggles',
      'Admits to increased cravings',
      'Reveals trigger situations',
      'Demonstrates breakthrough moments of insight'
    ],
    therapeuticGoals: [
      'Reinforce sobriety commitment',
      'Update relapse prevention plan',
      'Strengthen coping strategies',
      'Increase support system engagement'
    ],
    aiInsightExpected: [
      'Substance use-related terminology',
      'Stress and trigger indicators',
      'Commitment to recovery language',
      'Insight development patterns'
    ],
    validationCriteria: [
      'Updated relapse prevention plan',
      'Increased monitoring frequency',
      'Support system activation',
      'Crisis contact information verification'
    ]
  },
  {
    id: 'relationship-counseling',
    name: 'Couples Therapy Scenario',
    description: 'Joint session with couple working on communication and relationship dynamics',
    riskLevel: 'low',
    patientProfile: 'Married couple seeking to improve communication and resolve ongoing conflicts',
    expectedResponses: [
      'Both partners actively participating',
      'Some interrupting and defensive moments',
      'Breakthrough in understanding perspectives',
      'Commitment to homework assignments'
    ],
    therapeuticGoals: [
      'Improve communication patterns',
      'Develop conflict resolution skills',
      'Strengthen emotional connection',
      'Establish relationship maintenance practices'
    ],
    aiInsightExpected: [
      'Multiple speaker identification',
      'Interruption pattern analysis',
      'Emotional tone matching between partners',
      'Communication improvement indicators'
    ],
    validationCriteria: [
      'Balanced participation from both partners',
      'Communication skill demonstration',
      'Homework assignment completion planning',
      'Relationship satisfaction metric improvement'
    ]
  },
  {
    id: 'teen-behavioral-issues',
    name: 'Adolescent Therapy Scenario',
    description: 'Session with teenager presenting behavioral challenges and family conflicts',
    riskLevel: 'moderate',
    patientProfile: '16-year-old with behavioral issues, school problems, and family relationship difficulties',
    expectedResponses: [
      'Initially withdrawn and minimal responses',
      'Gradual opening up about peer pressure',
      'Emotional reactions to family discussions',
      'Some engagement with therapeutic activities'
    ],
    therapeuticGoals: [
      'Build therapeutic rapport',
      'Address behavioral concerns',
      'Improve family communication',
      'Develop healthy coping strategies'
    ],
    aiInsightExpected: [
      'Age-appropriate language patterns',
      'Emotional regulation challenges',
      'Family dynamics insights',
      'Behavioral change readiness assessment'
    ],
    validationCriteria: [
      'Shorter session duration (35-40 min)',
      'Parent/guardian involvement planning',
      'School coordination if needed',
      'Age-appropriate intervention documentation'
    ]
  },
  {
    id: 'peer-support',
    name: 'Group Therapy Scenario',
    description: 'Group session facilitating peer support and shared therapeutic experiences',
    riskLevel: 'low',
    patientProfile: 'Support group for individuals with similar mental health challenges',
    expectedResponses: [
      'Varied participation levels across members',
      'Peer support and encouragement',
      'Shared experiences and insights',
      'Group cohesion building moments'
    ],
    therapeuticGoals: [
      'Facilitate peer support',
      'Normalize shared experiences',
      'Build group cohesion',
      'Practice social skills'
    ],
    aiInsightExpected: [
      'Multiple speaker interaction patterns',
      'Group dynamics analysis',
      'Peer support language identification',
      'Social engagement improvements'
    ],
    validationCriteria: [
      'Extended session duration (90 min)',
      'Balanced group participation',
      'Peer support documentation',
      'Group cohesion assessment'
    ]
  }
]

export function TestScenarios() {
  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="h-4 w-4" />
      case 'moderate': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <Plus className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <TestTube className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Therapy Session Test Scenarios</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive test scenarios designed to validate the platform's ability to handle diverse 
          therapeutic situations, patient responses, and clinical outcomes across different risk levels.
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TestTube className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{testScenarios.length}</p>
                <p className="text-sm text-muted-foreground">Total Scenarios</p>
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
                <p className="text-2xl font-bold">{testScenarios.filter(s => s.riskLevel === 'low').length}</p>
                <p className="text-sm text-muted-foreground">Low Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{testScenarios.filter(s => s.riskLevel === 'moderate').length}</p>
                <p className="text-sm text-muted-foreground">Moderate Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Plus className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{testScenarios.filter(s => s.riskLevel === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scenario Cards */}
      <div className="grid gap-6">
        {testScenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getRiskIcon(scenario.riskLevel)}
                  {scenario.name}
                </CardTitle>
                <Badge className={getRiskColor(scenario.riskLevel)}>
                  {scenario.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <p className="text-muted-foreground">{scenario.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Profile */}
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4" />
                  Patient Profile
                </h4>
                <p className="text-sm text-muted-foreground">{scenario.patientProfile}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Expected Responses */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4" />
                    Expected Patient Responses
                  </h4>
                  <ul className="space-y-2">
                    {scenario.expectedResponses.map((response, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {response}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Therapeutic Goals */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4" />
                    Therapeutic Goals
                  </h4>
                  <ul className="space-y-2">
                    {scenario.therapeuticGoals.map((goal, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* AI Insights Expected */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4" />
                    Expected AI Insights
                  </h4>
                  <ul className="space-y-2">
                    {scenario.aiInsightExpected.map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Validation Criteria */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4" />
                    Validation Criteria
                  </h4>
                  <ul className="space-y-2">
                    {scenario.validationCriteria.map((criteria, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}