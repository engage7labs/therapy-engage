'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, FileCheck, Download, Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'

interface ConsentRecord {
  id: string
  patientName: string
  type: 'recording' | 'data-processing' | 'research' | 'sharing'
  status: 'pending' | 'granted' | 'revoked' | 'expired'
  dateGranted?: string
  expiryDate?: string
  document?: string
}

export function ConsentManagementDashboard() {
  const [consentRecords] = useKV('consent-records', [
    {
      id: '1',
      patientName: 'Ana Silva',
      type: 'recording',
      status: 'granted',
      dateGranted: '2024-01-15',
      expiryDate: '2024-07-15',
      document: 'consent_ana_silva_recording.pdf'
    },
    {
      id: '2',
      patientName: 'Carlos Santos',
      type: 'data-processing',
      status: 'pending',
      dateGranted: undefined,
      expiryDate: undefined,
      document: undefined
    },
    {
      id: '3',
      patientName: 'Maria Costa',
      type: 'research',
      status: 'granted',
      dateGranted: '2024-01-10',
      expiryDate: '2025-01-10',
      document: 'consent_maria_costa_research.pdf'
    }
  ] as ConsentRecord[])

  const getStatusColor = (status: ConsentRecord['status']) => {
    switch (status) {
      case 'granted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'revoked': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: ConsentRecord['type']) => {
    switch (type) {
      case 'recording': return FileCheck
      case 'data-processing': return Shield
      case 'research': return FileCheck
      case 'sharing': return Shield
      default: return FileCheck
    }
  }

  const downloadDocument = (record: ConsentRecord) => {
    if (record.document) {
      console.log(`Downloading ${record.document}`)
      // Here you would implement document download
    }
  }

  const revokeConsent = (recordId: string) => {
    console.log(`Revoking consent for record ${recordId}`)
    // Here you would implement consent revocation
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Consent Management Dashboard
          </CardTitle>
          <Badge variant="outline">
            {consentRecords.filter(r => r.status === 'granted').length} Active Consents
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consentRecords.map((record) => {
            const TypeIcon = getTypeIcon(record.type)
            const expiringSoon = isExpiringSoon(record.expiryDate)
            
            return (
              <div key={record.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TypeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{record.patientName}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {record.type.replace('-', ' ')} consent
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {expiringSoon && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                  {record.dateGranted && (
                    <div>
                      <span className="font-medium">Granted:</span> {record.dateGranted}
                    </div>
                  )}
                  {record.expiryDate && (
                    <div className={expiringSoon ? 'text-yellow-600' : ''}>
                      <span className="font-medium">Expires:</span> {record.expiryDate}
                      {expiringSoon && ' (Soon)'}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {record.document && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadDocument(record)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  
                  {record.status === 'granted' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => revokeConsent(record.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Revoke
                    </Button>
                  )}
                  
                  {record.status === 'pending' && (
                    <Button size="sm">
                      Process Consent
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
          
          {consentRecords.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Shield className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">No consent records found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
