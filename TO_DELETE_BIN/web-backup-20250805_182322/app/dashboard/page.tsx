'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon, ClockIcon } from '@heroicons/react/24/solid';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  patients: number;
  sessionsToday: number;
}

interface Client {
  id: string;
  name: string;
  lastSession: string;
  nextSession?: string;
  moodScore: number;
  status: 'stable' | 'improving' | 'attention' | 'urgent';
  avatar?: string;
}

interface Session {
  id: string;
  clientName: string;
  time: string;
  type: 'individual' | 'group' | 'family';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    lastSession: '2 dias atrás',
    nextSession: 'Hoje, 14:00',
    moodScore: 7.2,
    status: 'improving',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e5d6a6?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    lastSession: '1 semana atrás',
    nextSession: 'Amanhã, 10:30',
    moodScore: 4.8,
    status: 'attention',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Maria Costa',
    lastSession: '3 dias atrás',
    nextSession: 'Sexta, 16:00',
    moodScore: 8.5,
    status: 'stable',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'João Oliveira',
    lastSession: '5 dias atrás',
    moodScore: 3.2,
    status: 'urgent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

const mockSessions: Session[] = [
  {
    id: '1',
    clientName: 'Ana Silva',
    time: '14:00',
    type: 'individual',
    status: 'scheduled'
  },
  {
    id: '2',
    clientName: 'Pedro Rodrigues',
    time: '15:30',
    type: 'family',
    status: 'scheduled'
  },
  {
    id: '3',
    clientName: 'Grupo Ansiedade',
    time: '17:00',
    type: 'group',
    status: 'scheduled'
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('therapy_user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'therapist') {
      router.push('/client-portal');
      return;
    }
    
    // Set authenticated user data
    setUser({
      id: parsedUser.id,
      name: parsedUser.name,
      email: `${parsedUser.id}@therapyengage.com`,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      patients: 24,
      sessionsToday: 3
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('therapy_user');
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      case 'attention': return 'text-yellow-600 bg-yellow-100';
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'improving': return 'Melhorando';
      case 'stable': return 'Estável';
      case 'attention': return 'Atenção';
      case 'urgent': return 'Urgente';
      default: return 'Desconhecido';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">TE</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard do Terapeuta</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Terapeuta</p>
                </div>
                <img 
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2" 
                  src={user?.avatar} 
                  alt={user?.name}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bom dia, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Você tem {mockSessions.length} sessões agendadas para hoje. Vamos fazer a diferença na vida dos seus pacientes.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
                <p className="text-3xl font-bold text-gray-900">{user.patients}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{mockSessions.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Humor Médio</p>
                <p className="text-3xl font-bold text-gray-900">7.2</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-3xl font-bold text-gray-900">94%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Sessões de Hoje</h3>
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Nova Sessão
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.clientName}</h4>
                          <div className="flex items-center text-sm text-gray-600 space-x-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>{session.time}</span>
                            <span className="capitalize">• {session.type === 'individual' ? 'Individual' : session.type === 'group' ? 'Grupo' : 'Família'}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        session.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status === 'scheduled' ? 'Agendada' : 
                         session.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Clients */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Pacientes Recentes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={client.avatar} 
                          alt={client.name}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.lastSession}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                          {getStatusText(client.status)}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">Humor: {client.moodScore}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nova Sessão</h3>
                <p className="text-sm text-gray-600">Agendar consulta com paciente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Relatórios</h3>
                <p className="text-sm text-gray-600">Visualizar progresso dos pacientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-600">Gerenciar perfil e preferências</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}