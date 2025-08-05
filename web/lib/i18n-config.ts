// International localization configuration for therapy consent workflows
export interface TherapyLocale {
  code: string
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  region: string
  jurisdiction: string
  culturalContext: {
    formalityLevel: 'formal' | 'informal'
    therapeuticApproach: string[]
    consentExpectations: string[]
  }
}

export const SUPPORTED_LOCALES: TherapyLocale[] = [
  {
    code: 'en-IE',
    name: 'English (Ireland)',
    nativeName: 'English (Ireland)',
    direction: 'ltr',
    region: 'Europe',
    jurisdiction: 'EU-GDPR',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['CBT', 'Psychodynamic', 'Humanistic'],
      consentExpectations: ['detailed-explanation', 'patient-rights-emphasis', 'data-protection-primary']
    }
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (Brasil)',
    direction: 'ltr',
    region: 'South America', 
    jurisdiction: 'BR-LGPD',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['CBT', 'Family-therapy', 'Gestalt'],
      consentExpectations: ['family-involvement-consideration', 'religious-sensitivity', 'socioeconomic-awareness']
    }
  },
  {
    code: 'es-ES',
    name: 'Spanish (Spain)',
    nativeName: 'Español (España)',
    direction: 'ltr',
    region: 'Europe',
    jurisdiction: 'EU-GDPR',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['CBT', 'Psychodynamic', 'Systemic'],
      consentExpectations: ['family-consultation', 'medical-integration', 'cultural-values-respect']
    }
  },
  {
    code: 'fr-FR',
    name: 'French (France)',
    nativeName: 'Français (France)',
    direction: 'ltr',
    region: 'Europe',
    jurisdiction: 'EU-GDPR',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['Psychoanalytic', 'CBT', 'Existential'],
      consentExpectations: ['intellectual-discourse', 'philosophical-framework', 'privacy-paramount']
    }
  },
  {
    code: 'de-DE',
    name: 'German (Germany)',
    nativeName: 'Deutsch (Deutschland)',
    direction: 'ltr',
    region: 'Europe',
    jurisdiction: 'EU-GDPR',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['CBT', 'Behavioral', 'Depth-psychology'],
      consentExpectations: ['systematic-approach', 'detailed-documentation', 'professional-boundaries']
    }
  },
  {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية (السعودية)',
    direction: 'rtl',
    region: 'Middle East',
    jurisdiction: 'SA-PDPL',
    culturalContext: {
      formalityLevel: 'formal',
      therapeuticApproach: ['Islamic-psychology', 'CBT', 'Family-therapy'],
      consentExpectations: ['religious-integration', 'family-honor', 'gender-considerations']
    }
  }
]

export interface ConsentTranslation {
  locale: string
  sections: {
    title: string
    description: string
    details: string[]
    risks: string[]
    benefits: string[]
    alternatives: string[]
    patientRights: string[]
    dataProcessing: string[]
    withdrawal: string
    signatures: {
      patient: string
      therapist: string
      witness?: string
    }
  }
  legalDisclaimer: string
  emergencyContact: string
  jurisdictionNotice: string
}

export const CONSENT_TRANSLATIONS: Record<string, ConsentTranslation> = {
  'en-IE': {
    locale: 'en-IE',
    sections: {
      title: 'Informed Consent for Psychological Services',
      description: 'This document provides important information about psychological services and your rights as a client under Irish and EU law.',
      details: [
        'Psychological services include assessment, therapy, and treatment planning',
        'Sessions will be recorded for quality assurance and AI-assisted insights',
        'Your personal data will be processed in accordance with GDPR',
        'You have the right to access, rectify, or delete your personal data'
      ],
      risks: [
        'Psychological therapy may initially increase emotional distress',
        'Some therapeutic techniques may bring up difficult memories',
        'Progress in therapy cannot be guaranteed',
        'Confidentiality may be breached in cases of imminent danger'
      ],
      benefits: [
        'Improved emotional regulation and coping skills',
        'Better understanding of personal patterns and behaviors',
        'Enhanced quality of life and relationships',
        'Professional support during difficult times'
      ],
      alternatives: [
        'Self-help resources and books',
        'Support groups and peer counseling',
        'Medical consultation with your GP',
        'Alternative therapeutic approaches'
      ],
      patientRights: [
        'Right to informed consent and refusal of treatment',
        'Right to confidentiality within legal limits',
        'Right to access your clinical records',
        'Right to lodge a complaint with the Data Protection Commission'
      ],
      dataProcessing: [
        'Session recordings are encrypted and stored securely',
        'AI analysis is performed with anonymized data',
        'Data is retained for 7 years as required by Irish law',
        'You may request data deletion subject to legal obligations'
      ],
      withdrawal: 'You may withdraw consent at any time by providing written notice to your therapist.',
      signatures: {
        patient: 'Patient Signature',
        therapist: 'Licensed Therapist Signature'
      }
    },
    legalDisclaimer: 'This consent form complies with Irish psychological practice standards and EU GDPR requirements.',
    emergencyContact: 'In case of emergency, contact: Samaritans Ireland 116 123 (free, 24/7)',
    jurisdictionNotice: 'This agreement is governed by Irish law and EU regulations.'
  },
  'pt-BR': {
    locale: 'pt-BR',
    sections: {
      title: 'Termo de Consentimento Livre e Esclarecido para Serviços Psicológicos',
      description: 'Este documento fornece informações importantes sobre os serviços psicológicos e seus direitos como cliente sob a lei brasileira e LGPD.',
      details: [
        'Os serviços psicológicos incluem avaliação, terapia e planejamento de tratamento',
        'As sessões serão gravadas para garantia de qualidade e insights assistidos por IA',
        'Seus dados pessoais serão processados de acordo com a LGPD',
        'Você tem o direito de acessar, retificar ou excluir seus dados pessoais'
      ],
      risks: [
        'A terapia psicológica pode inicialmente aumentar o sofrimento emocional',
        'Algumas técnicas terapêuticas podem trazer memórias difíceis',
        'O progresso na terapia não pode ser garantido',
        'A confidencialidade pode ser quebrada em casos de perigo iminente'
      ],
      benefits: [
        'Melhoria na regulação emocional e habilidades de enfrentamento',
        'Melhor compreensão de padrões e comportamentos pessoais',
        'Qualidade de vida e relacionamentos aprimorados',
        'Suporte profissional durante momentos difíceis'
      ],
      alternatives: [
        'Recursos de autoajuda e livros',
        'Grupos de apoio e aconselhamento de pares',
        'Consulta médica com seu clínico geral',
        'Abordagens terapêuticas alternativas'
      ],
      patientRights: [
        'Direito ao consentimento informado e recusa de tratamento',
        'Direito à confidencialidade dentro dos limites legais',
        'Direito de acesso aos seus registros clínicos',
        'Direito de apresentar queixa à Autoridade Nacional de Proteção de Dados'
      ],
      dataProcessing: [
        'Gravações de sessões são criptografadas e armazenadas com segurança',
        'Análise de IA é realizada com dados anonimizados',
        'Dados são mantidos por 20 anos conforme exigido pela lei brasileira',
        'Você pode solicitar exclusão de dados sujeito a obrigações legais'
      ],
      withdrawal: 'Você pode retirar o consentimento a qualquer momento fornecendo aviso por escrito ao seu terapeuta.',
      signatures: {
        patient: 'Assinatura do Paciente',
        therapist: 'Assinatura do Psicólogo Licenciado'
      }
    },
    legalDisclaimer: 'Este termo de consentimento cumpre os padrões brasileiros de prática psicológica e requisitos da LGPD.',
    emergencyContact: 'Em caso de emergência, contate: CVV 188 (gratuito, 24h)',
    jurisdictionNotice: 'Este acordo é regido pela lei brasileira e regulamentações da LGPD.'
  },
  'es-ES': {
    locale: 'es-ES',
    sections: {
      title: 'Consentimiento Informado para Servicios Psicológicos',
      description: 'Este documento proporciona información importante sobre los servicios psicológicos y sus derechos como cliente bajo la ley española y el RGPD de la UE.',
      details: [
        'Los servicios psicológicos incluyen evaluación, terapia y planificación del tratamiento',
        'Las sesiones serán grabadas para garantía de calidad e insights asistidos por IA',
        'Sus datos personales serán procesados de acuerdo con el RGPD',
        'Tiene derecho a acceder, rectificar o eliminar sus datos personales'
      ],
      risks: [
        'La terapia psicológica puede inicialmente aumentar el malestar emocional',
        'Algunas técnicas terapéuticas pueden traer recuerdos difíciles',
        'El progreso en terapia no puede ser garantizado',
        'La confidencialidad puede romperse en casos de peligro inminente'
      ],
      benefits: [
        'Mejora en la regulación emocional y habilidades de afrontamiento',
        'Mejor comprensión de patrones y comportamientos personales',
        'Calidad de vida y relaciones mejoradas',
        'Apoyo profesional durante momentos difíciles'
      ],
      alternatives: [
        'Recursos de autoayuda y libros',
        'Grupos de apoyo y consejería entre pares',
        'Consulta médica con su médico de cabecera',
        'Enfoques terapéuticos alternativos'
      ],
      patientRights: [
        'Derecho al consentimiento informado y rechazo del tratamiento',
        'Derecho a la confidencialidad dentro de los límites legales',
        'Derecho a acceder a sus registros clínicos',
        'Derecho a presentar una queja ante la Agencia Española de Protección de Datos'
      ],
      dataProcessing: [
        'Las grabaciones de sesiones están encriptadas y almacenadas de forma segura',
        'El análisis de IA se realiza con datos anonimizados',
        'Los datos se conservan durante 5 años según la ley española',
        'Puede solicitar la eliminación de datos sujeto a obligaciones legales'
      ],
      withdrawal: 'Puede retirar el consentimiento en cualquier momento proporcionando aviso por escrito a su terapeuta.',
      signatures: {
        patient: 'Firma del Paciente',
        therapist: 'Firma del Psicólogo Licenciado'
      }
    },
    legalDisclaimer: 'Este formulario de consentimiento cumple con los estándares españoles de práctica psicológica y requisitos del RGPD de la UE.',
    emergencyContact: 'En caso de emergencia, contacte: Teléfono de la Esperanza 717 003 717',
    jurisdictionNotice: 'Este acuerdo se rige por la ley española y las regulaciones de la UE.'
  }
}

export const getLocaleByCode = (code: string): TherapyLocale | undefined => {
  return SUPPORTED_LOCALES.find(locale => locale.code === code)
}

export const getConsentTranslation = (localeCode: string): ConsentTranslation => {
  return CONSENT_TRANSLATIONS[localeCode] || CONSENT_TRANSLATIONS['en-IE']
}

export const detectUserLocale = (): string => {
  if (typeof window === 'undefined') return 'en-IE'
  
  const browserLang = navigator.language || 'en-IE'
  const supportedCode = SUPPORTED_LOCALES.find(locale => 
    locale.code === browserLang || locale.code.split('-')[0] === browserLang.split('-')[0]
  )?.code
  
  return supportedCode || 'en-IE'
}

export const getJurisdictionRequirements = (localeCode: string) => {
  const locale = getLocaleByCode(localeCode)
  if (!locale) return null
  
  const requirements = {
    'EU-GDPR': {
      dataRetention: '7 years maximum unless legal obligation requires longer',
      consentWithdrawal: 'Must be as easy as giving consent',
      dataPortability: 'Required in machine-readable format',
      minorConsent: 'Requires parental consent under age 16',
      breachNotification: '72 hours to supervisory authority'
    },
    'BR-LGPD': {
      dataRetention: '20 years for medical records as per CFP resolution',
      consentWithdrawal: 'Free and immediate withdrawal required',
      dataPortability: 'Required when technically feasible',
      minorConsent: 'Requires parental consent under age 18',
      breachNotification: 'Reasonable timeframe to ANPD'
    },
    'SA-PDPL': {
      dataRetention: 'As required for medical practice',
      consentWithdrawal: 'Written notice required',
      dataPortability: 'Subject to national security considerations',
      minorConsent: 'Guardian consent required',
      breachNotification: 'Immediate notification to SDAIA'
    }
  }
  
  return requirements[locale.jurisdiction as keyof typeof requirements] || requirements['EU-GDPR']
}