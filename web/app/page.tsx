"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { DebugThemeLanguageToggle } from "../components/settings/debug-theme-language-toggle";
import TherapistSidebar from "../components/layout/therapist-sidebar";
import { useLogoutConfirmation } from "../hooks/use-logout-confirmation";
import { useTheme } from "../hooks/use-theme";
import { useAuth } from "./contexts/auth-context";

// Simple login component for now
function LoginPage() {
  const { login } = useAuth();
  const { t } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      {/* Theme/Language Controls */}
      <div className="absolute top-4 right-4">
        <DebugThemeLanguageToggle />
      </div>

      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-md border">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">TE</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Therapy Engage
            </h2>
          </div>
          <p className="text-center text-muted-foreground">
            {t("login.title")}
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-foreground"
            >
              {t("login.username")}
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder={t("login.username")}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo Accounts:</p>
          <p>Therapist: dr.smith / demo123</p>
          <p>Patient: rodrigo / demo123</p>
          <p>Admin: admin / admin123</p>
        </div>

        {/* Debug button to clear localStorage */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear Storage & Reload (Debug)
          </button>
        </div>

        {/* Platform Information */}
        <div className="mt-8 text-center border-t border-border pt-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              Therapy Engage Platform v2.0
            </h3>
            <p className="text-sm text-muted-foreground">
              Customer Engagement & AI – NCI MSc Project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple dashboard components
function PatientDashboard() {
  const { user } = useAuth();
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation();
  const { t } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">TE</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                {t("dashboard.patient.title")}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {t("dashboard.welcome")}, {user?.name}
              </span>
              <DebugThemeLanguageToggle />
              <button
                onClick={requestLogout}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("dashboard.welcome")}, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              {t("dashboard.patient.subtitle")}
            </p>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Como estou hoje */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Como estou hoje?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registre seu humor e sentimentos
                  </p>
                </div>
              </div>
            </div>

            {/* Próxima Sessão */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Próxima Sessão
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    2025-08-06 às 14:00
                  </p>
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Objetivos</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe seu progresso
                  </p>
                </div>
              </div>
            </div>

            {/* Humor Médio */}
            <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Humor Médio</h3>
                  <p className="text-sm text-muted-foreground">
                    3.6/5.0 (últimos 5 dias)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Histórico de Humor */}
            <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  ❤️ Histórico de Humor
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">😊</span>
                    <div>
                      <div className="font-medium text-foreground">
                        05/08/2025
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sessão muito produtiva hoje
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Excelente progresso!
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">4/5</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">😐</span>
                    <div>
                      <div className="font-medium text-foreground">
                        02/08/2025
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Dia difícil
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">2/5</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">😊</span>
                    <div>
                      <div className="font-medium text-foreground">
                        01/08/2025
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">4/5</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximas Sessões */}
            <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  📅 Próximas Sessões
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Dr. Ego Smith
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        📅 06/08/2025 🕐 14:00 • Individual
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recursos de Apoio */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              📚 Recursos de Apoio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Exercícios de Relaxamento */}
              <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🧘</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Exercícios de Relaxamento
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Técnicas de respiração e mindfulness para momentos difíceis
                  </p>
                </div>
              </div>

              {/* Metas de Progresso */}
              <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Metas de Progresso
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Acompanhe objetivos definidos com seu terapeuta
                  </p>
                </div>
              </div>

              {/* Diário de Reflexões */}
              <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Diário de Reflexões
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Espaço privado para seus pensamentos e insights
                  </p>
                </div>
              </div>

              {/* Contatos de Emergência */}
              <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚨</span>
                  </div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                    Contatos de Emergência
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Números importantes para momentos de crise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationDialog />
    </div>
  );
}

function TherapistDashboard() {
  const { user } = useAuth();
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation();
  const { t } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <TherapistSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow border-b lg:hidden">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TE</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  {t("dashboard.therapist.title")}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.welcome")}, {user?.name}
                </span>
                <DebugThemeLanguageToggle />
                <button
                  onClick={requestLogout}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  title={t("nav.logout")}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("dashboard.welcome")}, Dr. {user?.name}! 👩‍⚕️
            </h1>
            <p className="text-muted-foreground">
              {t("dashboard.therapist.subtitle")}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Pacientes Ativos */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Pacientes Ativos
                  </h3>
                  <p className="text-2xl font-bold text-foreground">42</p>
                  <p className="text-sm text-green-600">+3 este mês</p>
                </div>
              </div>
            </div>

            {/* Sessões Hoje */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Sessões Hoje
                  </h3>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">
                    de 6 agendadas
                  </p>
                </div>
              </div>
            </div>

            {/* Taxa de Melhoria */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Taxa de Melhoria
                  </h3>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                  <p className="text-sm text-green-600">+5% vs mês passado</p>
                </div>
              </div>
            </div>

            {/* Satisfação */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Satisfação</h3>
                  <p className="text-2xl font-bold text-foreground">4.8/5</p>
                  <p className="text-sm text-muted-foreground">
                    Avaliação média
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Próximas Sessões */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  📅 Próximas Sessões de Hoje
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Maria Silva
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        🕐 09:00 - 09:50 • Terapia Individual
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Depressão • Sessão 8/12
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors text-sm">
                      Iniciar Sessão
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        João Santos
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        🕐 11:00 - 11:50 • Terapia de Casal
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Relacionamento • Sessão 3/8
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium">
                      Aguardando
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Ana Costa
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        🕐 14:00 - 14:50 • Terapia Individual
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        Ansiedade • Sessão 5/10
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights e Análises */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  🧠 Insights e Análises
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        IA Assistente
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Paciente Maria Silva mostra sinais de melhoria
                        significativa. Considere reduzir frequência das sessões.
                      </p>
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                        Recomendação de IA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Alerta de Atenção
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        João Santos faltou na última sessão. Considere fazer
                        contato.
                      </p>
                      <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                        Requer atenção
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Progresso Geral
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        75% dos seus pacientes mostram melhoria mensurável este
                        mês.
                      </p>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Excelente performance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              ⚡ Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Agendar Sessão */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📅</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Agendar Sessão
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Marque nova sessão com paciente
                  </p>
                </div>
              </div>

              {/* Relatórios */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Relatórios
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Gerar relatórios de progresso
                  </p>
                </div>
              </div>

              {/* Notas da Sessão */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Notas da Sessão
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Acessar notas de sessões anteriores
                  </p>
                </div>
              </div>

              {/* Configurações */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Configurações
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Gerenciar preferências do sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmationDialog />
    </div>
  );
}
function AdminDashboard() {
  const { user } = useAuth();
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation();
  const { t } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">
                {t("dashboard.admin.title")}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <DebugThemeLanguageToggle />
              <button
                onClick={requestLogout}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-border rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {t("dashboard.admin.management")}
              </h2>
              <p className="text-muted-foreground">
                {t("dashboard.admin.tools")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t("dashboard.timeout")}: {user?.sessionTimeout || 45} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationDialog />
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show appropriate dashboard based on user role
  if (user?.role === "patient") {
    return <PatientDashboard />;
  }

  if (user?.role === "therapist") {
    return <TherapistDashboard />;
  }

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  // Fallback
  return <LoginPage />;
}

export default function HomePage() {
  return <AppContent />;
}
