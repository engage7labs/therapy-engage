import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { EnhancedLogoutTooltip } from '@/components/auth/enhanced-logout-tooltip'
import { useTheme } from '../../contexts/theme-context'
import { useLogoutConfirmation } from '@/hooks/use-logout-confirmation'
import { 
  Info, 
  Settings, 
  LogOut, 
  User, 
  Bell, 
  Shield,
  Globe,
  Sun,
  Moon,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Heart
} from 'lucide-react'

export function TooltipDemoPage() {
  const { t, theme } = useTheme()
  const { requestLogout } = useLogoutConfirmation()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Enhanced Tooltip System Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Basic Tooltips */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Basic Tooltips</h3>
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('tooltip.profile')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('tooltip.settings')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Language
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('tooltip.language_toggle')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    {theme === 'light' ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    Theme
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('tooltip.theme_toggle')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator />

          {/* Multi-line Tooltips */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Multi-line Tooltips</h3>
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Alerts
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">Critical Audio Alerts</p>
                    <p className="text-xs opacity-80">Configure sound notifications for urgent patient situations requiring immediate attention.</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">GDPR/LGPD Compliance</p>
                    <p className="text-xs opacity-80">All patient data is encrypted and handled according to international privacy regulations.</p>
                    <div className="flex items-center gap-1 text-xs opacity-70">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified compliance</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Emergency
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium text-red-100">Emergency Contact</p>
                    <p className="text-xs opacity-80">Send urgent WhatsApp messages to high-risk patients requiring immediate intervention.</p>
                    <div className="flex items-center gap-1 text-xs opacity-70">
                      <AlertTriangle className="h-3 w-3" />
                      <span>For critical situations only</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator />

          {/* Enhanced Logout Tooltip */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Enhanced Logout Tooltip with Preview</h3>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This tooltip shows a preview of the logout confirmation dialog that will appear when clicked.
                </p>
                <EnhancedLogoutTooltip 
                  onLogoutRequest={requestLogout}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tooltip Positioning */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Tooltip Positioning</h3>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div></div>
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Top</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Tooltip positioned on top</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div></div>

              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Left</Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Tooltip positioned on left</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Center</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Default positioned tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Right</Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Tooltip positioned on right</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div></div>
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Bottom</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Tooltip positioned on bottom</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div></div>
            </div>
          </div>

          <Separator />

          {/* Implementation Guidelines */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Implementation Guidelines</h3>
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-pink-500 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium">Best Practices</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keep tooltip content concise and helpful</li>
                    <li>• Use tooltips for additional context, not essential information</li>
                    <li>• Ensure tooltips work with keyboard navigation</li>
                    <li>• Position tooltips to avoid covering important content</li>
                    <li>• Include icons in tooltips for visual context when helpful</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}