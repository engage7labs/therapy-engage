'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface LoginCredentials {
  username: string;
  password: string;
  role: 'therapist' | 'client';
  name: string;
  redirectPath: string;
}

const mockUsers: LoginCredentials[] = [
  {
    username: 'dr.delete',
    password: 'therapist123',
    role: 'therapist',
    name: 'Dr. Zé Deleta',
    redirectPath: '/dashboard'
  },
  {
    username: 'rodrigo',
    password: 'client123', 
    role: 'client',
    name: 'Rodrigo Marques',
    redirectPath: '/client-portal'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      u => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      // Store user session (in real app, use secure session management)
      localStorage.setItem('therapy_user', JSON.stringify({
        id: user.username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      }));
      
      router.push(user.redirectPath);
    } else {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
    
    setIsLoading(false);
  };

  const quickLogin = (user: LoginCredentials) => {
    setFormData({
      username: user.username,
      password: user.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">TE</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Therapy Engage
          </h2>
          <p className="text-gray-600 mb-6">
            Plataforma de Saúde Mental com IA
          </p>
        </div>

        {/* Demo Users */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">👥 Usuários Demo</h3>
          <div className="space-y-2 text-xs">
            {mockUsers.map((user) => (
              <div 
                key={user.username}
                className="flex justify-between items-center bg-white p-2 rounded border cursor-pointer hover:bg-blue-25 transition-colors"
                onClick={() => quickLogin(user)}
              >
                <div>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-gray-500 ml-2">({user.role === 'therapist' ? 'Terapeuta' : 'Cliente'})</span>
                </div>
                <div className="text-right text-gray-600">
                  <div>{user.username}</div>
                  <div>{user.password}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            💡 Clique em qualquer usuário para preencher automaticamente
          </p>
        </div>

        {/* Login Form */}
        <form className="bg-white shadow-xl rounded-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.username || !formData.password}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Therapy Engage Platform v2.0</p>
          <p className="mt-1">Customer Engagement & AI - NCI MSc Project</p>
        </div>
      </div>
    </div>
  );
}