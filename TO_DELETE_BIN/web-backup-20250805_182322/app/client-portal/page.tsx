'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
  FaceSmileIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  CalendarIcon as CalendarSolid 
} from '@heroicons/react/24/solid';

interface User {
  id: string;
  name: string;
  role: string;
  loginTime: string;
}

interface MoodEntry {
  date: string;
  mood: number;
  emoji: string;
  note?: string;
}

interface Session {
  id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  therapist: string;
  type: 'individual' | 'group';
}

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Muito triste' },
  { value: 2, emoji: '😔', label: 'Triste' },
  { value: 3, emoji: '😐', label: 'Neutro' },
  { value: 4, emoji: '😊', label: 'Bem' },
  { value: 5, emoji: '😄', label: 'Muito bem' }
];

export default function ClientPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [moodNote, setMoodNote] = useState('');
  const [showMoodModal, setShowMoodModal] = useState(false);

  // Mock data
  const [moodHistory] = useState<MoodEntry[]>([
    { date: '2025-08-05', mood: 4, emoji: '😊', note: 'Sessão muito produtiva hoje' },
    { date: '2025-08-04', mood: 3, emoji: '😐', note: 'Dia normal' },
    { date: '2025-08-03', mood: 5, emoji: '😄', note: 'Excelente progresso!' },
    { date: '2025-08-02', mood: 2, emoji: '😔', note: 'Dia difícil' },
    { date: '2025-08-01', mood: 4, emoji: '😊' }
  ]);

  const [upcomingSessions] = useState<Session[]>([
    {
      id: '1',
      date: '2025-08-06',
      time: '14:00',
      status: 'scheduled',
      therapist: 'Dr. Zé Deleta',
      type: 'individual'
    },
    {
      id: '2', 
      date: '2025-08-08',
      time: '10:30',
      status: 'scheduled',
      therapist: 'Dr. Zé Deleta',
      type: 'individual'
    }
  ]);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('therapy_user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'client') {
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('therapy_user');
    router.push('/login');
  };

  const handleMoodSubmit = () => {
    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      emoji: moodEmojis.find(m => m.value === currentMood)?.emoji || '😐',
      note: moodNote
    };
    
    // In real app, save to backend
    console.log('Mood entry saved:', newEntry);
    setShowMoodModal(false);
    setMoodNote('');
  };

  const getAverageMood = () => {
    const avg = moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length;
    return avg.toFixed(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">TE</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Portal do Cliente</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Olá, <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Como você está se sentindo hoje? Vamos acompanhar seu progresso juntos.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowMoodModal(true)}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaceSmileIcon className="h-6 w-6 text-blue-600" />
              </div>
              <SparklesIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Como estou hoje?</h3>
            <p className="text-sm text-gray-600">Registre seu humor e sentimentos</p>
          </button>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarSolid className="h-6 w-6 text-green-600" />
              </div>
              <BellIcon className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Próxima Sessão</h3>
            <p className="text-sm text-gray-600">
              {upcomingSessions[0] ? 
                `${upcomingSessions[0].date} às ${upcomingSessions[0].time}` : 
                'Nenhuma sessão agendada'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <HeartSolid className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Humor Médio</h3>
            <p className="text-sm text-gray-600">{getAverageMood()}/5.0 (últimos 5 dias)</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood History */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                Histórico de Humor
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(entry.date).toLocaleDateString('pt-BR')}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-gray-600">{entry.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{entry.mood}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                Próximas Sessões
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{session.therapist}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status === 'scheduled' ? 'Agendado' :
                         session.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(session.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {session.time}
                      </span>
                      <span className="capitalize">
                        {session.type === 'individual' ? 'Individual' : 'Grupo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-green-500 mr-2" />
              Recursos de Apoio
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-2">📚 Exercícios de Relaxamento</h4>
                <p className="text-sm text-gray-600">Técnicas de respiração e mindfulness para momentos difíceis</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-2">🎯 Metas de Progresso</h4>
                <p className="text-sm text-gray-600">Acompanhe objetivos definidos com seu terapeuta</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-2">💬 Diário de Reflexões</h4>
                <p className="text-sm text-gray-600">Espaço privado para seus pensamentos e insights</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-2">🆘 Contatos de Emergência</h4>
                <p className="text-sm text-gray-600">Números importantes para momentos de crise</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mood Entry Modal */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Como você está se sentindo?</h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setCurrentMood(mood.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    currentMood === mood.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-gray-600">{mood.label}</div>
                </button>
              ))}
            </div>

            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Como foi seu dia? (opcional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
              rows={3}
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowMoodModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleMoodSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}