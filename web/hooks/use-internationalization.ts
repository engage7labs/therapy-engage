import { useState, useCallback } from 'react'
import { useKV } from '../hooks/use-kv'
import { 
  SUPPORTED_LOCALES, 
  detectUserLocale, 
  getConsentTranslation, 
  getLocaleByCode,
  type TherapyLocale,
  type ConsentTranslation 
} from '@/lib/i18n-config'

interface UseInternationalizationReturn {
  currentLocale: TherapyLocale
  consentTranslation: ConsentTranslation
  setLocale: (localeCode: string) => void
  supportedLocales: TherapyLocale[]
  translateWithAI: (text: string, targetLocale: string) => Promise<string>
  isRTL: boolean
}

export function useInternationalization(): UseInternationalizationReturn {
  // Persist user's language preference
  const [selectedLocaleCode, setSelectedLocaleCode] = useKV(
    'user-locale-preference', 
    detectUserLocale()
  )

  const currentLocale = getLocaleByCode(selectedLocaleCode) || SUPPORTED_LOCALES[0]
  const consentTranslation = getConsentTranslation(selectedLocaleCode)

  const setLocale = useCallback((localeCode: string) => {
    const locale = getLocaleByCode(localeCode)
    if (locale) {
      setSelectedLocaleCode(localeCode)
      // Update document direction for RTL languages
      if (typeof document !== 'undefined') {
        document.documentElement.dir = locale.direction
        document.documentElement.lang = locale.code
      }
    }
  }, [setSelectedLocaleCode])

  const translateWithAI = useCallback(async (text: string, targetLocale: string): Promise<string> => {
    try {
      const locale = getLocaleByCode(targetLocale)
      if (!locale) return text

      const prompt = spark.llmPrompt`
        Translate the following mental health/therapy consent text to ${locale.nativeName} (${locale.code}).
        
        CRITICAL REQUIREMENTS:
        1. Maintain clinical accuracy and legal terminology
        2. Respect cultural context for ${locale.region} region
        3. Use ${locale.culturalContext.formalityLevel} tone appropriate for therapeutic consent
        4. Preserve all legal obligations and patient rights
        5. Ensure translation is appropriate for ${locale.jurisdiction} jurisdiction
        
        Original text: ${text}
        
        Return only the translated text, maintaining the same structure and meaning.
      `

      const translation = await spark.llm(prompt, 'gpt-4o')
      return translation.trim()
    } catch (error) {
      console.error('Translation failed:', error)
      return text // Fallback to original text
    }
  }, [])

  return {
    currentLocale,
    consentTranslation,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
    translateWithAI,
    isRTL: currentLocale.direction === 'rtl'
  }
}