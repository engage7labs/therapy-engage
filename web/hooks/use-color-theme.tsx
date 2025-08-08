"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ColorTheme, ThemeColors, colorThemes } from "../lib/color-themes";
import { useInlineStyles } from "./use-inline-styles";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  colors: ThemeColors;
  setColorTheme: (theme: ColorTheme) => void;
  getButtonClasses: (
    variant:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "cancel"
  ) => string;
  getButtonStyle: (
    variant: "primary" | "secondary" | "success" | "warning" | "danger"
  ) => React.CSSProperties;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(
  undefined
);

export function ColorThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("ocean");
  const { getButtonStyle: getInlineButtonStyle } = useInlineStyles(colorTheme);

  // Carregar tema salvo do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "therapy-engage-color-theme"
    ) as ColorTheme;
    if (savedTheme && colorThemes[savedTheme]) {
      setColorThemeState(savedTheme);
    }
  }, []);

  // Salvar tema no localStorage
  const setColorTheme = useCallback((theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem("therapy-engage-color-theme", theme);

    // Aplicar variáveis CSS para os gradientes
    updateCSSVariables(colorThemes[theme]);
  }, []);

  // Atualizar variáveis CSS do tema
  const updateCSSVariables = (colors: ThemeColors) => {
    const root = document.documentElement;

    // Aplicar cores primárias
    Object.entries(colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });

    // Aplicar cores secundárias
    Object.entries(colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });

    // Aplicar gradientes
    Object.entries(colors.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });

    // Aplicar cores de ação
    Object.entries(colors.success).forEach(([key, value]) => {
      root.style.setProperty(`--color-success-${key}`, value);
    });

    Object.entries(colors.warning).forEach(([key, value]) => {
      root.style.setProperty(`--color-warning-${key}`, value);
    });

    Object.entries(colors.danger).forEach(([key, value]) => {
      root.style.setProperty(`--color-danger-${key}`, value);
    });

    // Aplicar background gradiente baseado no tema
    const backgroundGradient =
      colors.gradients.background || colors.gradients.primary;
    root.style.setProperty("--theme-background-gradient", backgroundGradient);

    // Aplicar cor do tema principal para backgrounds sutis
    root.style.setProperty("--theme-accent-color", colors.primary[500]);
    root.style.setProperty("--theme-accent-light", colors.primary[100]);
    root.style.setProperty("--theme-accent-dark", colors.primary[900]);
  };

  // Aplicar tema inicial
  useEffect(() => {
    updateCSSVariables(colorThemes[colorTheme]);
  }, [colorTheme]);

  // Aplicar tema inicial no mount
  useEffect(() => {
    // Garantir que as variáveis CSS sejam aplicadas na primeira renderização
    const initialTheme =
      (localStorage.getItem("therapy-engage-color-theme") as ColorTheme) ||
      "ocean";
    updateCSSVariables(colorThemes[initialTheme]);
  }, []);

  // Função para obter classes padronizadas de botões - DEPRECATED: Use getButtonStyle instead
  const getButtonClasses = useCallback(
    (
      variant:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
        | "cancel"
    ) => {
      // Base classes without dynamic colors - these will be overridden by inline styles
      const baseClasses =
        "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center gap-2 text-white border-0 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

      switch (variant) {
        case "primary":
          return `${baseClasses} focus:ring-blue-500`;
        case "secondary":
          return `${baseClasses} focus:ring-teal-500`;
        case "success":
          return `${baseClasses} focus:ring-green-500`;
        case "warning":
          return `${baseClasses} focus:ring-yellow-500`;
        case "danger":
          return `${baseClasses} focus:ring-red-500`;
        case "cancel":
          return "px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500";
        default:
          return baseClasses;
      }
    },
    [colorTheme]
  );

  // Função para obter estilos inline dos botões
  const getButtonStyle = useCallback(
    (
      variant: "primary" | "secondary" | "success" | "warning" | "danger"
    ): React.CSSProperties => {
      return getInlineButtonStyle(variant);
    },
    [getInlineButtonStyle]
  );

  const value = useMemo(
    () => ({
      colorTheme,
      colors: colorThemes[colorTheme],
      setColorTheme,
      getButtonClasses,
      getButtonStyle,
    }),
    [colorTheme, setColorTheme, getButtonClasses, getButtonStyle]
  );

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
}
