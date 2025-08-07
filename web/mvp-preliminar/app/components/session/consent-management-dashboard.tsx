import * as React from 'react'
import { useKV } from '@/hooks/use-kv'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Clock
} from 'lucide-react'

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

interface ConsentDetailModalProps {
  readonly consent: ConsentRecord
  readonly onClose: () => void
  readonly onExport: (consent: ConsentRecord) => void
  readonly onRevoke: (consent: ConsentRecord) => void
  readonly getConsentStatusColor: (status: string) => string
}

const ConsentDetailModal = ({ consent, onClose, onExport, onRevoke, getConsentStatusColor }: ConsentDetailModalProps) => (
  <Card className="max-w-4xl mx-auto">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Consent Record Details
        </CardTitle>
        <Button 
          onClick={onClose} 
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
        <Button onClick={() => onExport(consent)} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Record
        </Button>
        {consent.status === 'active' && (
          <Button 
            onClick={() => onRevoke(consent)} 
            variant="destructive"
          >
            Revoke Consent
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
)

export function ConsentManagementDashboard() {
  // State management using useKV for persistence
  const [consents, setConsents] = useKV<ConsentRecord[]>('consent-records', [])
  const [auditLog, setAuditLog] = useKV<AuditLogEntry[]>('audit-trail', [])
  const [searchTerm, setSearchTerm] = useKV<string>('consent-search', '')
  const [statusFilter, setStatusFilter] = useKV<string>('consent-status-filter', 'all')
  const [selectedConsent, setSelectedConsent] = useKV<ConsentRecord | null>('selected-consent', null)
  const [showAuditLog, setShowAuditLog] = useKV<boolean>('show-audit-log', false)

  // Sample data initialization
  React.useEffect(() => {
    if (consents.length === 0) {
      const sampleConsents: ConsentRecord[] = [
        {
          id: 'consent-001',
          patientId: 'patient-001',
          sessionId: 'session-001',
          patientName: 'Ana Silva',
          timestamp: '2025-01-15T10:00:00Z',
          digitalSignature: 'digital-signature-hash-abc123',
          ipAddress: '192.168.1.100',
          videoRecordingConsent: true,
          audioRecordingConsent: true,
          transcriptionConsent: true,
          aiAnalysisConsent: false,
          dataRetentionConsent: true,
          researchConsent: false,
          clinicalUseConsent: true,
          consentDuration: '90-days',
          dataProcessingLocations: ['EU', 'Brazil'],
          withdrawalAcknowledged: true,
          clinicalJustification: 'Required for therapeutic analysis and improvement',
          status: 'active'
        },
        {
          id: 'consent-002',
          patientId: 'patient-002',
          sessionId: 'session-002',
          patientName: 'João Oliveira',
          timestamp: '2025-01-14T14:30:00Z',
          digitalSignature: 'digital-signature-hash-def456',
          ipAddress: '192.168.1.102',
          videoRecordingConsent: true,
          audioRecordingConsent: true,
          transcriptionConsent: false,
          aiAnalysisConsent: true,
          dataRetentionConsent: true,
          researchConsent: true,
          clinicalUseConsent: true,
          consentDuration: '90-days',
          dataProcessingLocations: ['EU'],
          withdrawalAcknowledged: true,
          clinicalJustification: 'Essential for long-term treatment planning',
          status: 'expired',
          witnessInfo: {
            name: 'Maria Oliveira',
            relationship: 'Spouse',
            signature: 'witness-signature-hash-789'
          }
        }
      ]
      setConsents(sampleConsents)
    }

    if (auditLog.length === 0) {
      const sampleAuditLog: AuditLogEntry[] = [
        {
          id: 'audit-001',
          type: 'CONSENT_GIVEN',
          sessionId: 'session-001',
          patientId: 'patient-001',
          timestamp: '2025-01-15T10:00:00Z',
          details: {
            permissions: ['video', 'audio', 'transcription'],
            duration: '90-days'
          }
        },
        {
          id: 'audit-002',
          type: 'CONSENT_MODIFIED',
          sessionId: 'session-002',
          patientId: 'patient-002',
          timestamp: '2025-01-14T15:00:00Z',
          details: {
            changedPermissions: ['aiAnalysis'],
            previousValue: false,
            newValue: true
          }
        }
      ]
      setAuditLog(sampleAuditLog)
    }
  }, [consents.length, auditLog.length, setConsents, setAuditLog])

  // Filter consents based on search and status
  const filteredConsents = consents.filter(consent => {
    const matchesSearch = consent.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consent.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
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
    if (consent.dataRetentionConsent) permissions.push('Data Retention')
    if (consent.researchConsent) permissions.push('Research')
    return permissions.join(', ') || 'None'
  }

  const exportConsentRecord = (consent: ConsentRecord) => {
    const dataToExport = {
      consentRecord: consent,
      exportedAt: new Date().toISOString(),
      exportedBy: 'therapist-dashboard'
    }
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
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

    console.log('✅ Consent record exported successfully')
  }

  const revokeConsent = async (consent: ConsentRecord) => {
    try {
      const revokedConsent = {
        ...consent,
        status: 'revoked' as const,
        revokedAt: new Date().toISOString()
      }

      // Update the consents array
      const updatedConsents = consents.map(c => 
        c.id === consent.id ? revokedConsent : c
      )
      setConsents(updatedConsents)

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

      setAuditLog([auditEntry, ...auditLog])

      console.log('✅ Consent revoked successfully')
    } catch (error) {
      console.error('❌ Error revoking consent:', error)
    }
  }
  return (
    <div className="space-y-6">
      {selectedConsent ? (
        <ConsentDetailModal
          consent={selectedConsent}
          onClose={() => setSelectedConsent(null)}
          onExport={exportConsentRecord}
          onRevoke={revokeConsent}
          getConsentStatusColor={getConsentStatusColor}
        />
      ) : (
        <>
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
              title="Filter by consent status"
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
      </>
      )}
    </div>
  )
}