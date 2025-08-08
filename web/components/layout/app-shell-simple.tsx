"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useLogoutConfirmation } from "@/hooks/use-logout-confirmation";
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import PatientSidebar from "./patient-sidebar";
import TherapistSidebar from "./therapist-sidebar";

interface AppShellProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export default function AppShell({
  children,
  showSidebar = true,
  className,
}: Readonly<AppShellProps>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { requestLogout } = useLogoutConfirmation();

  const renderSidebar = () => {
    if (!showSidebar || !user) return null;

    if (user.role === "therapist") {
      return <TherapistSidebar activeSection="dashboard" isCollapsed={false} />;
    }

    if (user.role === "patient") {
      return <PatientSidebar isCollapsed={false} onToggleCollapse={() => {}} />;
    }

    return null;
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSidebarOpen(false);
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col",
          showSidebar && user ? "lg:pl-64" : "pl-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              {showSidebar && user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    T
                  </span>
                </div>
                <span className="font-semibold text-lg hidden sm:block">
                  TherapyEngage
                </span>
              </div>
            </div>

            {/* Right Side - User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info and Logout */}
              {user && (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    Welcome, {user.username}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestLogout}
                    className="text-sm"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              )}

              {/* Patient Home Button */}
              {user?.role === "patient" && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push("/patient")}
                  className="text-sm"
                >
                  Home
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
