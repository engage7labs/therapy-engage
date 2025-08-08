"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import TherapistSidebar from "../../components/layout/therapist-sidebar";
import { useColorTheme } from "../../hooks/use-color-theme";
import { useLogoutConfirmation } from "../../hooks/use-logout-confirmation";
import { useTheme } from "../../hooks/use-theme";
import { useAuth } from "../contexts/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation();
  const { t } = useTheme();
  const { getButtonStyle } = useColorTheme();

  // Estado do sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Se não estiver autenticado, não renderizar o layout
  if (!user || user.role !== "therapist") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 lg:flex">
      {/* Sidebar */}
      <TherapistSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0">
        {/* Header - Always visible */}
        <div className="bg-card/80 backdrop-blur shadow border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-3">
                {/* Botão Menu para Mobile */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                  aria-label="Abrir menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TE</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  {t("dashboard.therapist.title")}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.welcome")}, {user.username}
                </span>
                <button
                  onClick={requestLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white border-0 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  style={getButtonStyle("secondary")}
                >
                  <LogOut className="w-4 h-4" />
                  {t("auth.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog />
    </div>
  );
}
