import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useLogoutConfirmation } from '../../hooks/use-logout-confirmation'
import { 
  Stethoscope,
  XCircle, 
  User, 
  Shield,
  TestTube,
  PlayCircle,
  Clock,
  CheckCircle,
  LogOut
} from 'lucide-react'

// Reference the mock users for validation
const MOCK_USERS: Record<string, { password: string; user: any }> = {
  'dr.delete': {
    password: 'demo123',
    user: {
      id: 'dr-smith',
      name: 'Dr. Smith',
      role: 'therapist',
      license: 'CRP-123456',
      specialization: 'Cognitive Behavioral Therapy'
    }
  },
  'rodrigo': {
    password: 'demo123',
    user: {
      id: 'patient-rodrigo',
      name: 'Rodrigo Marques',
      role: 'patient',
      age: 28,
      diagnosis: 'Anxiety Management'
    }
  }
}

interface TestCase {
  id: string
  name: string
  description: string
  credentials: { username: string; password: string }
  expectedRole: 'therapist' | 'patient'
  expectedName: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  result?: string
}

export function LoginSystemTester() {
  const { login, logout, user, isAuthenticated } = useAuth()
  const { requestLogout, LogoutConfirmationDialog } = useLogoutConfirmation()
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, any>>({})

  const testCases: TestCase[] = [
    {
      id: 'therapist-login',
      name: 'Login Terapeuta - Dr. Smith',
      description: 'Teste de login com credenciais do terapeuta demo',
      credentials: { username: 'dr.delete', password: 'demo123' },
      expectedRole: 'therapist',
      expectedName: 'Dr. Smith',
      status: 'pending'
    },
    {
      id: 'patient-login',
      name: 'Login Paciente - Rodrigo',
      description: 'Teste de login com credenciais do paciente demo',
      credentials: { username: 'rodrigo', password: 'demo123' },
      expectedRole: 'patient',
      expectedName: 'Rodrigo Marques',
      status: 'pending'
    },
    {
      id: 'invalid-username',
      name: 'Credenciais Inválidas - Usuário',
      description: 'Teste com usuário inexistente',
      credentials: { username: 'invalid.user', password: 'demo123' },
      expectedRole: 'therapist', // Won't matter since should fail
      expectedName: '',
      status: 'pending'
    },
    {
      id: 'invalid-password',
      name: 'Credenciais Inválidas - Senha',
      description: 'Teste com senha incorreta',
      credentials: { username: 'dr.delete', password: 'wrongpassword' },
      expectedRole: 'therapist', // Won't matter since should fail
      expectedName: '',
      status: 'pending'
    },
    {
      id: 'empty-credentials',
      name: 'Credenciais Vazias',
      description: 'Teste com campos vazios',
      credentials: { username: '', password: '' },
      expectedRole: 'therapist', // Won't matter since should fail
      expectedName: '',
      status: 'pending'
    }
  ]

  const [tests, setTests] = useState(testCases)

  const runTest = async (testCase: TestCase) => {
    setCurrentTest(testCase.id)
    setTests(prev => prev.map(t => 
      t.id === testCase.id ? { 
        ...t, 
        status: 'running' as const,
        result: undefined
      } : t
    ))

    try {
      // First logout if authenticated
      if (isAuthenticated) {
        logout()
        // Wait a bit for logout to complete
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const loginSuccess = await login(testCase.credentials.username, testCase.credentials.password)
      
      // For invalid credential tests, we expect failure
      const isInvalidTest = testCase.id.includes('invalid') || testCase.id.includes('empty')
      
      if (isInvalidTest) {
        if (!loginSuccess) {
          // Success - login correctly failed
          setTests(prev => prev.map(t => 
            t.id === testCase.id ? { 
              ...t, 
              status: 'passed' as const,
              result: 'Login corretamente rejeitado para credenciais inválidas'
            } : t
          ))
          setTestResults(prev => ({
            ...prev,
            [testCase.id]: { success: true, message: 'Rejection test passed' }
          }))
        } else {
          // Failure - login should have failed but succeeded
          setTests(prev => prev.map(t => 
            t.id === testCase.id ? { 
              ...t, 
              status: 'failed' as const,
              result: 'Login deveria ter falhado mas foi aceito'
            } : t
          ))
          setTestResults(prev => ({
            ...prev,
            [testCase.id]: { success: false, message: 'Invalid credentials were accepted' }
          }))
        }
      } else {
        // For valid credential tests, we expect success
        if (loginSuccess) {
          // Wait a bit for auth state to update
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Get expected user data
          const expectedUser = MOCK_USERS[testCase.credentials.username]?.user
          
          if (expectedUser?.role === testCase.expectedRole && 
              expectedUser?.name === testCase.expectedName) {
            setTests(prev => prev.map(t => 
              t.id === testCase.id ? { 
                ...t, 
                status: 'passed' as const,
                result: `Login bem-sucedido como ${expectedUser.role}: ${expectedUser.name}`
              } : t
            ))
            setTestResults(prev => ({
              ...prev,
              [testCase.id]: { success: true, user: expectedUser }
            }))
          } else {
            setTests(prev => prev.map(t => 
              t.id === testCase.id ? { 
                ...t, 
                status: 'failed' as const,
                result: `Dados do usuário não conferem: esperado ${testCase.expectedRole}/${testCase.expectedName}`
              } : t
            ))
            setTestResults(prev => ({
              ...prev,
              [testCase.id]: { success: false, message: 'User data mismatch' }
            }))
          }
        } else {
          setTests(prev => prev.map(t => 
            t.id === testCase.id ? { 
              ...t, 
              status: 'failed' as const,
              result: 'Login falhou com credenciais válidas'
            } : t
          ))
          setTestResults(prev => ({
            ...prev,
            [testCase.id]: { success: false, message: 'Valid login failed' }
          }))
        }
      }
    } catch (error) {
      setTests(prev => prev.map(t => 
        t.id === testCase.id ? { 
          ...t, 
          status: 'failed' as const,
          result: `Erro durante o teste: ${error instanceof Error ? error.message : 'Unknown error'}`
        } : t
      ))
      setTestResults(prev => ({
        ...prev,
        [testCase.id]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }

    setCurrentTest(null)
  }

  const runAllTests = async () => {
    for (const testCase of tests) {
      await runTest(testCase)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const resetTests = () => {
    setTests(testCases.map(t => ({ ...t, status: 'pending' as const, result: undefined })))
    setTestResults({})
    setCurrentTest(null)
    if (isAuthenticated) {
      logout()
    }
  }

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-muted-foreground" />
      case 'running':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      case 'passed':
        return <CheckCircle size={16} className="text-green-600" />
      case 'failed':
        return <XCircle size={16} className="text-red-600" />
    }
  }

  const getStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>
      case 'running':
        return <Badge className="bg-blue-500">Executando</Badge>
      case 'passed':
        return <Badge className="bg-green-500">Passou</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
    }
  }

  const passedTests = tests.filter(t => t.status === 'passed').length
  const failedTests = tests.filter(t => t.status === 'failed').length
  const totalTests = tests.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary rounded-xl">
            <TestTube size={32} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sistema de Testes de Login
        </h1>
        <p className="text-muted-foreground">
          Validação completa do sistema de autenticação
        </p>
      </div>

      {/* Current Status */}
      {isAuthenticated && (
        <Alert>
          <AlertDescription>
            Usuário atual logado: <strong>{user?.name}</strong> ({user?.role})
            <Button 
              variant="link" 
              size="sm" 
              className="ml-2 p-0 h-auto"
              onClick={requestLogout}
            >
              <LogOut size={14} className="mr-1" />
              Sair
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube size={20} />
            Resumo dos Testes
          </CardTitle>
          <CardDescription>
            {passedTests}/{totalTests} testes aprovados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-green-600 font-medium">
              ✓ {passedTests} Passou
            </div>
            <div className="text-red-600 font-medium">
              ✗ {failedTests} Falhou
            </div>
            <div className="text-muted-foreground font-medium">
              ○ {totalTests - passedTests - failedTests} Pendente
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={currentTest !== null}
            >
              <PlayCircle size={16} className="mr-2" />
              Executar Todos os Testes
            </Button>
            <Button 
              variant="outline"
              onClick={resetTests}
              disabled={currentTest !== null}
            >
              Resetar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Tabs defaultValue="test-cases">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test-cases">Casos de Teste</TabsTrigger>
          <TabsTrigger value="results">Resultados Detalhados</TabsTrigger>
        </TabsList>

        <TabsContent value="test-cases" className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(test.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runTest(test)}
                      disabled={currentTest !== null}
                    >
                      Executar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Credenciais</h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Usuário:</strong> {test.credentials.username || '(vazio)'}</div>
                      <div><strong>Senha:</strong> {test.credentials.password || '(vazio)'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Resultado Esperado</h4>
                    <div className="text-sm">
                      {test.id.includes('invalid') || test.id.includes('empty') ? (
                        <div className="text-red-600">Login deve falhar</div>
                      ) : (
                        <div className="space-y-1">
                          <div><strong>Papel:</strong> {test.expectedRole}</div>
                          <div><strong>Nome:</strong> {test.expectedName}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {test.result && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium mb-1">Resultado</h4>
                    <p className="text-sm">{test.result}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Detalhados</CardTitle>
              <CardDescription>
                Informações técnicas sobre a execução dos testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(testResults).length === 0 ? (
                <p className="text-muted-foreground">Nenhum teste executado ainda.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(testResults).map(([testId, result]) => {
                    const test = tests.find(t => t.id === testId)
                    return (
                      <div key={testId} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(test?.status || 'pending')}
                          <h4 className="font-medium">{test?.name}</h4>
                        </div>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Demo Access Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Acesso Rápido Demo
          </CardTitle>
          <CardDescription>
            Faça login diretamente com as contas demo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-4"
              onClick={() => runTest(tests.find(t => t.id === 'therapist-login')!)}
              disabled={currentTest !== null}
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Stethoscope size={20} className="text-primary" />
              </div>
              <div className="text-left">
                <div className="font-medium">Acessar como Terapeuta</div>
                <div className="text-xs text-muted-foreground">Dr. Smith</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-auto p-4"
              onClick={() => runTest(tests.find(t => t.id === 'patient-login')!)}
              disabled={currentTest !== null}
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <User size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Acessar como Paciente</div>
                <div className="text-xs text-muted-foreground">Rodrigo Marques</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog />
    </div>
  )
}