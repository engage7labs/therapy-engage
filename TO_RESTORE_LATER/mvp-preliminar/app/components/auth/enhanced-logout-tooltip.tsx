import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { LogOut, Shield, Clock, Info } from 'lucide-react'
import { useTheme } from '../../contexts/theme-context'

interface EnhancedLogoutTooltipProps {
  onLogoutRequest: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function EnhancedLogoutTooltip({
  onLogoutRequest,
  variant = "ghost",
  size = "icon",
  className = ""
}: EnhancedLogoutTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`logout-button ${className}`}
          onClick={onLogoutRequest}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LogOut 
            size={20} 
            className="logout-icon" />
        </Button>
      </TooltipTrigger>
      
      <TooltipContent
        side="bottom"
        align="end"
        className="tooltip-enhanced p-0 w-72"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LogOut size={16} className="text-destructive" />
              {t('logout.confirmTitle')}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3 pt-0">
            <Separator className="mb-3" />
            
            {/* Security info */}
            <div className="flex items-start gap-2">
              <Shield className="text-primary mt-0.5" size={14} />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  {t('logout.securityNote')}
                </p>
                <p>
                  {t('logout.securityDetails')}
                </p>
              </div>
            </div>

            {/* Session info */}
            <div className="flex items-start gap-2">
              <Clock className="text-orange-500 mt-0.5" size={14} />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  Session Management
                </p>
                <p>
                  Active sessions will be safely terminated
                </p>
              </div>
            </div>

            {/* Action preview */}
            <div className="flex items-start gap-2">
              <Info className="text-blue-500 mt-0.5" size={14} />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground">
                  {t('tooltip.logout_preview')}
                </p>
                <p>
                  Click to show confirmation dialog
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipContent>
    </Tooltip>
  )
}