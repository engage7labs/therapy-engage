"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useTheme } from "@/hooks/use-theme";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useTheme();

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("dashboard.welcome")}, {user?.name || user?.username}! 👋
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
              <h3 className="font-semibold text-foreground">Próxima Sessão</h3>
              <p className="text-sm text-muted-foreground">
                2025-08-06 às 14:00
              </p>
            </div>
          </div>
        </div>

        {/* Gravar Diário */}
        <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">�️</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("cards.record_diary")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("cards.record_diary_subtitle")}
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
                  <div className="font-medium text-foreground">05/08/2025</div>
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
                  <div className="font-medium text-foreground">02/08/2025</div>
                  <div className="text-sm text-muted-foreground">
                    Dia difícil
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">2/5</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Gravar Diário Digital */}
          <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎤</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                {t("cards.record_diary")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("cards.record_diary_description")}
              </p>
            </div>
          </div>

          {/* Diário de Reflexões */}
          <div className="bg-card rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎙️</span>
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
  );
}
