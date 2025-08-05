import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../../contexts/auth-context'
import { useTheme } from '../../contexts/theme-context'
import { InlineThemeLanguageControls } from '../settings/quick-theme-language-toggle'
import { User, Stethoscope, Shield, Lock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export function LoginPage() {
  const { login } = useAuth()
  const { t } = useTheme()
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
    } catch (err) {
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
        setError('Auto-login error. Please try manually.')
      }
    } catch (err) {
      setError('Login error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      {/* Theme and Language Controls - Top Right */}
      <div className="absolute top-4 right-4">
        <InlineThemeLanguageControls />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Stethoscope size={32} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Therapy Engage
          </h1>
          <p className="text-muted-foreground">
            International Therapeutic Consent Platform
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <CardTitle className="text-xl">{t('login.title')}</CardTitle>
              <CardDescription>
                Enter your credentials or use demonstration accounts
              </CardDescription>
            </div>

            {/* Demo Accounts Quick Access */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('login.demo_accounts')}</Label>
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => handleDemoLogin('therapist')}
                  disabled={isLoading}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Dr. Smith</div>
                    <div className="text-xs text-muted-foreground">Therapist • CRP-123456</div>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    Therapist
                  </Badge>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 h-auto p-4"
                  onClick={() => handleDemoLogin('patient')}
                  disabled={isLoading}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User size={20} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Rodrigo Marques</div>
                    <div className="text-xs text-muted-foreground">Patient • MSc Student</div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Patient
                  </Badge>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedDemo} onValueChange={(value) => setSelectedDemo(value as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="therapist" className="gap-2">
                  <Stethoscope size={16} />
                  Manual Login
                </TabsTrigger>
                <TabsTrigger value="patient" className="gap-2">
                  <Shield size={16} />
                  Credentials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="therapist" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('login.username')}</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="dr.smith or rodrigo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('login.password')}</Label>
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                        demo123
                      </Badge>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert className="border-destructive/50 text-destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full gap-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        {t('login.sign_in')}
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="patient" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Stethoscope size={16} />
                      Therapist Credentials
                    </h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Username:</strong> dr.smith</div>
                      <div><strong>Password:</strong> demo123</div>
                      <div className="text-xs text-muted-foreground">
                        Full access to clinical dashboard
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <User size={16} />
                      Patient Credentials
                    </h4>
                    <div className="text-sm space-y-1">
                      <div><strong>Username:</strong> rodrigo</div>
                      <div><strong>Password:</strong> demo123</div>
                      <div className="text-xs text-muted-foreground">
                        Patient portal with consent workflows
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center">
            <div className="w-full text-xs text-muted-foreground space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Shield size={12} />
                Secure GDPR/LGPD compliant system
              </div>
              <div>Therapy Engage Platform © 2025</div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}