import { useState } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Moon, Sun, Globe, Palette, Check } from 'lucide-react'

export function ThemeLanguageSettings() {
  const { theme, language, setTheme, setLanguage, t } = useTheme()
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light'
    setTheme(newTheme)
    setShowSuccess('theme')
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const handleLanguageChange = (newLanguage: 'en' | 'pt' | 'es') => {
    setLanguage(newLanguage)
    setShowSuccess('language')
    setTimeout(() => setShowSuccess(null), 2000)
  }

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'pt', label: 'Português', flag: '🇧🇷' },
    { value: 'es', label: 'Español', flag: '🇪🇸' }
  ]

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.theme')}</CardTitle>
              <CardDescription>
                Switch between light and dark theme for comfortable viewing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
              <div className="space-y-1">
                <Label htmlFor="theme-switch" className="text-sm font-medium">
                  {theme === 'dark' ? t('settings.dark_mode') : t('settings.light_mode')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {theme === 'dark' 
                    ? 'Dark theme reduces eye strain in low light environments'
                    : 'Light theme provides optimal readability in bright environments'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showSuccess === 'theme' && (
                <Check className="h-4 w-4 text-green-500 animate-in fade-in-0 duration-300" />
              )}
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.language')}</CardTitle>
              <CardDescription>
                Select your preferred language for the interface
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="language-select" className="text-sm font-medium">
                Interface Language
              </Label>
              <p className="text-xs text-muted-foreground">
                Changes all text and labels throughout the application
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showSuccess === 'language' && (
                <Check className="h-4 w-4 text-green-500 animate-in fade-in-0 duration-300" />
              )}
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Theme Preview */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Theme Preview</CardTitle>
          <CardDescription>
            Preview how the interface looks in different themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Light Theme Preview */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeChange(false)}
            >
              <div className="bg-white rounded-md p-3 space-y-2 shadow-sm">
                <div className="h-2 bg-gray-900 rounded w-3/4"></div>
                <div className="h-1.5 bg-gray-600 rounded w-1/2"></div>
                <div className="h-1 bg-gray-400 rounded w-2/3"></div>
              </div>
              <p className="text-center mt-2 text-sm font-medium">Light</p>
            </div>

            {/* Dark Theme Preview */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeChange(true)}
            >
              <div className="bg-gray-900 rounded-md p-3 space-y-2 shadow-sm">
                <div className="h-2 bg-white rounded w-3/4"></div>
                <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
                <div className="h-1 bg-gray-500 rounded w-2/3"></div>
              </div>
              <p className="text-center mt-2 text-sm font-medium">Dark</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Examples */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Language Examples</CardTitle>
          <CardDescription>
            See how key terms appear in different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {languageOptions.map((option) => (
              <div 
                key={option.value}
                className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                  language === option.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleLanguageChange(option.value as 'en' | 'pt' | 'es')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.flag}</span>
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.value === 'en' && 'Dashboard • Patients • Critical Alert'}
                        {option.value === 'pt' && 'Painel • Pacientes • Alerta Crítico'}
                        {option.value === 'es' && 'Panel • Pacientes • Alerta Crítica'}
                      </p>
                    </div>
                  </div>
                  {language === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}