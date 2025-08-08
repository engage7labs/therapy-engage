"use client";

import { useColorTheme } from "../../hooks/use-color-theme";
import { cn } from "../../lib/utils";

interface ThemedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "cancel";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function ThemedButton({
  variant = "primary",
  size = "md",
  children,
  className,
  style,
  ...props
}: ThemedButtonProps) {
  const { getButtonStyle } = useColorTheme();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Base classes without dynamic colors
  const baseClasses =
    variant === "cancel"
      ? "rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      : "rounded-md font-medium transition-all duration-200 flex items-center gap-2 text-white border-0 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const combinedClasses = cn(baseClasses, sizeClasses[size], className);

  // Get inline styles for color variants (not for cancel)
  const buttonStyle = variant !== "cancel" ? getButtonStyle(variant) : {};
  const combinedStyle = { ...buttonStyle, ...style };

  return (
    <button className={combinedClasses} style={combinedStyle} {...props}>
      {children}
    </button>
  );
}
