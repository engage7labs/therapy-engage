"use client";

import {
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const TherapistSidebar: React.FC<SidebarProps> = ({
  activeSection = "dashboard",
  onSectionChange,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  // Detectar se é mobile e inicializar collapsed em mobile
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024; // lg breakpoint
    }
    return false;
  });

  // Usar estado externo se fornecido, senão usar interno
  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = onToggleCollapse || setInternalIsCollapsed;

  // Monitorar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Só colapsa automaticamente se não há controle externo
        if (externalIsCollapsed === undefined) {
          setInternalIsCollapsed(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [externalIsCollapsed]);

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      translationKey: "nav.dashboard",
    },
    {
      id: "clients",
      icon: Users,
      label: "Patients",
      translationKey: "nav.patients",
    },
    {
      id: "sessions",
      icon: Calendar,
      label: "Sessions",
      translationKey: "nav.sessions",
    },
    {
      id: "insights",
      icon: Brain,
      label: "Insights",
      translationKey: "nav.insights",
    },
    {
      id: "sentiment-analysis",
      icon: Heart,
      label: "Sentiment Analysis",
      translationKey: "nav.sentiment_analysis",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      translationKey: "nav.settings",
    },
  ];

  const handleSectionClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <>
      {/* Backdrop para mobile */}
      {!isCollapsed && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden cursor-pointer"
          onClick={() => setIsCollapsed(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsCollapsed(true);
            }
          }}
          aria-label="Fechar menu"
        />
      )}

      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 bg-white dark:bg-gray-900 border-r border-border flex flex-col h-screen fixed left-0 top-0 z-30 lg:relative lg:h-full ${
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Header with Logo and Collapse Button */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TE</span>
                </div>
                <span className="font-semibold text-foreground">
                  Therapy Engage
                </span>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              title={isCollapsed ? "Expand menu" : "Collapse menu"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionClick(item.id)}
                    className={`w-full flex items-center ${
                      isCollapsed
                        ? "justify-center p-3"
                        : "justify-start p-3 space-x-3"
                    } rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>Therapy Engage v2.0</p>
              <p>Professional Dashboard</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TherapistSidebar;
