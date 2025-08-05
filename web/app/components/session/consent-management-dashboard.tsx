import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ConsentRecord {
  id: string
  patientId: string
  sessionId: string
  patientName: string
  timestamp: string
  digitalSignature: string
  ipAddress: string
  videoRecordingConsent: boolean
  audioRecordingConsent: boolean
  transcriptionConsent: boolean
  aiAnalysisConsent: boolean
  dataRetentionConsent: boolean
  researchConsent: boolean
  clinicalUseConsent: boolean
  witnessInfo?: {
    name: string
    relationship: string
    signature: string
  }
  specialConditions?: string
  consentDuration: 'session' | '30-days' | '90-days' | '1-year'
  dataProcessingLocations: string[]
  withdrawalAcknowledged: boolean
  clinicalJustification: string
  status?: 'active' | 'revoked' | 'expired'
  revokedAt?: string
  expiresAt?: string
}

interface AuditLogEntry {
  id: string
  type: string
  sessionId: string
  patientId: string
  timestamp: string
  details: any
}

export function ConsentManagementDashboard() {
  // State management
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked' | 'expired'>('all')
  const [selectedConsent, setSelectedConsent] = useState<ConsentRecord | null>(null)
  const [showAuditLog, setShowAuditLog] = useState(false)

  // Load consent data on mount
  useEffect(() => {
    loadConsentData()
    loadAuditData()
  }, [])

  const loadConsentData = async () => {
    try {
      // Get all keys that start with "consent-"
      const allKeys = await spark.kv.keys()
      const consentKeys = allKeys.filter(key => key.startsWith('consent-') && !key.includes('metadata'))
      
      const consentPromises = consentKeys.map(async (key) => {
        const data = await spark.kv.get<ConsentRecord>(key)
        if (data && data.id) {
          // Check if consent has expired
          const now = new Date()
          const consentDate = new Date(data.timestamp)
          let isExpired = false

          switch (data.consentDuration) {
            case '30-days':
              isExpired = (now.getTime() - consentDate.getTime()) > (30 * 24 * 60 * 60 * 1000)
              break
            case '90-days':
              isExpired = (now.getTime() - consentDate.getTime()) > (90 * 24 * 60 * 60 * 1000)
              break
            case '1-year':
              isExpired = (now.getTime() - consentDate.getTime()) > (365 * 24 * 60 * 60 * 1000)
              break
            case 'session':
              // Session consents don't expire automatically
              isExpired = false
              break
          }

          // Calculate expiration date
          let expiresAt: string | undefined
          if (data.consentDuration !== 'session') {
            const expDate = new Date(consentDate)
            switch (data.consentDuration) {
              case '30-days':
                expDate.setDate(expDate.getDate() + 30)
                break
              case '90-days':
                expDate.setDate(expDate.getDate() + 90)
                break
              case '1-year':
                expDate.setFullYear(expDate.getFullYear() + 1)
                break
            }
            expiresAt = expDate.toISOString()
          }

          return {
            ...data,
            status: data.status === 'revoked' ? 'revoked' : isExpired ? 'expired' : 'active',
            expiresAt
          } as ConsentRecord
        }
        return null
      })

      const consentData = (await Promise.all(consentPromises))
        .filter((consent): consent is ConsentRecord => consent !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setConsents(consentData)
    } catch (error) {
      console.error('Error loading consent data:', error)
      toast.error('Failed to load consent records')
    }
  }

  const loadAuditData = async () => {
    try {
      const auditTrail = await spark.kv.get<AuditLogEntry[]>('audit-trail') || []
      setAuditLog(auditTrail.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ))
    } catch (error) {
      console.error('Error loading audit data:', error)
    }
  }

  const filteredConsents = consents.filter(consent => {
    const matchesSearch = 
      consent.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getConsentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'revoked':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'expired':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPermissionSummary = (consent: ConsentRecord) => {
    const permissions = []
    if (consent.videoRecordingConsent) permissions.push('Video')
    if (consent.audioRecordingConsent) permissions.push('Audio')
    if (consent.transcriptionConsent) permissions.push('Transcription')
    if (consent.aiAnalysisConsent) permissions.push('AI Analysis')
    return permissions.join(', ') || 'None'
  }

  const exportConsentRecord = (consent: ConsentRecord) => {
    const exportData = {
      consentRecord: consent,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Therapist Dashboard',
      complianceNote: 'This export complies with GDPR Article 20 (Right to Data Portability)'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consent-${consent.patientName.replace(/\s+/g, '-')}-${consent.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Consent record exported successfully')
  }

  const revokeConsent = async (consent: ConsentRecord) => {
    try {
      const revokedConsent = {
        ...consent,
        status: 'revoked' as const,
        revokedAt: new Date().toISOString()
      }

      // Update the stored consent
      await spark.kv.set(`consent-${consent.sessionId}`, revokedConsent)

      // Add audit log entry
      const auditEntry = {
        id: `audit-${Date.now()}`,
        type: 'CONSENT_REVOKED_BY_THERAPIST',
        sessionId: consent.sessionId,
        patientId: consent.patientId,
        timestamp: new Date().toISOString(),
        details: {
          originalConsentId: consent.id,
          revokedBy: 'therapist-dashboard',
          reason: 'Administrative revocation'
        }
      }

      const existingAudit = await spark.kv.get<AuditLogEntry[]>('audit-trail') || []
      await spark.kv.set('audit-trail', [...existingAudit, auditEntry])

      // Refresh data
      await loadConsentData()
      await loadAuditData()

      toast.success('Consent revoked successfully')
    } catch (error) {
      console.error('Error revoking consent:', error)
      toast.error('Failed to revoke consent')
    }
  }

  const ConsentDetailModal = ({ consent }: { consent: ConsentRecord }) => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consent Record Details
          </CardTitle>
          <Button 
            onClick={() => setSelectedConsent(null)} 
            variant="outline" 
            size="sm"
          >
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Patient Information</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {consent.patientName}</p>
              <p><span className="font-medium">Patient ID:</span> {consent.patientId}</p>
              <p><span className="font-medium">Session ID:</span> {consent.sessionId}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Consent Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Date:</span> {new Date(consent.timestamp).toLocaleString()}</p>
              <p><span className="font-medium">Duration:</span> {consent.consentDuration}</p>
              <p><span className="font-medium">Status:</span> 
                <Badge className={`ml-2 ${getConsentStatusColor(consent.status || 'active')}`}>
                  {consent.status || 'active'}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div>
          <h4 className="font-medium mb-3">Granted Permissions</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              {consent.videoRecordingConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">Video Recording</span>
            </div>
            <div className="flex items-center gap-2">
              {consent.audioRecordingConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">Audio Recording</span>
            </div>
            <div className="flex items-center gap-2">
              {consent.transcriptionConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">Transcription</span>
            </div>
            <div className="flex items-center gap-2">
              {consent.aiAnalysisConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              {consent.dataRetentionConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">Data Retention</span>
            </div>
            <div className="flex items-center gap-2">
              {consent.researchConsent ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <XCircle className="h-4 w-4 text-red-600" />
              }
              <span className="text-sm">Research Use</span>
            </div>
          </div>
        </div>

        {/* Clinical Justification */}
        <div>
          <h4 className="font-medium mb-2">Clinical Justification</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {consent.clinicalJustification}
          </p>
        </div>

        {/* Special Conditions */}
        {consent.specialConditions && (
          <div>
            <h4 className="font-medium mb-2">Special Conditions</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {consent.specialConditions}
            </p>
          </div>
        )}

        {/* Witness Information */}
        {consent.witnessInfo && (
          <div>
            <h4 className="font-medium mb-2">Witness Information</h4>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <p><span className="font-medium">Name:</span> {consent.witnessInfo.name}</p>
              <p><span className="font-medium">Relationship:</span> {consent.witnessInfo.relationship}</p>
              <p><span className="font-medium">Signature:</span> {consent.witnessInfo.signature}</p>
            </div>
          </div>
        )}

        {/* Digital Signature */}
        <div>
          <h4 className="font-medium mb-2">Digital Signature</h4>
          <p className="text-sm font-mono bg-muted p-2 rounded">
            {consent.digitalSignature}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Signed from IP: {consent.ipAddress} on {new Date(consent.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={() => exportConsentRecord(consent)} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Record
          </Button>
          {consent.status === 'active' && (
            <Button 
              onClick={() => revokeConsent(consent)} 
              variant="destructive"
            >
              Revoke Consent
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (selectedConsent) {
    return <ConsentDetailModal consent={selectedConsent} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Consent Management Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage patient consent records and audit trail for therapy session recordings
          </p>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {consents.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Consents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {consents.filter(c => c.status === 'revoked').length}
                </p>
                <p className="text-sm text-muted-foreground">Revoked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {consents.filter(c => c.status === 'expired').length}
                </p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{consents.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, session ID, or consent ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>

            <Button 
              onClick={() => setShowAuditLog(!showAuditLog)} 
              variant="outline"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAuditLog ? 'Hide' : 'Show'} Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      {showAuditLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditLog.slice(0, 20).map(entry => (
                <div key={entry.id} className="flex items-center gap-3 text-sm p-2 bg-muted rounded">
                  <Badge variant="outline">{entry.type}</Badge>
                  <span className="flex-1">{entry.sessionId}</span>
                  <span className="text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consent Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredConsents.map(consent => (
              <div key={consent.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{consent.patientName}</h4>
                      <Badge className={getConsentStatusColor(consent.status || 'active')}>
                        {consent.status || 'active'}
                      </Badge>
                      <Badge variant="outline">{consent.consentDuration}</Badge>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                      <span>Session: {consent.sessionId}</span>
                      <span>Signed: {new Date(consent.timestamp).toLocaleDateString()}</span>
                      <span>Permissions: {getPermissionSummary(consent)}</span>
                    </div>
                    
                    {consent.expiresAt && (
                      <p className="text-xs text-orange-600 mt-1">
                        Expires: {new Date(consent.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setSelectedConsent(consent)} 
                      size="sm" 
                      variant="outline"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => exportConsentRecord(consent)} 
                      size="sm" 
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredConsents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No consent records found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}