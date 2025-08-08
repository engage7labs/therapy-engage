"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useKV } from "./use-kv";

type Theme = "light" | "dark";
type Language = "en" | "pt" | "es";

interface ThemeContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Comprehensive translations for all supported languages
const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.patients": "Patients",
    "nav.sessions": "Sessions",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.insights": "Insights",

    // Dashboard
    "dashboard.patient.title": "Patient Portal",
    "dashboard.therapist.title": "Therapist Dashboard",
    "dashboard.admin.title": "Admin Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.sessions.upcoming": "Your Upcoming Sessions",
    "dashboard.sessions.progress": "Your Progress",
    "dashboard.actions.quick": "Quick Actions",
    "dashboard.sessions.schedule": "Schedule New Session",
    "dashboard.sessions.message": "Message Therapist",
    "dashboard.timeout": "Session timeout",
    "dashboard.admin.management": "System Administration",
    "dashboard.admin.tools":
      "Platform management tools will be available here.",
    "dashboard.mood.progress": "Mood Progress",
    "dashboard.mood.improvement": "Showing improvement",
    "dashboard.mood.trending": "Trending upward",

    // Dashboard
    "dashboard.title": "Clinical Dashboard",
    "dashboard.stats.patients": "Total Patients",
    "dashboard.stats.sessions_today": "Sessions Today",
    "dashboard.stats.active_sessions": "Active Sessions",
    "dashboard.stats.alerts": "Critical Alerts",

    // Patients
    "patients.title": "Patient Management",
    "patients.search": "Search patients...",
    "patients.add_new": "Add New Patient",
    "patients.view_profile": "View Profile",
    "patients.risk_level": "Risk Level",
    "patients.next_session": "Next Session",
    "patients.last_contact": "Last Contact",

    // Sessions
    "sessions.title": "Session Management",
    "sessions.upcoming": "Upcoming Sessions",
    "sessions.active": "Active Sessions",
    "sessions.completed": "Completed Sessions",
    "sessions.start_session": "Start Session",
    "sessions.join_session": "Join Session",
    "sessions.end_session": "End Session",
    "sessions.recording": "Recording",
    "sessions.duration": "Duration",

    // Emergency & Alerts
    "emergency.title": "Emergency Contact",
    "emergency.whatsapp": "WhatsApp Emergency",
    "emergency.call": "Emergency Call",
    "emergency.critical_alert": "Critical Alert",
    "emergency.immediate_attention": "Requires Immediate Attention",

    // Theme & Language
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.dark_mode": "Dark Mode",
    "settings.light_mode": "Light Mode",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.confirm": "Confirm",

    // Login
    "login.title": "Therapy Engage Login",
    "login.username": "Username",
    "login.password": "Password",
    "login.sign_in": "Sign In",
    "login.demo_accounts": "Demo Accounts",
    "login.therapist_demo": "Therapist Demo (dr.smith)",
    "login.patient_demo": "Patient Demo (rodrigo)",

    // Risk Levels
    "risk.low": "Low Risk",
    "risk.moderate": "Moderate Risk",
    "risk.high": "High Risk",
    "risk.critical": "Critical Risk",

    // Logout Confirmation
    "logout.confirmTitle": "Confirm Logout",
    "logout.confirmMessage":
      "Are you sure you want to log out? Any unsaved work or active sessions will be lost.",
    "logout.securityNote": "Security Notice",
    "logout.securityDetails":
      "Logging out will end your current session and require re-authentication to access patient data.",
    "logout.confirm": "Yes, Logout",

    // Tooltips
    "tooltip.logout": "Logout - Click to confirm session end",
    "tooltip.logout_preview": "Will require confirmation before logging out",
    "tooltip.theme_toggle": "Toggle between light and dark themes",
    "tooltip.language_toggle":
      "Switch between English, Portuguese, and Spanish",
    "tooltip.profile": "View your profile information",
    "tooltip.settings": "Access application settings",
    "tooltip.emergency": "Emergency contact options for critical situations",

    // Dashboard new elements
    "dashboard.patient.subtitle":
      "How are you feeling today? Let's track your progress together.",
    "dashboard.therapist.subtitle":
      "You have 4 sessions scheduled for today. Here's a summary of your activities.",

    // Therapist Dashboard Cards
    "cards.active_patients": "Active Patients",
    "cards.sessions_today": "Sessions Today",
    "cards.success_rate": "Success Rate",
    "cards.monthly_revenue": "Monthly Revenue",
    "cards.scheduled": "scheduled",
    "cards.of": "of",
    "cards.upcoming_sessions": "Upcoming Sessions",
    "cards.ai_insights": "AI Insights",
    "cards.quick_actions": "Quick Actions",
    "cards.schedule_session": "Schedule Session",
    "cards.view_reports": "View Reports",
    "cards.send_message": "Send Message",
    "cards.create_session_patient": "Create new session for patient",
    "cards.analyze_patient_progress": "Analyze patient progress",
    "cards.communicate_patients": "Communicate with patients",
    "cards.patients_improvement": "Patients with improvement",
    "cards.positive_trend": "Positive trend",
    "cards.attention_needed": "Attention needed",
    "cards.patients_showed_progress":
      "of your patients showed progress this week",
    "cards.mood_improving": "General patient mood is improving",
    "cards.patients_need_followup": "patients need extra follow-up",
    "cards.individual_therapy": "Individual Therapy",
    "cards.anxiety_therapy": "Anxiety Therapy",
    "cards.family_therapy": "Family Therapy",
    "cards.depression": "Depression",
    "cards.session": "Session",
    "cards.today": "Today",
    "cards.tomorrow": "Tomorrow",
    "cards.start_session": "Start Session",
  },

  pt: {
    // Navigation
    "nav.dashboard": "Painel",
    "nav.patients": "Pacientes",
    "nav.sessions": "Sessões",
    "nav.reports": "Relatórios",
    "nav.settings": "Configurações",
    "nav.logout": "Sair",
    "nav.insights": "Insights",

    // Dashboard
    "dashboard.patient.title": "Portal do Paciente",
    "dashboard.therapist.title": "Painel do Terapeuta",
    "dashboard.admin.title": "Painel Administrativo",
    "dashboard.welcome": "Bem-vindo",
    "dashboard.sessions.upcoming": "Suas Próximas Sessões",
    "dashboard.sessions.progress": "Seu Progresso",
    "dashboard.actions.quick": "Ações Rápidas",
    "dashboard.sessions.schedule": "Agendar Nova Sessão",
    "dashboard.sessions.message": "Mensagem para Terapeuta",
    "dashboard.timeout": "Timeout da sessão",
    "dashboard.admin.management": "Administração do Sistema",
    "dashboard.admin.tools":
      "Ferramentas de gestão da plataforma estarão disponíveis aqui.",
    "dashboard.mood.progress": "Progresso do Humor",
    "dashboard.mood.improvement": "Mostrando melhoria",
    "dashboard.mood.trending": "Tendência positiva",

    // Dashboard
    "dashboard.title": "Painel Clínico",
    "dashboard.stats.patients": "Total de Pacientes",
    "dashboard.stats.sessions_today": "Sessões Hoje",
    "dashboard.stats.active_sessions": "Sessões Ativas",
    "dashboard.stats.alerts": "Alertas Críticos",

    // Patients
    "patients.title": "Gestão de Pacientes",
    "patients.search": "Buscar pacientes...",
    "patients.add_new": "Adicionar Novo Paciente",
    "patients.view_profile": "Ver Perfil",
    "patients.risk_level": "Nível de Risco",
    "patients.next_session": "Próxima Sessão",
    "patients.last_contact": "Último Contato",

    // Sessions
    "sessions.title": "Gestão de Sessões",
    "sessions.upcoming": "Próximas Sessões",
    "sessions.active": "Sessões Ativas",
    "sessions.completed": "Sessões Concluídas",
    "sessions.start_session": "Iniciar Sessão",
    "sessions.join_session": "Entrar na Sessão",
    "sessions.end_session": "Finalizar Sessão",
    "sessions.recording": "Gravação",
    "sessions.duration": "Duração",

    // Emergency & Alerts
    "emergency.title": "Contato de Emergência",
    "emergency.whatsapp": "WhatsApp Emergência",
    "emergency.call": "Chamada de Emergência",
    "emergency.critical_alert": "Alerta Crítico",
    "emergency.immediate_attention": "Requer Atenção Imediata",

    // Theme & Language
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.dark_mode": "Modo Escuro",
    "settings.light_mode": "Modo Claro",

    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.view": "Visualizar",
    "common.close": "Fechar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    "common.confirm": "Confirmar",

    // Login
    "login.title": "Login Therapy Engage",
    "login.username": "Usuário",
    "login.password": "Senha",
    "login.sign_in": "Entrar",
    "login.demo_accounts": "Contas Demo",
    "login.therapist_demo": "Demo Terapeuta (dr.smith)",
    "login.patient_demo": "Demo Paciente (rodrigo)",

    // Risk Levels
    "risk.low": "Risco Baixo",
    "risk.moderate": "Risco Moderado",
    "risk.high": "Risco Alto",
    "risk.critical": "Risco Crítico",

    // Logout Confirmation
    "logout.confirmTitle": "Confirmar Logout",
    "logout.confirmMessage":
      "Tem certeza de que deseja sair? Qualquer trabalho não salvo ou sessões ativas serão perdidos.",
    "logout.securityNote": "Aviso de Segurança",
    "logout.securityDetails":
      "Fazer logout encerrará sua sessão atual e exigirá nova autenticação para acessar dados dos pacientes.",
    "logout.confirm": "Sim, Sair",

    // Tooltips
    "tooltip.logout": "Sair - Clique para confirmar o encerramento da sessão",
    "tooltip.logout_preview": "Solicitará confirmação antes de fazer logout",
    "tooltip.theme_toggle": "Alternar entre temas claro e escuro",
    "tooltip.language_toggle": "Alternar entre Inglês, Português e Espanhol",
    "tooltip.profile": "Ver informações do seu perfil",
    "tooltip.settings": "Acessar configurações do aplicativo",
    "tooltip.emergency":
      "Opções de contato de emergência para situações críticas",

    // Dashboard new elements
    "dashboard.patient.subtitle":
      "Como você está se sentindo hoje? Vamos acompanhar seu progresso juntos.",
    "dashboard.therapist.subtitle":
      "Você tem 4 sessões agendadas para hoje. Aqui está um resumo das suas atividades.",

    // Therapist Dashboard Cards
    "cards.active_patients": "Pacientes Ativos",
    "cards.sessions_today": "Sessões Hoje",
    "cards.success_rate": "Taxa de Sucesso",
    "cards.monthly_revenue": "Receita Mensal",
    "cards.scheduled": "agendadas",
    "cards.of": "de",
    "cards.upcoming_sessions": "Próximas Sessões",
    "cards.ai_insights": "AI Insights",
    "cards.quick_actions": "Ações Rápidas",
    "cards.schedule_session": "Agendar Sessão",
    "cards.view_reports": "Ver Relatórios",
    "cards.send_message": "Enviar Mensagem",
    "cards.create_session_patient": "Criar nova sessão para paciente",
    "cards.analyze_patient_progress": "Analisar progresso dos pacientes",
    "cards.communicate_patients": "Comunicar com pacientes",
    "cards.patients_improvement": "Pacientes com melhoria",
    "cards.positive_trend": "Tendência positiva",
    "cards.attention_needed": "Atenção necessária",
    "cards.patients_showed_progress":
      "dos seus pacientes mostraram progresso esta semana",
    "cards.mood_improving": "Humor geral dos pacientes está melhorando",
    "cards.patients_need_followup":
      "pacientes precisam de acompanhamento extra",
    "cards.individual_therapy": "Terapia Individual",
    "cards.anxiety_therapy": "Terapia de Ansiedade",
    "cards.family_therapy": "Terapia Familiar",
    "cards.depression": "Depressão",
    "cards.session": "Sessão",
    "cards.today": "Hoje",
    "cards.tomorrow": "Amanhã",
    "cards.start_session": "Iniciar Sessão",
  },

  es: {
    // Navigation
    "nav.dashboard": "Panel",
    "nav.patients": "Pacientes",
    "nav.sessions": "Sesiones",
    "nav.reports": "Reportes",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "nav.insights": "Insights",

    // Dashboard
    "dashboard.patient.title": "Portal del Paciente",
    "dashboard.therapist.title": "Panel del Terapeuta",
    "dashboard.admin.title": "Panel Administrativo",
    "dashboard.welcome": "Bienvenido",
    "dashboard.sessions.upcoming": "Sus Próximas Sesiones",
    "dashboard.sessions.progress": "Su Progreso",
    "dashboard.actions.quick": "Acciones Rápidas",
    "dashboard.sessions.schedule": "Programar Nueva Sesión",
    "dashboard.sessions.message": "Mensaje al Terapeuta",
    "dashboard.timeout": "Tiempo de espera de sesión",
    "dashboard.admin.management": "Administración del Sistema",
    "dashboard.admin.tools":
      "Las herramientas de gestión de la plataforma estarán disponibles aquí.",
    "dashboard.mood.progress": "Progreso del Estado de Ánimo",
    "dashboard.mood.improvement": "Mostrando mejora",
    "dashboard.mood.trending": "Tendencia ascendente",

    // Dashboard
    "dashboard.title": "Panel Clínico",
    "dashboard.stats.patients": "Total de Pacientes",
    "dashboard.stats.sessions_today": "Sesiones Hoy",
    "dashboard.stats.active_sessions": "Sesiones Activas",
    "dashboard.stats.alerts": "Alertas Críticas",

    // Patients
    "patients.title": "Gestión de Pacientes",
    "patients.search": "Buscar pacientes...",
    "patients.add_new": "Agregar Nuevo Paciente",
    "patients.view_profile": "Ver Perfil",
    "patients.risk_level": "Nivel de Riesgo",
    "patients.next_session": "Próxima Sesión",
    "patients.last_contact": "Último Contacto",

    // Sessions
    "sessions.title": "Gestión de Sesiones",
    "sessions.upcoming": "Próximas Sesiones",
    "sessions.active": "Sesiones Activas",
    "sessions.completed": "Sesiones Completadas",
    "sessions.start_session": "Iniciar Sesión",
    "sessions.join_session": "Unirse a Sesión",
    "sessions.end_session": "Finalizar Sesión",
    "sessions.recording": "Grabación",
    "sessions.duration": "Duración",

    // Emergency & Alerts
    "emergency.title": "Contacto de Emergencia",
    "emergency.whatsapp": "WhatsApp Emergencia",
    "emergency.call": "Llamada de Emergencia",
    "emergency.critical_alert": "Alerta Crítica",
    "emergency.immediate_attention": "Requiere Atención Inmediata",

    // Theme & Language
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.dark_mode": "Modo Oscuro",
    "settings.light_mode": "Modo Claro",

    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.close": "Cerrar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.confirm": "Confirmar",

    // Login
    "login.title": "Login Therapy Engage",
    "login.username": "Usuario",
    "login.password": "Contraseña",
    "login.sign_in": "Iniciar Sesión",
    "login.demo_accounts": "Cuentas Demo",
    "login.therapist_demo": "Demo Terapeuta (dr.smith)",
    "login.patient_demo": "Demo Paciente (rodrigo)",

    // Risk Levels
    "risk.low": "Riesgo Bajo",
    "risk.moderate": "Riesgo Moderado",
    "risk.high": "Riesgo Alto",
    "risk.critical": "Riesgo Crítico",

    // Logout Confirmation
    "logout.confirmTitle": "Confirmar Logout",
    "logout.confirmMessage":
      "¿Está seguro de que desea cerrar sesión? Cualquier trabajo no guardado o sesiones activas se perderán.",
    "logout.securityNote": "Aviso de Seguridad",
    "logout.securityDetails":
      "Cerrar sesión terminará su sesión actual y requerirá nueva autenticación para acceder a datos de pacientes.",
    "logout.confirm": "Sí, Cerrar Sesión",

    // Tooltips
    "tooltip.logout":
      "Cerrar Sesión - Haga clic para confirmar el final de la sesión",
    "tooltip.logout_preview": "Solicitará confirmación antes de cerrar sesión",
    "tooltip.theme_toggle": "Alternar entre temas claro y oscuro",
    "tooltip.language_toggle": "Cambiar entre Inglés, Portugués y Español",
    "tooltip.profile": "Ver información de su perfil",
    "tooltip.settings": "Acceder a la configuración de la aplicación",
    "tooltip.emergency":
      "Opciones de contacto de emergencia para situaciones críticas",

    // Dashboard new elements
    "dashboard.patient.subtitle":
      "¿Cómo te sientes hoy? Vamos a hacer un seguimiento de tu progreso juntos.",
    "dashboard.therapist.subtitle":
      "Tienes 4 sesiones programadas para hoy. Aquí tienes un resumen de tus actividades.",

    // Therapist Dashboard Cards
    "cards.active_patients": "Pacientes Activos",
    "cards.sessions_today": "Sesiones Hoy",
    "cards.success_rate": "Tasa de Éxito",
    "cards.monthly_revenue": "Ingresos Mensuales",
    "cards.scheduled": "programadas",
    "cards.of": "de",
    "cards.upcoming_sessions": "Próximas Sesiones",
    "cards.ai_insights": "AI Insights",
    "cards.quick_actions": "Acciones Rápidas",
    "cards.schedule_session": "Programar Sesión",
    "cards.view_reports": "Ver Informes",
    "cards.send_message": "Enviar Mensaje",
    "cards.create_session_patient": "Crear nueva sesión para paciente",
    "cards.analyze_patient_progress": "Analizar progreso de pacientes",
    "cards.communicate_patients": "Comunicar con pacientes",
    "cards.patients_improvement": "Pacientes con mejora",
    "cards.positive_trend": "Tendencia positiva",
    "cards.attention_needed": "Atención necesaria",
    "cards.patients_showed_progress":
      "de tus pacientes mostraron progreso esta semana",
    "cards.mood_improving":
      "El estado de ánimo general de los pacientes está mejorando",
    "cards.patients_need_followup": "pacientes necesitan seguimiento adicional",
    "cards.individual_therapy": "Terapia Individual",
    "cards.anxiety_therapy": "Terapia de Ansiedad",
    "cards.family_therapy": "Terapia Familiar",
    "cards.depression": "Depresión",
    "cards.session": "Sesión",
    "cards.today": "Hoy",
    "cards.tomorrow": "Mañana",
    "cards.start_session": "Iniciar Sesión",
  },
} as const;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeKV] = useKV<Theme>("app-theme", "light");
  const [language, setLanguageKV] = useKV<Language>("app-language", "en");

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Set data attribute for theme-specific styling
    root.setAttribute("data-theme", theme);
  }, [theme]);

  // Apply language to document
  useEffect(() => {
    document.documentElement.lang = language;

    // Set direction for RTL languages (future support)
    // Currently only LTR languages are supported (en, pt, es)
    document.documentElement.dir = "ltr";
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeKV(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageKV(newLanguage);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const t = (key: string): string => {
    const translation =
      translations[language]?.[key as keyof (typeof translations)["en"]];
    return translation || key; // Fallback to key if translation not found
  };

  const value: ThemeContextType = {
    theme,
    language,
    setTheme,
    setLanguage,
    toggleTheme,
    t,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
