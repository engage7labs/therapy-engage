import React, { createContext, useContext, useEffect } from 'react'
import { useKV } from '@/hooks/use-kv'

interface ThemeContextType {
  theme: 'light' | 'dark'
  language: 'en' | 'pt' | 'es'
  setTheme: (theme: 'light' | 'dark') => void
  setLanguage: (language: 'en' | 'pt' | 'es') => void
  t: (key: string) => string
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// Translation keys with support for EN, PT, ES
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.patients': 'Patients',
    'nav.sessions': 'Sessions',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Clinical Dashboard',
    'dashboard.stats.patients': 'Total Patients',
    'dashboard.stats.sessions_today': 'Sessions Today',
    'dashboard.stats.active_sessions': 'Active Sessions',
    'dashboard.stats.alerts': 'Critical Alerts',
    
    // Patients
    'patients.title': 'Patient List',
    'patients.search': 'Search patients...',
    'patients.add_new': 'Add New Patient',
    'patients.view_profile': 'View Profile',
    'patients.risk_level': 'Risk Level',
    'patients.next_session': 'Next Session',
    'patients.last_contact': 'Last Contact',
    
    // Sessions
    'sessions.title': 'Session Management',
    'sessions.upcoming': 'Upcoming Sessions',
    'sessions.active': 'Active Sessions',
    'sessions.completed': 'Completed Sessions',
    'sessions.start_session': 'Start Session',
    'sessions.join_session': 'Join Session',
    'sessions.end_session': 'End Session',
    'sessions.recording': 'Recording',
    'sessions.duration': 'Duration',
    
    // Emergency & Alerts
    'emergency.title': 'Emergency Contact',
    'emergency.whatsapp': 'WhatsApp Emergency',
    'emergency.call': 'Emergency Call',
    'emergency.critical_alert': 'Critical Alert',
    'emergency.immediate_attention': 'Requires Immediate Attention',
    
    // Theme & Language
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.dark_mode': 'Dark Mode',
    'settings.light_mode': 'Light Mode',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit2',
    'common.view': 'View',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    
    // Login
    'login.title': 'Therapy Engage Login',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.sign_in': 'Sign In',
    'login.demo_accounts': 'Demo Accounts',
    'login.therapist_demo': 'Therapist Demo (dr.smith)',
    'login.patient_demo': 'Patient Demo (rodrigo)',
    
    // Risk Levels
    'risk.low': 'Low Risk',
    'risk.moderate': 'Moderate Risk',
    'risk.high': 'High Risk',
    'risk.critical': 'Critical Risk',
    
    // Logout Confirmation
    'logout.confirmTitle': 'Confirm Logout',
    'logout.confirmMessage': 'Are you sure you want to log out? Any unsaved work or active sessions will be lost.',
    'logout.securityNote': 'Security Notice',
    'logout.securityDetails': 'Logging out will end your current session and require re-authentication to access patient data.',
    'logout.confirm': 'Yes, Logout',
    
    // Tooltips
    'tooltip.logout': 'Logout - Click to confirm session end',
    'tooltip.logout_preview': 'Will require confirmation before logging out',
    'tooltip.theme_toggle': 'Toggle between light and dark themes',
    'tooltip.language_toggle': 'Switch between English, Portuguese, and Spanish',
    'tooltip.profile': 'View your profile information',
    'tooltip.settings': 'Access application settings',
    'tooltip.emergency': 'Emergency contact options for critical situations'
  },
  
  pt: {
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.patients': 'Pacientes',
    'nav.sessions': 'Sessões',
    'nav.reports': 'Relatórios',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    
    // Dashboard
    'dashboard.title': 'Painel Clínico',
    'dashboard.stats.patients': 'Total de Pacientes',
    'dashboard.stats.sessions_today': 'Sessões Hoje',
    'dashboard.stats.active_sessions': 'Sessões Ativas',
    'dashboard.stats.alerts': 'Alertas Críticos',
    
    // Patients
    'patients.title': 'Lista de Pacientes',
    'patients.search': 'Buscar pacientes...',
    'patients.add_new': 'Adicionar Novo Paciente',
    'patients.view_profile': 'Ver Perfil',
    'patients.risk_level': 'Nível de Risco',
    'patients.next_session': 'Próxima Sessão',
    'patients.last_contact': 'Último Contato',
    
    // Sessions
    'sessions.title': 'Gerenciamento de Sessões',
    'sessions.upcoming': 'Próximas Sessões',
    'sessions.active': 'Sessões Ativas',
    'sessions.completed': 'Sessões Concluídas',
    'sessions.start_session': 'Iniciar Sessão',
    'sessions.join_session': 'Entrar na Sessão',
    'sessions.end_session': 'Encerrar Sessão',
    'sessions.recording': 'Gravando',
    'sessions.duration': 'Duração',
    
    // Emergency & Alerts
    'emergency.title': 'Contato de Emergência',
    'emergency.whatsapp': 'WhatsApp Emergência',
    'emergency.call': 'Chamada de Emergência',
    'emergency.critical_alert': 'Alerta Crítico',
    'emergency.immediate_attention': 'Requer Atenção Imediata',
    
    // Theme & Language
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.dark_mode': 'Modo Escuro',
    'settings.light_mode': 'Modo Claro',
    
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.view': 'Visualizar',
    'common.close': 'Fechar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    
    // Login
    'login.title': 'Login Therapy Engage',
    'login.username': 'Usuário',
    'login.password': 'Senha',
    'login.sign_in': 'Entrar',
    'login.demo_accounts': 'Contas Demo',
    'login.therapist_demo': 'Demo Terapeuta (dr.smith)',
    'login.patient_demo': 'Demo Paciente (rodrigo)',
    
    // Risk Levels
    'risk.low': 'Risco Baixo',
    'risk.moderate': 'Risco Moderado',
    'risk.high': 'Risco Alto',
    'risk.critical': 'Risco Crítico',
    
    // Logout Confirmation
    'logout.confirmTitle': 'Confirmar Logout',
    'logout.confirmMessage': 'Tem certeza de que deseja sair? Qualquer trabalho não salvo ou sessões ativas serão perdidos.',
    'logout.securityNote': 'Aviso de Segurança',
    'logout.securityDetails': 'Fazer logout encerrará sua sessão atual e exigirá nova autenticação para acessar dados dos pacientes.',
    'logout.confirm': 'Sim, Sair',
    
    // Tooltips
    'tooltip.logout': 'Sair - Clique para confirmar o encerramento da sessão',
    'tooltip.logout_preview': 'Solicitará confirmação antes de fazer logout',
    'tooltip.theme_toggle': 'Alternar entre temas claro e escuro',
    'tooltip.language_toggle': 'Alternar entre Inglês, Português e Espanhol',
    'tooltip.profile': 'Ver informações do seu perfil',
    'tooltip.settings': 'Acessar configurações do aplicativo',
    'tooltip.emergency': 'Opções de contato de emergência para situações críticas'
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.patients': 'Pacientes',
    'nav.sessions': 'Sesiones',
    'nav.reports': 'Reportes',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    
    // Dashboard
    'dashboard.title': 'Panel Clínico',
    'dashboard.stats.patients': 'Total de Pacientes',
    'dashboard.stats.sessions_today': 'Sesiones Hoy',
    'dashboard.stats.active_sessions': 'Sesiones Activas',
    'dashboard.stats.alerts': 'Alertas Críticas',
    
    // Patients
    'patients.title': 'Lista de Pacientes',
    'patients.search': 'Buscar pacientes...',
    'patients.add_new': 'Agregar Nuevo Paciente',
    'patients.view_profile': 'Ver Perfil',
    'patients.risk_level': 'Nivel de Riesgo',
    'patients.next_session': 'Próxima Sesión',
    'patients.last_contact': 'Último Contacto',
    
    // Sessions
    'sessions.title': 'Gestión de Sesiones',
    'sessions.upcoming': 'Próximas Sesiones',
    'sessions.active': 'Sesiones Activas',
    'sessions.completed': 'Sesiones Completadas',
    'sessions.start_session': 'Iniciar Sesión',
    'sessions.join_session': 'Unirse a Sesión',
    'sessions.end_session': 'Terminar Sesión',
    'sessions.recording': 'Grabando',
    'sessions.duration': 'Duración',
    
    // Emergency & Alerts
    'emergency.title': 'Contacto de Emergencia',
    'emergency.whatsapp': 'WhatsApp Emergencia',
    'emergency.call': 'Llamada de Emergencia',
    'emergency.critical_alert': 'Alerta Crítica',
    'emergency.immediate_attention': 'Requiere Atención Inmediata',
    
    // Theme & Language
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.dark_mode': 'Modo Oscuro',
    'settings.light_mode': 'Modo Claro',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    
    // Login
    'login.title': 'Inicio de Sesión Therapy Engage',
    'login.username': 'Usuario',
    'login.password': 'Contraseña',
    'login.sign_in': 'Iniciar Sesión',
    'login.demo_accounts': 'Cuentas Demo',
    'login.therapist_demo': 'Demo Terapeuta (dr.smith)',
    'login.patient_demo': 'Demo Paciente (rodrigo)',
    
    // Risk Levels
    'risk.low': 'Riesgo Bajo',
    'risk.moderate': 'Riesgo Moderado',
    'risk.high': 'Riesgo Alto',
    'risk.critical': 'Riesgo Crítico',
    
    // Logout Confirmation
    'logout.confirmTitle': 'Confirmar Cierre de Sesión',
    'logout.confirmMessage': '¿Está seguro de que desea cerrar sesión? Cualquier trabajo no guardado o sesiones activas se perderán.',
    'logout.securityNote': 'Aviso de Seguridad',
    'logout.securityDetails': 'Cerrar sesión terminará su sesión actual y requerirá nueva autenticación para acceder a datos de pacientes.',
    'logout.confirm': 'Sí, Cerrar Sesión',
    
    // Tooltips
    'tooltip.logout': 'Cerrar Sesión - Haga clic para confirmar el final de la sesión',
    'tooltip.logout_preview': 'Solicitará confirmación antes de cerrar sesión',
    'tooltip.theme_toggle': 'Alternar entre temas claro y oscuro',
    'tooltip.language_toggle': 'Cambiar entre Inglés, Portugués y Español',
    'tooltip.profile': 'Ver información de su perfil',
    'tooltip.settings': 'Acceder a la configuración de la aplicación',
    'tooltip.emergency': 'Opciones de contacto de emergencia para situaciones críticas'
  }
} as const

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeKV] = useKV<'light' | 'dark'>('app-theme', 'light')
  const [language, setLanguageKV] = useKV<'en' | 'pt' | 'es'>('app-language', 'en')

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Set data attribute for theme-specific styling
    root.setAttribute('data-theme', theme)
  }, [theme])

  // Apply language to document
  useEffect(() => {
    document.documentElement.lang = language
    
    // Set direction for RTL languages (future support)
    if (language === 'ar') {
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
    }
  }, [language])

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeKV(newTheme)
  }

  const setLanguage = (newLanguage: 'en' | 'pt' | 'es') => {
    setLanguageKV(newLanguage)
  }

  const t = (key: string): string => {
    const translation = translations[language]?.[key as keyof typeof translations['en']]
    return translation || key // Fallback to key if translation not found
  }

  const value: ThemeContextType = {
    theme,
    language,
    setTheme,
    setLanguage,
    t
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}