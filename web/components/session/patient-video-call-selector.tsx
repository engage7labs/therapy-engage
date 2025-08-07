'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Phone, Users, Search } from 'lucide-react'
import { useState } from 'react'
import { useKV } from '@/hooks/use-kv'

interface Patient {
  id: string
  name: string
  email: string
  status: 'online' | 'offline' | 'busy'
  lastSeen?: string
}

export function PatientVideoCallSelector() {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients] = useKV('patients-available', [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      status: 'online',
      lastSeen: 'Now'
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      status: 'offline',
      lastSeen: '5 min ago'
    },
    {
      id: '3',
      name: 'Maria Costa',
      email: 'maria.costa@email.com',
      status: 'online',
      lastSeen: 'Now'
    }
  ] as Patient[])

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const initiateVideoCall = (patient: Patient) => {
    console.log(`Starting video call with ${patient.name}`)
    // Here you would integrate with your video calling service
  }

  const initiatePhoneCall = (patient: Patient) => {
    console.log(`Starting phone call with ${patient.name}`)
    // Here you would integrate with your phone service
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-5 w-5" />
          Patient Video Call Selector
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{patient.name}</h4>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                  <p className="text-xs text-gray-400">Last seen: {patient.lastSeen}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(patient.status)}>
                  {patient.status}
                </Badge>
                
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={patient.status === 'offline'}
                    onClick={() => initiateVideoCall(patient)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => initiatePhoneCall(patient)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">
                {searchTerm ? 'No patients found' : 'No patients available'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
