'use client'

import { useTheme } from '../../hooks/use-theme'
import { QuickThemeLanguageToggle, InlineThemeLanguageControls } from '../../components/settings/quick-theme-language-toggle'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'

export default function ThemeTestPage() {
  const { theme, language, t } = useTheme()

  return (
    <div className="min-h-screen p-8 bg-background text-foreground transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header com controles de tema/idioma */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              Current Theme: {theme} | Current Language: {language}
            </p>
          </div>
          <QuickThemeLanguageToggle />
        </div>

        {/* Cards de demonstração */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t('patients.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('dashboard.stats.patients')}</p>
            <Button>{t('patients.add_new')}</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t('sessions.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('sessions.upcoming')}</p>
            <Button variant="outline">{t('sessions.start_session')}</Button>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">{t('emergency.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('emergency.critical_alert')}</p>
            <Button variant="destructive">{t('emergency.call')}</Button>
          </Card>
        </div>

        {/* Controles inline alternativos */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Alternative Controls</h3>
          <InlineThemeLanguageControls />
        </div>

        {/* Demonstração de traduções */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{t('settings.language')} Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Navigation:</h4>
              <ul className="space-y-1">
                <li>• {t('nav.dashboard')}</li>
                <li>• {t('nav.patients')}</li>
                <li>• {t('nav.sessions')}</li>
                <li>• {t('nav.settings')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Common Actions:</h4>
              <ul className="space-y-1">
                <li>• {t('common.save')}</li>
                <li>• {t('common.cancel')}</li>
                <li>• {t('common.edit')}</li>
                <li>• {t('common.delete')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Risk levels demo */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Levels</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {t('risk.low')}
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {t('risk.moderate')}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              {t('risk.high')}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              {t('risk.critical')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
