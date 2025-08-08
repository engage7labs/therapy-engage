import { ColorTheme } from "../lib/color-themes";

// Hook para obter estilos inline baseados no tema
export function useInlineStyles(colorTheme: ColorTheme) {
  const getButtonStyle = (
    variant: "primary" | "secondary" | "success" | "warning" | "danger"
  ): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      border: "none",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
      backgroundSize: "200% 200%",
      animation: "gradientShift 3s ease infinite",
    };

    switch (colorTheme) {
      case "ocean":
        switch (variant) {
          case "primary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #2187b0 0%, #7c9da0 50%, #c9d8d0 100%)",
            };
          case "secondary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #3ac5d0 0%, #32b3bd 50%, #2aa1aa 100%)",
            };
          case "success":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
            };
          case "warning":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            };
          case "danger":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
            };
        }
        break;

      case "nature":
        switch (variant) {
          case "primary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #858137 0%, #707370 50%, #242d0b 100%)",
            };
          case "secondary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #8797a6 0%, #606d7f 50%, #2f3746 100%)",
            };
          case "success":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
            };
          case "warning":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
            };
          case "danger":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
            };
        }
        break;

      case "accessibility":
        switch (variant) {
          case "primary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #808080 0%, #1A1A1A 50%, #000000 100%)",
              color: "#FFFFFF",
            };
          case "secondary":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #F0F0F0 0%, #808080 50%, #1A1A1A 100%)",
              color: "#000000",
            };
          case "success":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)",
            };
          case "warning":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #ca8a04 0%, #a16207 50%, #854d0e 100%)",
            };
          case "danger":
            return {
              ...baseStyle,
              background:
                "linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)",
            };
        }
        break;
    }

    // Fallback
    return {
      ...baseStyle,
      background:
        "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
    };
  };

  return { getButtonStyle };
}
