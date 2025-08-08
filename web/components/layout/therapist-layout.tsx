"use client";

import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  LogOut,
  Phone,
  Search,
  Settings,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { QuickThemeLanguageToggle } from "../settings/quick-theme-language-toggle";

interface TherapistLayoutProps {
  children: React.ReactNode;
  currentUser?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notifications?: number;
  onLogout?: () => void;
}

export default function TherapistLayout({
  children,
  currentUser = { name: "Dr. Professional", role: "Licensed Therapist" },
  notifications = 3,
  onLogout,
}: TherapistLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getNavigationItemClasses = (item: any) => {
    if (item.active) return "bg-primary text-primary-foreground";
    if (item.urgent)
      return "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20";
    return "text-muted-foreground hover:text-foreground hover:bg-secondary";
  };

  const getActionButtonClasses = (action: any) => {
    if (action.primary)
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    if (action.urgent) return "bg-red-600 text-white hover:bg-red-700";
    return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, active: true },
    { id: "patients", label: "Patient Queue", icon: Users, badge: "4" },
    { id: "calendar", label: "Schedule", icon: Calendar, badge: "2" },
    { id: "sessions", label: "Sessions", icon: Video },
    { id: "notes", label: "Clinical Notes", icon: FileText },
    {
      id: "emergency",
      label: "Emergency Protocols",
      icon: AlertTriangle,
      urgent: true,
    },
  ];

  const quickActions = [
    { id: "start-session", label: "Start Session", icon: Video, primary: true },
    {
      id: "emergency-call",
      label: "Emergency Contact",
      icon: Phone,
      urgent: true,
    },
    { id: "quick-note", label: "Quick Note", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Clinical Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                TE
              </span>
            </div>
            {sidebarOpen && (
              <div>
                <h3 className="font-semibold text-foreground">TherapyEngage</h3>
                <p className="text-xs text-muted-foreground">
                  Clinical Platform
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${getNavigationItemClasses(
                item
              )}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.urgent
                          ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Quick Actions
            </h4>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${getActionButtonClasses(
                    action
                  )}`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full text-muted-foreground hover:text-foreground text-sm"
          >
            {sidebarOpen ? "← Collapse" : "→"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Professional Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search and Current Context */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patients, sessions, notes..."
                  className="pl-10 pr-4 py-2 w-80 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Session ending in 23:45</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <QuickThemeLanguageToggle />

              {/* Notifications */}
              <button className="relative p-2 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
