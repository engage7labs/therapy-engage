"use client";

import AppShell from "@/components/layout/app-shell";
import { AlertTriangle, Calendar, Clock, Users } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";

export default function DashboardPage() {
  const { t } = useTheme();

  // Mock data - em uma aplicação real, viria da API
  const dashboardStats = {
    totalPatients: 24,
    upcomingSessions: 3,
    recentAlerts: 2,
    completedSessions: 18,
  };

  const upcomingSessions = [
    {
      id: 1,
      patient: "Ana Silva",
      time: "14:00",
      type: "Individual Session",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "João Santos",
      time: "15:30",
      type: "Follow-up",
      status: "pending",
    },
    {
      id: 3,
      patient: "Maria Costa",
      time: "16:45",
      type: "Group Session",
      status: "confirmed",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      message: "João Santos - Sentimento negativo detectado",
      time: "2 horas atrás",
      severity: "high",
    },
    {
      id: 2,
      message: "Ana Silva - Sessão perdida sem aviso",
      time: "1 dia atrás",
      severity: "medium",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("dashboard.therapist.overview")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta! Aqui está o resumo de hoje.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Pacientes
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardStats.totalPatients}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Sessões Hoje
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardStats.upcomingSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Alertas Recentes
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardStats.recentAlerts}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Sessões Concluídas
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {dashboardStats.completedSessions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Próximas Sessões
            </h2>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {session.patient}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.time} - {session.type}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {session.status === "confirmed" ? "Confirmado" : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Alertas Recentes
            </h2>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg"
                >
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.severity === "high"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 border bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Ver Todos os Alertas
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-lg border shadow-sm bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors text-left">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-foreground">Agendar Sessão</p>
              <p className="text-sm text-muted-foreground">
                Criar nova sessão com paciente
              </p>
            </button>
            <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors text-left">
              <Users className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-foreground">Adicionar Paciente</p>
              <p className="text-sm text-muted-foreground">
                Registrar novo paciente
              </p>
            </button>
            <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors text-left">
              <AlertTriangle className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-foreground">Ver Análises</p>
              <p className="text-sm text-muted-foreground">
                Revisar sentimentos e tendências
              </p>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
