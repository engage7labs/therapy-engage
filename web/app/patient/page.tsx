"use client";

import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MessageSquare, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const router = useRouter();

  const upcomingSessions = [
    {
      id: 1,
      therapist: "Dr. Maria Santos",
      date: "2025-08-10",
      time: "14:00",
      type: "Individual Session",
    },
    {
      id: 2,
      therapist: "Dr. João Silva",
      date: "2025-08-12",
      time: "10:30",
      type: "Follow-up",
    },
  ];

  const quickActions = [
    {
      title: "Record Video Diary",
      description: "Share your thoughts and feelings",
      icon: Video,
      href: "/demo/media-upload",
      color: "bg-blue-500",
    },
    {
      title: "View Sessions",
      description: "Check your upcoming appointments",
      icon: Calendar,
      href: "/patient/sessions",
      color: "bg-green-500",
    },
    {
      title: "Messages",
      description: "Chat with your therapist",
      icon: MessageSquare,
      href: "/patient/messages",
      color: "bg-purple-500",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Your Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and stay connected with your care team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{session.therapist}</h3>
                      <p className="text-sm text-muted-foreground">
                        {session.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("pt-BR")} at{" "}
                        {session.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Join Session
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-primary mb-2">12</div>
              <p className="text-muted-foreground">Sessions Completed</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/patient/progress")}
              >
                View Detailed Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
