"use client";

import { useColorTheme } from "../../hooks/use-color-theme";
import { useThemeBackground } from "../../hooks/use-theme-background";

export function ThemeBackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorTheme } = useColorTheme();
  useThemeBackground(); // Aplica automaticamente o background temático

  return (
    <div className={`theme-bg-${colorTheme} min-h-screen`}>{children}</div>
  );
}
