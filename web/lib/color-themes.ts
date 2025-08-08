// Sistema de Temas de Cores - Therapy Engage Platform

export type ColorTheme = "ocean" | "nature" | "accessibility";

export interface ThemeColors {
  // Cores primárias
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Cores secundárias
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Cores de ação
  success: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  warning: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  danger: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };

  // Gradientes para botões
  gradients: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    success: string;
    successHover: string;
    warning: string;
    warningHover: string;
    danger: string;
    dangerHover: string;
  };
}

// 🌊 TEMA OCEAN - Azuis e verdes oceânicos (Slate, Pewter, Blue Grotto, Tiffany Blue)
const oceanTheme: ThemeColors = {
  primary: {
    50: "#f0f7f8",
    100: "#c9d8d0",
    200: "#a8c4cc",
    300: "#87b0c8",
    400: "#7c9da0",
    500: "#2187b0",
    600: "#1e7a9f",
    700: "#1a6d8e",
    800: "#16607d",
    900: "#12536c",
  },
  secondary: {
    50: "#f0fcfd",
    100: "#c1f7f9",
    200: "#92f2f5",
    300: "#63edf1",
    400: "#3ac5d0",
    500: "#32b3bd",
    600: "#2aa1aa",
    700: "#228f97",
    800: "#1a7d84",
    900: "#126b71",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  gradients: {
    primary: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    primaryHover: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    secondary: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    secondaryHover: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    successHover: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    warningHover: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    dangerHover: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  },
};

// 🌿 TEMA NATURE - Tons naturais (Black, Olive, Blue Gray, Gunmetal Gray)
const natureTheme: ThemeColors = {
  primary: {
    50: "#f8f9f8",
    100: "#acafac",
    200: "#989b98",
    300: "#848784",
    400: "#707370",
    500: "#858137",
    600: "#79752f",
    700: "#6d6927",
    800: "#615d1f",
    900: "#242d0b",
  },
  secondary: {
    50: "#f5f6f7",
    100: "#8797a6",
    200: "#7a8999",
    300: "#6d7b8c",
    400: "#606d7f",
    500: "#535f72",
    600: "#4a5567",
    700: "#414b5c",
    800: "#384151",
    900: "#2f3746",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  gradients: {
    primary: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
    primaryHover: "linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%)",
    secondary: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    secondaryHover: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    success: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    successHover: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    warningHover: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    danger: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    dangerHover: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
  },
};

// ♿ TEMA ACCESSIBILITY - Alto contraste (White, Black, Gray, Snow, Black Gray)
const accessibilityTheme: ThemeColors = {
  primary: {
    50: "#FFFFFF",
    100: "#F0F0F0",
    200: "#E6E6E6",
    300: "#CCCCCC",
    400: "#B3B3B3",
    500: "#808080",
    600: "#666666",
    700: "#4D4D4D",
    800: "#1A1A1A",
    900: "#000000",
  },
  secondary: {
    50: "#FFFFFF",
    100: "#F0F0F0",
    200: "#E0E0E0",
    300: "#D0D0D0",
    400: "#C0C0C0",
    500: "#808080",
    600: "#606060",
    700: "#404040",
    800: "#1A1A1A",
    900: "#000000",
  },
  success: {
    50: "#ffffff",
    100: "#f0fdf4",
    500: "#16a34a",
    600: "#15803d",
    700: "#14532d",
  },
  warning: {
    50: "#ffffff",
    100: "#fffbeb",
    500: "#ca8a04",
    600: "#a16207",
    700: "#854d0e",
  },
  danger: {
    50: "#ffffff",
    100: "#fef2f2",
    500: "#dc2626",
    600: "#b91c1c",
    700: "#991b1b",
  },
  gradients: {
    primary: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    primaryHover: "linear-gradient(135deg, #475569 0%, #334155 100%)",
    secondary: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
    secondaryHover: "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
    success: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    successHover: "linear-gradient(135deg, #15803d 0%, #14532d 100%)",
    warning: "linear-gradient(135deg, #ca8a04 0%, #a16207 100%)",
    warningHover: "linear-gradient(135deg, #a16207 0%, #854d0e 100%)",
    danger: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    dangerHover: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
  },
};

export const colorThemes: Record<ColorTheme, ThemeColors> = {
  ocean: oceanTheme,
  nature: natureTheme,
  accessibility: accessibilityTheme,
};

export const themeLabels: Record<
  ColorTheme,
  { name: string; icon: string; description: string }
> = {
  ocean: {
    name: "Ocean",
    icon: "🌊",
    description: "Tons oceânicos suaves",
  },
  nature: {
    name: "Nature",
    icon: "🌿",
    description: "Cores naturais vibrantes",
  },
  accessibility: {
    name: "Contraste",
    icon: "♿",
    description: "Alto contraste visual",
  },
};
