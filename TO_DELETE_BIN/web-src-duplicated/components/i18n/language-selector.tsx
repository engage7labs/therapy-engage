import { useState } from 'react'
import { useInternationalization } from '@/hooks/use-internationalization'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Globe, Shield, FileText, Languages } from 'lucide-react'

interface LanguageSelectorProps {
  onLanguageChange?: (locale: string) => void
  compact?: boolean
}

export function LanguageSelector({ onLanguageChange, compact = false }: LanguageSelectorProps) {
  const { currentLocale, setLocale, supportedLocales } = useInternationalization()

  const handleLanguageChange = (localeCode: string) => {
    setLocale(localeCode)
    onLanguageChange?.(localeCode)
  }

  if (compact) {
    return (
      <Select value={currentLocale.code} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-48">
          <div className="flex items-center gap-2">
            <Languages size={16} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {supportedLocales.map((locale) => (
            <SelectItem key={locale.code} value={locale.code}>
              <div className="flex items-center gap-2">
                <span>{locale.nativeName}</span>
                <Badge variant="outline" className="text-xs">
                  {locale.region}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="text-primary" />
          Language & Regional Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {supportedLocales.map((locale) => (
            <div
              key={locale.code}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                currentLocale.code === locale.code
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleLanguageChange(locale.code)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-medium">{locale.nativeName}</div>
                  {currentLocale.code === locale.code && (
                    <CheckCircle className="text-primary" size={20} />
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{locale.region}</Badge>
                  <Badge variant="secondary">{locale.jurisdiction}</Badge>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                {locale.name} • {locale.direction.toUpperCase()} text direction
              </div>
              
              <div className="flex flex-wrap gap-1">
                {locale.culturalContext.therapeuticApproach.map((approach) => (
                  <Badge key={approach} variant="outline" className="text-xs">
                    {approach}
                  </Badge>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Formality: {locale.culturalContext.formalityLevel}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Current Selection:</strong> {currentLocale.nativeName}
            <br />
            <strong>Legal Jurisdiction:</strong> {currentLocale.jurisdiction}
            <br />
            <strong>Cultural Context:</strong> {currentLocale.culturalContext.formalityLevel} tone, 
            {currentLocale.culturalContext.therapeuticApproach.join(', ')} approaches
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}