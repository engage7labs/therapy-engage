"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useColorTheme } from "../../hooks/use-color-theme";
import { useTheme } from "../../hooks/use-theme";
import { ColorTheme, themeLabels } from "../../lib/color-themes";
import { Button } from "./button";

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const { t } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentTheme = themeLabels[colorTheme];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 bg-muted/50 hover:bg-muted"
        title={`${t("themes.current")}: ${t(`themes.${colorTheme}` as any)}`}
      >
        <span className="text-sm">{currentTheme.icon}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg z-[100] overflow-hidden">
          <div className="p-2 border-b bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">
              {t("themes.current")}
            </span>
          </div>

          {Object.entries(themeLabels).map(([themeKey, theme]) => (
            <button
              key={themeKey}
              onClick={() => handleThemeChange(themeKey as ColorTheme)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{theme.icon}</span>
                <span>{t(`themes.${themeKey}` as any)}</span>
              </div>
              {colorTheme === themeKey && (
                <Check className="h-3 w-3 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
