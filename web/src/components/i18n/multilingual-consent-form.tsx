import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useInternationalization } from '@/hooks/use-internationalization'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Globe,
  Signature,
  Eye,
  Download
} from '@phosphor-icons/react'

interface MultilingualConsentFormProps {
  sessionId: string
  patientId: string
  patientName: string
  therapistId: string
  onConsentCompleted?: (consentData: any) => void
}

interface ConsentState {
  sectionsRead: Set<string>
  sectionsAgreed: Set<string>
  finalConsent: boolean
  signatureTimestamp?: string
  localeAtConsent: string
}

export function MultilingualConsentForm({
  sessionId,
  patientId,
  patientName,
  therapistId,
  onConsentCompleted
}: MultilingualConsentFormProps) {
  const { currentLocale, consentTranslation, translateWithAI, isRTL } = useInternationalization()
  
  // Persist consent state
  const [consentState, setConsentState] = useKV<ConsentState>(`consent-${sessionId}-${patientId}`, {
    sectionsRead: new Set(),
    sectionsAgreed: new Set(),
    finalConsent: false,
    localeAtConsent: currentLocale.code
  })

  const [isTranslating, setIsTranslating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSignature, setShowSignature] = useState(false)

  const requiredSections = [
    'description',
    'details', 
    'risks',
    'benefits',
    'patientRights',
    'dataProcessing',
    'withdrawal'
  ]

  const totalSections = requiredSections.length
  const readSections = Array.from(consentState.sectionsRead).filter(s => requiredSections.includes(s)).length
  const agreedSections = Array.from(consentState.sectionsAgreed).filter(s => requiredSections.includes(s)).length
  const progressPercentage = (readSections / totalSections) * 100

  const markSectionRead = (sectionId: string) => {
    setConsentState(prev => ({
      ...prev,
      sectionsRead: new Set([...prev.sectionsRead, sectionId])
    }))
  }

  const toggleSectionAgreement = (sectionId: string, agreed: boolean) => {
    setConsentState(prev => {
      const newAgreed = new Set(prev.sectionsAgreed)
      if (agreed) {
        newAgreed.add(sectionId)
      } else {
        newAgreed.delete(sectionId)
      }
      return {
        ...prev,
        sectionsAgreed: newAgreed
      }
    })
  }

  const translateSection = async (sectionKey: string, content: string | string[]) => {
    setIsTranslating(true)
    try {
      if (Array.isArray(content)) {
        const translations = await Promise.all(
          content.map(item => translateWithAI(item, currentLocale.code))
        )
        return translations
      } else {
        return await translateWithAI(content, currentLocale.code)
      }
    } catch (error) {
      toast.error('Translation failed. Showing original content.')
      return content
    } finally {
      setIsTranslating(false)
    }
  }

  const handleFinalSignature = async () => {
    if (agreedSections < totalSections) {
      toast.error('Please read and agree to all sections before signing.')
      return
    }

    const signatureTimestamp = new Date().toISOString()
    const finalConsentData = {
      ...consentState,
      finalConsent: true,
      signatureTimestamp,
      localeAtConsent: currentLocale.code,
      jurisdiction: currentLocale.jurisdiction,
      patientInfo: {
        id: patientId,
        name: patientName,
        locale: currentLocale.code
      },
      therapistInfo: {
        id: therapistId
      },
      sessionInfo: {
        id: sessionId,
        consentVersion: '2.1',
        legalBasis: currentLocale.jurisdiction
      }
    }

    setConsentState(finalConsentData)
    onConsentCompleted?.(finalConsentData)
    
    toast.success('Consent successfully recorded with legal validity.')
  }

  const canProceedToSignature = agreedSections === totalSections && readSections === totalSections

  const renderSection = (
    sectionKey: string, 
    title: string, 
    content: string | string[], 
    isRequired: boolean = true
  ) => {
    const isRead = consentState.sectionsRead.has(sectionKey)
    const isAgreed = consentState.sectionsAgreed.has(sectionKey)
    
    return (
      <Card key={sectionKey} className={`transition-all ${isRead ? 'border-primary/30' : ''}`}>
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Eye 
                className={isRead ? 'text-primary' : 'text-muted-foreground'} 
                size={20} 
              />
              <span>{title}</span>
              {isRequired && <Badge variant="outline">Required</Badge>}
            </div>
            {isRead && <CheckCircle className="text-primary" size={20} />}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ScrollArea 
            className="h-32 w-full border rounded p-3"
            onMouseEnter={() => markSectionRead(sectionKey)}
          >
            <div className={`text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              {Array.isArray(content) ? (
                <ul className={`space-y-2 ${isRTL ? 'list-disc list-inside' : 'list-disc ml-4'}`}>
                  {content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{content}</p>
              )}
            </div>
          </ScrollArea>
          
          {isRequired && isRead && (
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Checkbox
                id={`agree-${sectionKey}`}
                checked={isAgreed}
                onCheckedChange={(checked) => toggleSectionAgreement(sectionKey, checked as boolean)}
              />
              <label 
                htmlFor={`agree-${sectionKey}`}
                className="text-sm font-medium cursor-pointer"
              >
                I understand and agree to this section
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (consentState.finalConsent) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle />
            Consent Successfully Recorded
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your consent has been legally recorded and securely stored according to{' '}
              <strong>{currentLocale.jurisdiction}</strong> regulations.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Patient:</strong> {patientName}
            </div>
            <div>
              <strong>Session:</strong> {sessionId}
            </div>
            <div>
              <strong>Language:</strong> {currentLocale.nativeName}
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date(consentState.signatureTimestamp!).toLocaleString()}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.print()}
          >
            <Download className="mr-2" size={16} />
            Download Consent Record
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <FileText className="text-primary" />
            {consentTranslation.sections.title}
          </CardTitle>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe size={14} />
              {currentLocale.nativeName}
            </Badge>
            <Badge variant="secondary">
              {currentLocale.jurisdiction}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {consentTranslation.sections.description}
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{readSections}/{totalSections} sections read</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {consentTranslation.jurisdictionNotice}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Consent Sections */}
      <div className="space-y-4">
        {renderSection('details', 'Service Details', consentTranslation.sections.details)}
        {renderSection('risks', 'Potential Risks', consentTranslation.sections.risks)}
        {renderSection('benefits', 'Expected Benefits', consentTranslation.sections.benefits)}
        {renderSection('patientRights', 'Your Rights', consentTranslation.sections.patientRights)}
        {renderSection('dataProcessing', 'Data Processing', consentTranslation.sections.dataProcessing)}
        {renderSection('withdrawal', 'Consent Withdrawal', consentTranslation.sections.withdrawal, false)}
      </div>

      {/* Emergency Contact */}
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency Contact:</strong> {consentTranslation.emergencyContact}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Final Signature */}
      {canProceedToSignature && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Signature className="text-primary" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                By clicking "Sign Consent", you confirm that you have read, understood, and agree to all sections above. 
                This creates a legally binding consent under {currentLocale.jurisdiction} law.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleFinalSignature}
                className="flex-1"
                size="lg"
              >
                <Signature className="mr-2" />
                Sign Consent - {patientName}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {consentTranslation.legalDisclaimer}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}