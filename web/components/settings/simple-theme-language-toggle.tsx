'use client'

import { useState } from 'react'
import { useTheme } from '../../hooks/use-theme'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Moon, Sun, Globe, Check } from 'lucide-react'

type Language = 'en' | 'pt' | 'es'

export function SimpleThemeLanguageToggle() {
  const { theme, language, setTheme, setLanguage, t } = useTheme()
  const [showThemeSuccess, setShowThemeSuccess] = useState(false)
  const [showLanguageSuccess, setShowLanguageSuccess] = useState(false)

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setShowThemeSuccess(true)
    setTimeout(() => setShowThemeSuccess(false), 1500)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setShowLanguageSuccess(true)
    setTimeout(() => setShowLanguageSuccess(false), 1500)
  }

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
    { value: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
    { value: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' }
  ]

  const currentLanguage = languageOptions.find(lang => lang.value === language)

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleThemeToggle}
          className="theme-toggle h-8 w-8 p-0 relative"
          title={t('tooltip.theme_toggle')}
        >
          {theme === 'light' ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-blue-400" />
          )}
          {showThemeSuccess && (
            <div className="absolute -top-1 -right-1">
              <Check className="h-3 w-3 text-green-500 animate-in fade-in-0 duration-300" />
            </div>
          )}
        </Button>
      </div>

      {/* Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="language-indicator h-8 px-2 gap-1 bg-muted/50 hover:bg-muted relative"
            title={t('tooltip.language_toggle')}
          >
            <span className="text-sm">{currentLanguage?.flag}</span>
            <span className="text-xs font-medium">{currentLanguage?.short}</span>
            <Globe className="h-3 w-3 opacity-70" />
            {showLanguageSuccess && (
              <div className="absolute -top-1 -right-1">
                <Check className="h-3 w-3 text-green-500 animate-in fade-in-0 duration-300" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel className="text-xs">
            {t('settings.language')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languageOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleLanguageChange(option.value as Language)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>{option.flag}</span>
                <span className="text-sm">{option.label}</span>
              </div>
              {language === option.value && (
                <Check className="h-3 w-3 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Alternative compact inline version
export function InlineThemeLanguageControls() {
  const { theme, language, setTheme, setLanguage } = useTheme()

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  const languageOptions = [
    { value: 'en', flag: '🇺🇸', label: 'EN' },
    { value: 'pt', flag: '🇧🇷', label: 'PT' },
    { value: 'es', flag: '🇪🇸', label: 'ES' }
  ]

  return (
    <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-lg">
      {/* Theme Switch */}
      <div className="flex items-center gap-2">
        <Sun className="h-3 w-3 text-yellow-500" />
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={handleThemeChange}
          className="scale-75 data-[state=checked]:bg-primary"
        />
        <Moon className="h-3 w-3 text-blue-400" />
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Language Buttons */}
      <div className="flex items-center gap-1">
        {languageOptions.map((option) => (
          <Button
            key={option.value}
            variant={language === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleLanguageChange(option.value as Language)}
            className="h-6 px-2 text-xs"
          >
            <span className="mr-1">{option.flag}</span>
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
