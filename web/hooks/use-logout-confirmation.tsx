import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../app/contexts/auth-context";
import { useTheme } from "./use-theme";

export function useLogoutConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { t } = useTheme();

  const requestLogout = () => {
    setIsOpen(true);
  };

  const confirmLogout = () => {
    setIsOpen(false);
    logout();
  };

  const cancelLogout = () => {
    setIsOpen(false);
  };

  const LogoutConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
              <LogOut className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left text-lg font-semibold">
                {t("logout.confirmTitle")}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-left space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("logout.confirmMessage")}
          </p>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                {t("logout.securityNote")}
              </p>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                {t("logout.securityDetails")}
              </p>
            </div>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-6">
          <AlertDialogCancel
            onClick={cancelLogout}
            className="w-full sm:w-auto border border-border bg-background text-foreground hover:bg-secondary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmLogout}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white dark:text-white border-0"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    requestLogout,
    LogoutConfirmationDialog,
  };
}
