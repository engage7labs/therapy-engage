import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTheme } from '../contexts/theme-context'
import { useAuth } from '../contexts/auth-context'
import { LogOut, Shield } from '@phosphor-icons/react'

export function useLogoutConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  const { t } = useTheme()

  const requestLogout = () => {
    setIsOpen(true)
  }

  const confirmLogout = () => {
    setIsOpen(false)
    logout()
  }

  const cancelLogout = () => {
    setIsOpen(false)
  }

  const LogoutConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
              <LogOut className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                {t('logout.confirmTitle')}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-left space-y-3">
          <p>
            {t('logout.confirmMessage')}
          </p>
          
          <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">{t('logout.securityNote')}</p>
              <p className="text-xs">{t('logout.securityDetails')}</p>
            </div>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter className="flex space-x-2">
          <AlertDialogCancel 
            onClick={cancelLogout}
            className="flex items-center space-x-2"
          >
            <span>{t('common.cancel')}</span>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmLogout}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('logout.confirm')}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return {
    requestLogout,
    LogoutConfirmationDialog
  }
}