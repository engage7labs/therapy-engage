import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { useAuth } from '../../contexts/auth-context'
import { User, Stethoscope, Shield, Lock } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDemo, setSelectedDemo] = useState<'therapist' | 'patient'>('therapist')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError('Invalid credentials. Please check your username and password.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Login error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoType: 'therapist' | 'patient') => {
    setError('')
    setIsLoading(true)
    
    try {
      const credentials = demoType === 'therapist' 
        ? { username: 'dr.smith', password: 'demo123' }
        : { username: 'rodrigo', password: 'demo123' }
      
      const success = await login(credentials.username, credentials.password)
      if (!success) {
        setError('Demo login failed. Please try again.')
      }
    } catch (error) {
      console.error('Demo login error:', error)
      setError('Demo login error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Login
          </CardTitle>
          <CardDescription>
            Therapy Engage Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Tabs value={selectedDemo} onValueChange={(value) => setSelectedDemo(value as 'therapist' | 'patient')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="therapist" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Therapist
              </TabsTrigger>
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="therapist" className="space-y-4 mt-4">
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  <Shield className="w-3 h-3 mr-1" />
                  Demo Therapist Account
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full access to therapist dashboard and patient management
                </p>
              </div>
              
              <Button 
                onClick={() => handleDemoLogin('therapist')}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Login as Dr. Smith'}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                Username: dr.smith | Password: demo123
              </div>
            </TabsContent>
            
            <TabsContent value="patient" className="space-y-4 mt-4">
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <User className="w-3 h-3 mr-1" />
                  Demo Patient Account
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Patient portal with session access and personal dashboard
                </p>
              </div>
              
              <Button 
                onClick={() => handleDemoLogin('patient')}
                disabled={isLoading}
                className="w-full"
                size="lg"
                variant="outline"
              >
                {isLoading ? 'Signing in...' : 'Login as Rodrigo'}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                Username: rodrigo | Password: demo123
              </div>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or manual login</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}