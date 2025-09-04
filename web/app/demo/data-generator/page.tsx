'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Database,
  Users,
  Calendar,
  FileText,
  Brain,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

interface DemoDataSet {
  id: string
  name: string
  description: string
  category: 'patients' | 'sessions' | 'analytics' | 'compliance'
  recordCount: number
  isGenerated: boolean
  lastGenerated?: string
}

interface GenerationStats {
  patients: number
  therapists: number
  sessions: number
  recordings: number
  notes: number
}

export default function DemoDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedStats, setGeneratedStats] = useState<GenerationStats | null>(null)

  const demoDataSets: DemoDataSet[] = [
    {
      id: 'patients-basic',
      name: 'Patient Demographics',
      description: 'Basic patient information, demographics, and treatment history',
      category: 'patients',
      recordCount: 25,
      isGenerated: false
    },
    {
      id: 'patients-advanced',
      name: 'Patient Clinical Data',
      description: 'Detailed clinical assessments, diagnoses, and treatment plans',
      category: 'patients',
      recordCount: 15,
      isGenerated: false
    },
    {
      id: 'sessions-routine',
      name: 'Routine Therapy Sessions',
      description: 'Standard 50-minute therapy sessions with typical progress',
      category: 'sessions',
      recordCount: 150,
      isGenerated: false
    },
    {
      id: 'sessions-crisis',
      name: 'Crisis Intervention Sessions',
      description: 'Emergency sessions, risk assessments, and safety planning',
      category: 'sessions',
      recordCount: 12,
      isGenerated: false
    },
    {
      id: 'analytics-engagement',
      name: 'Patient Engagement Analytics',
      description: 'Session attendance, completion rates, and engagement metrics',
      category: 'analytics',
      recordCount: 300,
      isGenerated: false
    },
    {
      id: 'analytics-outcomes',
      name: 'Treatment Outcome Data',
      description: 'Progress tracking, assessment scores, and treatment effectiveness',
      category: 'analytics',
      recordCount: 200,
      isGenerated: false
    },
    {
      id: 'compliance-gdpr',
      name: 'GDPR Compliance Records',
      description: 'Consent forms, data processing logs, and privacy documentation',
      category: 'compliance',
      recordCount: 100,
      isGenerated: false
    },
    {
      id: 'compliance-audit',
      name: 'Audit Trail Data',
      description: 'System access logs, data modifications, and security events',
      category: 'compliance',
      recordCount: 500,
      isGenerated: false
    }
  ]

  const [dataSets, setDataSets] = useState<DemoDataSet[]>(demoDataSets)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'patients': return <Users className="h-4 w-4" />
      case 'sessions': return <Calendar className="h-4 w-4" />
      case 'analytics': return <Brain className="h-4 w-4" />
      case 'compliance': return <FileText className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'patients': return 'bg-blue-500'
      case 'sessions': return 'bg-green-500'
      case 'analytics': return 'bg-purple-500'
      case 'compliance': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const generateDataSet = async (dataSetId: string) => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate data generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 200)

    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update dataset status
    setDataSets(prev => prev.map(ds => 
      ds.id === dataSetId 
        ? { ...ds, isGenerated: true, lastGenerated: new Date().toISOString() }
        : ds
    ))

    clearInterval(progressInterval)
    setGenerationProgress(100)
    setIsGenerating(false)

    // Show completion stats
    setTimeout(() => {
      setGeneratedStats({
        patients: Math.floor(Math.random() * 25) + 10,
        therapists: Math.floor(Math.random() * 8) + 3,
        sessions: Math.floor(Math.random() * 150) + 50,
        recordings: Math.floor(Math.random() * 100) + 30,
        notes: Math.floor(Math.random() * 200) + 80
      })
    }, 500)
  }

  const generateAllData = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const totalSets = dataSets.length
    let completed = 0

    for (const dataSet of dataSets) {
      await new Promise(resolve => setTimeout(resolve, 800))
      completed++
      setGenerationProgress((completed / totalSets) * 100)
      
      setDataSets(prev => prev.map(ds => 
        ds.id === dataSet.id 
          ? { ...ds, isGenerated: true, lastGenerated: new Date().toISOString() }
          : ds
      ))
    }

    setIsGenerating(false)
    setGeneratedStats({
      patients: 45,
      therapists: 8,
      sessions: 385,
      recordings: 220,
      notes: 680
    })
  }

  const clearAllData = () => {
    setDataSets(prev => prev.map(ds => ({ ...ds, isGenerated: false, lastGenerated: undefined })))
    setGeneratedStats(null)
  }

  const exportData = () => {
    // Simulate data export
    const data = {
      datasets: dataSets.filter(ds => ds.isGenerated),
      stats: generatedStats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'therapy-engage-demo-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6" />
            Demo Data Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate realistic demo data for academic evaluation and platform demonstration
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={generateAllData} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating... {Math.round(generationProgress)}%
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Generate All Data
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearAllData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button 
              variant="outline" 
              onClick={exportData}
              disabled={!generatedStats}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Generating Demo Data...</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(generationProgress)}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Stats */}
      {generatedStats && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Data Generation Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{generatedStats.patients}</p>
                <p className="text-sm text-green-600">Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{generatedStats.therapists}</p>
                <p className="text-sm text-green-600">Therapists</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{generatedStats.sessions}</p>
                <p className="text-sm text-green-600">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{generatedStats.recordings}</p>
                <p className="text-sm text-green-600">Recordings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-800">{generatedStats.notes}</p>
                <p className="text-sm text-green-600">Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sets */}
      <div className="grid gap-4 md:grid-cols-2">
        {dataSets.map((dataSet) => (
          <Card key={dataSet.id} className={dataSet.isGenerated ? 'border-green-200' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${getCategoryColor(dataSet.category)}`}>
                    {getCategoryIcon(dataSet.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{dataSet.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {dataSet.category} • {dataSet.recordCount} records
                    </p>
                  </div>
                </div>
                {dataSet.isGenerated && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {dataSet.description}
              </p>
              
              {dataSet.lastGenerated && (
                <p className="text-xs text-muted-foreground mb-3">
                  Last generated: {new Date(dataSet.lastGenerated).toLocaleString()}
                </p>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => generateDataSet(dataSet.id)}
                  disabled={isGenerating}
                  variant={dataSet.isGenerated ? 'outline' : 'default'}
                >
                  {dataSet.isGenerated ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
                
                {dataSet.isGenerated && (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Existing Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Import previously exported demo data or use custom datasets for evaluation
            </p>
            <div className="flex gap-4">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import JSON File
              </Button>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Load Sample Dataset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
