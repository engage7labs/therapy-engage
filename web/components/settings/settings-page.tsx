'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, User, Shield, Palette, Globe, Bell } from 'lucide-react'

export function SettingsPage() {
  const settingsCategories = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      items: ['Personal Info', 'Contact Details', 'Professional Credentials']
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Configure security settings and privacy preferences',
      items: ['Password', 'Two-Factor Auth', 'Session Settings', 'Data Privacy']
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel of your dashboard',
      items: ['Theme', 'Layout', 'Dashboard Widgets']
    },
    {
      icon: Globe,
      title: 'Localization',
      description: 'Language and regional settings',
      items: ['Language', 'Time Zone', 'Date Format']
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage alerts and notification preferences',
      items: ['Email Alerts', 'Session Reminders', 'Emergency Notifications']
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm text-gray-500 font-normal">{category.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">{item}</span>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline">Import Settings</Button>
            <Button variant="outline">Reset to Defaults</Button>
            <Button variant="destructive" className="ml-auto">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
