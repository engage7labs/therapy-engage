'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  Users,
  Shield,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  FileText,
  Award,
  BookOpen
} from 'lucide-react'

interface EvaluationCriteria {
  id: string
  category: string
  title: string
  description: string
  weight: number
  score?: number
  maxScore: number
  status: 'pending' | 'in-progress' | 'completed'
  evidence?: string[]
}

interface EvaluationReport {
  id: string
  title: string
  evaluator: string
  date: string
  overallScore: number
  maxScore: number
  status: 'draft' | 'submitted' | 'reviewed'
  categories: Record<string, number>
}

export default function AcademicEvaluationTools() {
  const [activeEvaluation, setActiveEvaluation] = useState<string>('criteria')
  const [evaluationProgress, setEvaluationProgress] = useState(0)

  const evaluationCriteria: EvaluationCriteria[] = [
    // User Experience & Interface
    {
      id: 'ux-1',
      category: 'User Experience',
      title: 'Intuitive Navigation',
      description: 'Platform provides clear, intuitive navigation for both therapists and patients',
      weight: 15,
      score: 14,
      maxScore: 15,
      status: 'completed',
      evidence: ['User flow documentation', 'Navigation testing results', 'Accessibility audit']
    },
    {
      id: 'ux-2',
      category: 'User Experience',
      title: 'Responsive Design',
      description: 'Interface adapts seamlessly across desktop, tablet, and mobile devices',
      weight: 10,
      score: 9,
      maxScore: 10,
      status: 'completed',
      evidence: ['Cross-device testing', 'Responsive design screenshots']
    },
    {
      id: 'ux-3',
      category: 'User Experience',
      title: 'Accessibility Compliance',
      description: 'Platform meets WCAG 2.1 AA accessibility standards',
      weight: 10,
      score: 8,
      maxScore: 10,
      status: 'completed',
      evidence: ['WAVE accessibility report', 'Screen reader testing']
    },

    // Clinical Functionality
    {
      id: 'clinical-1',
      category: 'Clinical Features',
      title: 'Session Management',
      description: 'Comprehensive tools for scheduling, conducting, and documenting therapy sessions',
      weight: 20,
      score: 18,
      maxScore: 20,
      status: 'completed',
      evidence: ['Session workflow demo', 'Documentation samples', 'Calendar integration']
    },
    {
      id: 'clinical-2',
      category: 'Clinical Features',
      title: 'Patient Progress Tracking',
      description: 'Robust system for monitoring and analyzing patient progress over time',
      weight: 15,
      status: 'in-progress',
      maxScore: 15,
      evidence: ['Progress visualization tools', 'Analytics dashboard']
    },
    {
      id: 'clinical-3',
      category: 'Clinical Features',
      title: 'Crisis Intervention Tools',
      description: 'Emergency protocols and crisis intervention features for patient safety',
      weight: 10,
      status: 'pending',
      maxScore: 10,
      evidence: []
    },

    // Technical Implementation
    {
      id: 'tech-1',
      category: 'Technical Quality',
      title: 'System Performance',
      description: 'Platform demonstrates optimal loading times and responsive performance',
      weight: 10,
      score: 9,
      maxScore: 10,
      status: 'completed',
      evidence: ['Performance metrics', 'Load testing results']
    },
    {
      id: 'tech-2',
      category: 'Technical Quality',
      title: 'Code Quality & Architecture',
      description: 'Clean, maintainable code following best practices and design patterns',
      weight: 15,
      score: 13,
      maxScore: 15,
      status: 'completed',
      evidence: ['Code review documentation', 'Architecture diagrams', 'TypeScript implementation']
    },

    // Security & Compliance
    {
      id: 'security-1',
      category: 'Security & Privacy',
      title: 'Data Protection',
      description: 'Implementation of comprehensive data protection and privacy measures',
      weight: 20,
      status: 'in-progress',
      maxScore: 20,
      evidence: ['GDPR compliance documentation', 'Encryption implementation']
    },
    {
      id: 'security-2',
      category: 'Security & Privacy',
      title: 'HIPAA Compliance',
      description: 'Healthcare data handling meets HIPAA security and privacy requirements',
      weight: 15,
      status: 'pending',
      maxScore: 15,
      evidence: []
    }
  ]

  const [criteria, setCriteria] = useState<EvaluationCriteria[]>(evaluationCriteria)

  const evaluationReports: EvaluationReport[] = [
    {
      id: 'report-1',
      title: 'Mid-Term Academic Review',
      evaluator: 'Dr. Sarah Mitchell',
      date: '2024-01-15',
      overallScore: 87,
      maxScore: 100,
      status: 'reviewed',
      categories: {
        'User Experience': 85,
        'Clinical Features': 88,
        'Technical Quality': 92,
        'Security & Privacy': 82
      }
    },
    {
      id: 'report-2',
      title: 'Technical Architecture Assessment',
      evaluator: 'Prof. David Chen',
      date: '2024-01-20',
      overallScore: 91,
      maxScore: 100,
      status: 'submitted',
      categories: {
        'User Experience': 88,
        'Clinical Features': 90,
        'Technical Quality': 95,
        'Security & Privacy': 87
      }
    },
    {
      id: 'report-3',
      title: 'Final Project Evaluation',
      evaluator: 'Dr. Emily Rodriguez',
      date: '2024-01-25',
      overallScore: 0,
      maxScore: 100,
      status: 'draft',
      categories: {
        'User Experience': 0,
        'Clinical Features': 0,
        'Technical Quality': 0,
        'Security & Privacy': 0
      }
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'pending': return <AlertTriangle className="h-4 w-4 text-gray-400" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'submitted': return 'bg-purple-100 text-purple-800'
      case 'draft': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const calculateCategoryScore = (categoryName: string) => {
    const categoryCriteria = criteria.filter(c => c.category === categoryName)
    const completedCriteria = categoryCriteria.filter(c => c.score !== undefined)
    
    if (completedCriteria.length === 0) return 0
    
    const totalScore = completedCriteria.reduce((sum, c) => sum + (c.score || 0), 0)
    const maxScore = completedCriteria.reduce((sum, c) => sum + c.maxScore, 0)
    
    return Math.round((totalScore / maxScore) * 100)
  }

  const calculateOverallProgress = () => {
    const completedCount = criteria.filter(c => c.status === 'completed').length
    return Math.round((completedCount / criteria.length) * 100)
  }

  const generateReport = () => {
    const totalScore = criteria.reduce((sum, c) => sum + (c.score || 0), 0)
    const maxScore = criteria.reduce((sum, c) => sum + c.maxScore, 0)
    const overallScore = Math.round((totalScore / maxScore) * 100)

    console.log('Generating evaluation report...', { totalScore, maxScore, overallScore })
    // Here you would typically generate and download a PDF report
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6" />
            Academic Evaluation Tools
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive evaluation framework for academic assessment and project grading
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{criteria.filter(c => c.status === 'completed').length}</p>
              <p className="text-sm text-muted-foreground">Completed Criteria</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{criteria.filter(c => c.status === 'in-progress').length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{evaluationReports.filter(r => r.status === 'reviewed').length}</p>
              <p className="text-sm text-muted-foreground">Reviewed Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Tabs */}
      <Tabs value={activeEvaluation} onValueChange={setActiveEvaluation}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">Evaluation Criteria</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="reports">Evaluation Reports</TabsTrigger>
          <TabsTrigger value="rubric">Grading Rubric</TabsTrigger>
        </TabsList>

        {/* Evaluation Criteria Tab */}
        <TabsContent value="criteria" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Assessment Criteria</h3>
            <Button onClick={generateReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Evaluation
            </Button>
          </div>

          <div className="space-y-4">
            {['User Experience', 'Clinical Features', 'Technical Quality', 'Security & Privacy'].map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category}</span>
                    <Badge variant="outline">
                      {calculateCategoryScore(category)}% Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criteria.filter(c => c.category === category).map(criterion => (
                      <div key={criterion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(criterion.status)}
                              <h4 className="font-medium">{criterion.title}</h4>
                              <Badge className={getStatusColor(criterion.status)}>
                                {criterion.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {criterion.description}
                            </p>
                            <p className="text-sm font-medium">
                              Weight: {criterion.weight} points
                              {criterion.score !== undefined && (
                                <span className="ml-2 text-green-600">
                                  • Score: {criterion.score}/{criterion.maxScore}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {criterion.evidence && criterion.evidence.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Evidence:</p>
                            <div className="flex flex-wrap gap-2">
                              {criterion.evidence.map((evidence, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {evidence}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['User Experience', 'Clinical Features', 'Technical Quality', 'Security & Privacy'].map(category => {
                  const categoryProgress = calculateCategoryScore(category)
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">{categoryProgress}%</span>
                      </div>
                      <Progress value={categoryProgress} className="h-3" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">System Performance Evaluation Completed</p>
                    <p className="text-sm text-muted-foreground">Scored 9/10 points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Technical Architecture Assessment Reviewed</p>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Mitchell provided feedback</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Security Evaluation In Progress</p>
                    <p className="text-sm text-muted-foreground">HIPAA compliance review pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {evaluationReports.map(report => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {report.title}
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Evaluated by {report.evaluator} • {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{report.overallScore}%</p>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-4">
                    {Object.entries(report.categories).map(([category, score]) => (
                      <div key={category} className="text-center p-3 bg-muted rounded-lg">
                        <p className="font-semibold">{score}%</p>
                        <p className="text-xs text-muted-foreground">{category}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Grading Rubric Tab */}
        <TabsContent value="rubric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Academic Grading Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-bold text-green-800">Excellent (90-100%)</p>
                    <p className="text-sm text-green-600">Exceeds expectations</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="font-bold text-blue-800">Good (80-89%)</p>
                    <p className="text-sm text-blue-600">Meets expectations</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <ClipboardCheck className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-bold text-yellow-800">Satisfactory (70-79%)</p>
                    <p className="text-sm text-yellow-600">Approaches expectations</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="font-bold text-red-800">Needs Improvement (&lt;70%)</p>
                    <p className="text-sm text-red-600">Below expectations</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Evaluation Categories & Weights:</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>User Experience & Interface Design</span>
                      <Badge>25%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Clinical Features & Functionality</span>
                      <Badge>35%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Technical Implementation & Quality</span>
                      <Badge>25%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Security, Privacy & Compliance</span>
                      <Badge>15%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
