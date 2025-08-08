"use client";

import {
  Calendar,
  FileText,
  Home,
  MessageSquare,
  Mic,
  Settings,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PatientSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function PatientSidebar({
  isCollapsed,
  onToggleCollapse,
}: Readonly<PatientSidebarProps>) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/patient",
      icon: Home,
      current: pathname === "/patient",
    },
    {
      name: "Record Diary",
      href: "/patient/record",
      icon: Video,
      current: pathname === "/patient/record",
    },
    {
      name: "Audio Diary", 
      href: "/patient/audio",
      icon: Mic,
      current: pathname === "/patient/audio",
    },
    {
      name: "Sessions",
      href: "/patient/sessions",
      icon: Calendar,
      current: pathname === "/patient/sessions",
    },
    {
      name: "Messages",
      href: "/patient/messages",
      icon: MessageSquare,
      current: pathname === "/patient/messages",
    },
    {
      name: "Progress",
      href: "/patient/progress",
      icon: FileText,
      current: pathname === "/patient/progress",
    },
    {
      name: "Profile",
      href: "/patient/profile",
      icon: User,
      current: pathname === "/patient/profile",
    },
    {
      name: "Settings",
      href: "/patient/settings",
      icon: Settings,
      current: pathname === "/patient/settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <button
          type="button"
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={onToggleCollapse}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onToggleCollapse();
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card/95 backdrop-blur border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-foreground">
                Patient Portal
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="lg:hidden"
            >
              ✕
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          onToggleCollapse();
                        }
                      }}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        item.current
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          item.current
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              TherapyEngage v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
