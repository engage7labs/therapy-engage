'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../hooks/use-theme'
import { Button } from '../ui/button'
import { Moon, Sun, Check, ChevronDown } from 'lucide-react'

type Language = 'en' | 'pt' | 'es'

export function DebugThemeLanguageToggle() {
  const { theme, language, setTheme, setLanguage, t } = useTheme()
  const [showThemeSuccess, setShowThemeSuccess] = useState(false)
  const [showLanguageSuccess, setShowLanguageSuccess] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    setShowThemeSuccess(true)
    setTimeout(() => setShowThemeSuccess(false), 1500)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setShowLanguageSuccess(true)
    setIsDropdownOpen(false)
    setTimeout(() => setShowLanguageSuccess(false), 1500)
  }

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
    { value: 'pt', label: 'Português', flag: '🇧🇷', short: 'PT' },
    { value: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' }
  ]

  const currentLanguage = languageOptions.find(lang => lang.value === language)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

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

      {/* Language Dropdown - Custom Implementation */}
      <div className="relative" ref={dropdownRef}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="language-indicator h-8 px-2 gap-1 bg-muted/50 hover:bg-muted relative"
          title={t('tooltip.language_toggle')}
        >
          <span className="text-sm">{currentLanguage?.flag}</span>
          <span className="text-xs font-medium">{currentLanguage?.short}</span>
          <ChevronDown className={`h-3 w-3 opacity-70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          {showLanguageSuccess && (
            <div className="absolute -top-1 -right-1">
              <Check className="h-3 w-3 text-green-500 animate-in fade-in-0 duration-300" />
            </div>
          )}
        </Button>

        {/* Custom Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 bg-background border rounded-md shadow-lg z-[100] overflow-hidden">
            <div className="p-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                {t('settings.language')}
              </span>
            </div>
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value as Language)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{option.flag}</span>
                  <span>{option.label}</span>
                </div>
                {language === option.value && (
                  <Check className="h-3 w-3 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
