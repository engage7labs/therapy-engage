import { useTheme } from '../../contexts/theme-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ThemeLanguageSettings } from '../settings/theme-language-settings'
import { SessionSecuritySettings } from '../settings/session-security-settings'
import { InlineThemeLanguageControls } from '../settings/quick-theme-language-toggle'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Settings, Palette, Globe, User, Shield, Bell, Info } from 'lucide-react'

export function SettingsPage() {
  const { t, theme, language } = useTheme()

  const settingsSections = [
    {
      id: 'appearance',
      title: 'Appearance & Language',
      description: 'Customize your visual experience and language preferences',
      icon: Palette,
      component: <ThemeLanguageSettings />
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      description: 'Manage your professional profile and credentials',
      icon: User,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
            <CardDescription>Your clinical credentials and contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-lg font-semibold">Dr. Smith</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-lg font-semibold">CRP-123456</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary">Clinical Psychology</Badge>
                  <Badge variant="secondary">Cognitive Behavioral Therapy</Badge>
                </div>
              </div>
              <Button className="mt-4">Edit2 Profile</Button>
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'security',
      title: 'Session Security & Timeout',
      description: 'Configure session timeout, activity monitoring, and security settings',
      icon: Shield,
      component: <SessionSecuritySettings />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts and notification preferences',
      icon: Bell,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control when and how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Critical Patient Alerts</p>
                  <p className="text-sm text-muted-foreground">High-priority patient situations</p>
                </div>
                <Badge variant="destructive">Always On</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Session Reminders</p>
                  <p className="text-sm text-muted-foreground">Upcoming appointment notifications</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">WhatsApp Emergency</p>
                  <p className="text-sm text-muted-foreground">Emergency contact via WhatsApp</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <Button className="mt-4">Configure Alerts</Button>
            </div>
          </CardContent>
        </Card>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.settings')}</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InlineThemeLanguageControls />
        </div>
      </div>

      {/* Current Settings Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Current Configuration</CardTitle>
              <CardDescription>Your active settings overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Theme</span>
              </div>
              <Badge variant={theme === 'dark' ? 'secondary' : 'default'}>
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <Badge variant="outline">
                {language === 'en' && '🇺🇸 English'}
                {language === 'pt' && '🇧🇷 Português'}
                {language === 'es' && '🇪🇸 Español'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <div key={section.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
            
            {section.component}
            
            {index < settingsSections.length - 1 && <Separator className="my-8" />}
          </div>
        ))}
      </div>

      {/* Footer Information */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Settings Information</p>
              <p className="text-xs text-muted-foreground">
                All settings are automatically saved and synchronized across your devices. 
                Changes to language and theme take effect immediately. For security-related 
                settings, additional verification may be required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}