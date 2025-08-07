'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MessageCircle, AlertTriangle, ExternalLink } from 'lucide-react'

export function EmergencyWhatsAppContact() {
  const emergencyContacts = [
    {
      name: 'Crisis Hotline',
      number: '+351912345678',
      description: 'National mental health crisis line',
      type: 'crisis',
      available: '24/7'
    },
    {
      name: 'Emergency Services',
      number: '+351112',
      description: 'Emergency medical services',
      type: 'emergency',
      available: '24/7'
    },
    {
      name: 'Backup Therapist',
      number: '+351987654321',
      description: 'Dr. Maria Santos - On-call therapist',
      type: 'therapist',
      available: 'Mon-Fri 9-18h'
    }
  ]

  const getContactColor = (type: string) => {
    switch (type) {
      case 'crisis': return 'bg-red-100 text-red-800'
      case 'emergency': return 'bg-orange-100 text-orange-800'
      case 'therapist': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleWhatsAppCall = (number: string, name: string) => {
    const message = encodeURIComponent(`Emergency contact from Therapy Engage Platform. Patient requires immediate assistance.`)
    const whatsappUrl = `https://wa.me/${number.replace(/\+/g, '')}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhoneCall = (number: string) => {
    window.open(`tel:${number}`, '_self')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-green-500" />
          Emergency WhatsApp Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium">{contact.name}</h4>
                    <Badge className={getContactColor(contact.type)}>
                      {contact.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{contact.description}</p>
                  <p className="text-xs text-gray-400">Available: {contact.available}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-mono font-medium">{contact.number}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  onClick={() => handleWhatsAppCall(contact.number, contact.name)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => handlePhoneCall(contact.number)}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Emergency Protocol</span>
          </div>
          <p className="text-xs text-red-700 mt-1">
            For immediate life-threatening situations, always call emergency services first (112).
            Use WhatsApp contacts for mental health crisis support.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
