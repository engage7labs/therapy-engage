'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Presentation,
  Database,
  GraduationCap,
  Play,
  Users,
  Video,
  Shield,
  BarChart3,
  BookOpen,
  Award,
  Download,
  Monitor,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface DemoFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  link: string
  status: 'ready' | 'preview' | 'coming-soon'
  category: 'demo' | 'academic' | 'technical'
}

export default function DemoPage() {
  const demoFeatures: DemoFeature[] = [
    {
      id: 'patient-portal',
      title: 'Patient Portal Interface',
      description: 'Complete patient experience including dashboard, sessions, and progress tracking',
      icon: <Users className="h-6 w-6" />,
      link: '/client-portal',
      status: 'ready',
      category: 'demo'
    },
    {
      id: 'data-generator',
      title: 'Demo Data Generator',
      description: 'Generate realistic demo data for comprehensive platform evaluation',
      icon: <Database className="h-6 w-6" />,
      link: '/demo/data-generator',
      status: 'ready',
      category: 'technical'
    },
    {
      id: 'evaluation-tools',
      title: 'Academic Evaluation Tools',
      description: 'Assessment framework and grading rubric for academic evaluation',
      icon: <GraduationCap className="h-6 w-6" />,
      link: '/demo/evaluation',
      status: 'ready',
      category: 'academic'
    },
    {
      id: 'complete-workflow',
      title: 'Complete Demo Workflow',
      description: 'Interactive step-by-step demonstration of all platform features',
      icon: <Play className="h-6 w-6" />,
      link: '/demo/workflow',
      status: 'ready',
      category: 'demo'
    },
    {
      id: 'video-communication',
      title: 'Video Communication System',
      description: 'WebRTC-based video therapy sessions with recording capabilities',
      icon: <Video className="h-6 w-6" />,
      link: '/sessions/video-call',
      status: 'ready',
      category: 'demo'
    },
    {
      id: 'therapist-dashboard',
      title: 'Therapist Dashboard',
      description: 'Comprehensive therapist workspace with session management and analytics',
      icon: <Monitor className="h-6 w-6" />,
      link: '/dashboard',
      status: 'ready',
      category: 'demo'
    }
  ]

  const academicHighlights = [
    {
      title: 'Next.js 14 Implementation',
      description: 'Modern React framework with App Router and TypeScript',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'WebRTC Integration',
      description: 'Real-time video communication with recording capabilities',
      icon: <Video className="h-5 w-5" />
    },
    {
      title: 'Security & Privacy',
      description: 'HIPAA-compliant data handling and encryption',
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive metrics and reporting system',
      icon: <BarChart3 className="h-5 w-5" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'preview': return 'bg-blue-100 text-blue-800'
      case 'coming-soon': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'demo': return <Presentation className="h-4 w-4" />
      case 'academic': return <Award className="h-4 w-4" />
      case 'technical': return <Monitor className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-900 mb-4">
            Therapy Engage Platform
          </CardTitle>
          <p className="text-xl text-blue-700 mb-6">
            Academic Demo & Evaluation System
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            A comprehensive Next.js 14 therapy platform demonstrating modern web development practices, 
            real-time video communication, and healthcare-compliant design for academic evaluation and assessment.
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex gap-4 justify-center">
            <Link href="/demo/workflow">
              <Button size="lg" className="text-lg px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Full Demo
              </Button>
            </Link>
            <Link href="/demo/evaluation">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <GraduationCap className="h-5 w-5 mr-2" />
                Academic Assessment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Demo Components</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoFeatures.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(feature.category)}
                      <span className="ml-1 capitalize">{feature.category}</span>
                    </Badge>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {feature.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardHeader>
              <CardContent>
                <Link href={feature.link}>
                  <Button 
                    variant={feature.status === 'ready' ? 'default' : 'outline'} 
                    className="w-full"
                    disabled={feature.status === 'coming-soon'}
                  >
                    {feature.status === 'ready' ? 'Launch Demo' : 
                     feature.status === 'preview' ? 'Preview' : 'Coming Soon'}
                    {feature.status === 'ready' && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Academic Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            Academic & Technical Highlights
          </CardTitle>
          <p className="text-muted-foreground">
            Key technical achievements and academic evaluation criteria
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {academicHighlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {highlight.icon}
                </div>
                <div>
                  <h4 className="font-medium">{highlight.title}</h4>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-muted-foreground">
            Common demonstration and evaluation tasks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/demo/data-generator">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Database className="h-5 w-5 mb-1" />
                <span className="text-sm">Generate Demo Data</span>
              </Button>
            </Link>
            
            <Link href="/demo/workflow">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Play className="h-5 w-5 mb-1" />
                <span className="text-sm">Start Demo</span>
              </Button>
            </Link>
            
            <Link href="/demo/evaluation">
              <Button variant="outline" className="w-full h-16 flex-col">
                <GraduationCap className="h-5 w-5 mb-1" />
                <span className="text-sm">Academic Review</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-16 flex-col">
              <Download className="h-5 w-5 mb-1" />
              <span className="text-sm">Export Results</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-blue-600">100%</p>
            <p className="text-sm text-muted-foreground">TypeScript Coverage</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-green-600">6</p>
            <p className="text-sm text-muted-foreground">Demo Components</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-purple-600">15+</p>
            <p className="text-sm text-muted-foreground">Evaluation Criteria</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-orange-600">4</p>
            <p className="text-sm text-muted-foreground">Demo Scenarios</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Technical Documentation
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security & Privacy
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="h-4 w-4 mr-2" />
              Academic Assessment Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
