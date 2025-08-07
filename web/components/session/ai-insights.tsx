'use client'

import { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Clock, Mic } from 'lucide-react'

interface InsightData {
  id: string
  type: 'transcription' | 'risk' | 'progress' | 'recommendation'
  timestamp: string
  content: string
  confidence: number
  priority: 'low' | 'moderate' | 'high' | 'critical'
}

interface SessionMetrics {
  duration: string
  wordCount: number
  sentimentScore: number
  engagementLevel: number
  riskAssessment: 'low' | 'moderate' | 'high'
}

interface AIInsightsProps {
  sessionId: string
  isRecording?: boolean
  onInsightAction?: (insight: InsightData) => void
}

export default function AIInsights({ sessionId, isRecording = false, onInsightAction }: AIInsightsProps) {
  const [insights, setInsights] = useState<InsightData[]>([])
  const [metrics] = useState<SessionMetrics>({
    duration: '00:00:00',
    wordCount: 0,
    sentimentScore: 0.7,
    engagementLevel: 0.8,
    riskAssessment: 'low'
  })
  const [activeTab, setActiveTab] = useState<'live' | 'analysis' | 'recommendations'>('live')

  const getProgressWidth = (score: number) => {
    if (score >= 0.8) return 'w-4/5'
    if (score >= 0.6) return 'w-3/5'
    if (score >= 0.4) return 'w-2/5'
    return 'w-1/5'
  }

  // Simular dados em tempo real
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      const newInsight: InsightData = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'transcription' : 'recommendation',
        timestamp: new Date().toISOString(),
        content: generateMockInsight(),
        confidence: Math.random() * 0.4 + 0.6, // 60-100%
        priority: Math.random() > 0.8 ? 'high' : 'moderate'
      }
      
      setInsights(prev => [newInsight, ...prev.slice(0, 9)]) // Keep last 10
    }, 3000)

    return () => clearInterval(interval)
  }, [isRecording])

  const generateMockInsight = () => {
    const insights = [
      "Patient mentions increased anxiety levels this week",
      "Positive response to cognitive behavioral techniques",
      "Patient demonstrates improved emotional regulation",
      "Consider exploring family dynamics in next session",
      "Patient shows signs of breakthrough understanding",
      "Recommend mindfulness exercises for stress management"
    ]
    return insights[Math.floor(Math.random() * insights.length)]
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'transcription': return <Mic className="w-4 h-4" />
      case 'risk': return <AlertTriangle className="w-4 h-4" />
      case 'progress': return <TrendingUp className="w-4 h-4" />
      case 'recommendation': return <Brain className="w-4 h-4" />
      default: return <CheckCircle2 className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
      case 'moderate': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'moderate': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
      default: return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Clinical Insights</h3>
            {isRecording && (
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Recording
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Session: {sessionId.slice(0, 8)}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mt-3">
          {[
            { id: 'live', label: 'Live Feed' },
            { id: 'analysis', label: 'Analysis' },
            { id: 'recommendations', label: 'Recommendations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'live' && (
          <div className="space-y-4">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Session Duration</div>
                <div className="font-mono font-semibold text-foreground">{metrics.duration}</div>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Words Spoken</div>
                <div className="font-semibold text-foreground">{metrics.wordCount.toLocaleString()}</div>
              </div>
            </div>

            {/* Live Insights */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {insights.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {isRecording ? 'Listening for insights...' : 'Start recording to see AI insights'}
                </div>
              ) : (
                insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <span className="text-sm font-medium text-foreground capitalize">
                          {insight.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{insight.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </div>
                      {onInsightAction && (
                        <button
                          onClick={() => onInsightAction(insight)}
                          className="text-xs text-primary hover:text-primary/80"
                        >
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {/* Session Metrics */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sentiment Score</span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(metrics.sentimentScore * 100)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className={`bg-green-500 h-2 rounded-full transition-all duration-300 ${getProgressWidth(metrics.sentimentScore)}`}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Engagement Level</span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(metrics.engagementLevel * 100)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className={`bg-blue-500 h-2 rounded-full transition-all duration-300 ${getProgressWidth(metrics.engagementLevel)}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Assessment</span>
                <span className={`text-sm px-2 py-1 rounded-full font-medium ${getRiskColor(metrics.riskAssessment)}`}>
                  {metrics.riskAssessment.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Key Insights */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Key Insights</h4>
              <div className="space-y-2">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Progress Indicator</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Patient shows 15% improvement in emotional regulation compared to last session
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Breakthrough Moment</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Patient demonstrated significant insight into cognitive patterns
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Clinical Recommendations</h4>
              
              <div className="space-y-2">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Immediate Actions</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Continue exploring anxiety triggers identified today</li>
                    <li>• Assign mindfulness homework for next session</li>
                    <li>• Follow up on coping strategies discussed</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-foreground">Next Session Prep</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Review progress on assigned exercises</li>
                    <li>• Explore family dynamics mentioned today</li>
                    <li>• Consider introducing CBT techniques</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-foreground">Monitoring Points</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Watch for signs of increased anxiety</li>
                    <li>• Monitor sleep patterns mentioned</li>
                    <li>• Track medication compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
