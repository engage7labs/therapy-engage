"use client";

import { useEffect } from "react";
import { useColorTheme } from "./use-color-theme";

export function useThemeBackground() {
  const { colorTheme } = useColorTheme();

  useEffect(() => {
    // Não aplicamos mais ao body, pois agora usamos o wrapper div
    // O background é aplicado diretamente no ThemeBackgroundWrapper
    console.log("Current color theme:", colorTheme);
  }, [colorTheme]);

  return colorTheme;
}
