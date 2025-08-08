"use client";

import { useColorTheme } from "@/hooks/use-color-theme";
import { useTheme } from "@/hooks/use-theme";

export function QuickThemeLanguageToggle() {
  const { theme, setTheme, language, setLanguage } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getThemeIcon = () => {
    return theme === "dark" ? "🌙" : "☀️";
  };

  const getColorThemeIcon = () => {
    switch (colorTheme) {
      case "ocean":
        return "🌊";
      case "nature":
        return "🌿";
      case "accessibility":
        return "♿";
      default:
        return "🌊";
    }
  };

  const getLanguageIcon = () => {
    switch (language) {
      case "en":
        return "🇺🇸";
      case "pt":
        return "🇧🇷";
      case "es":
        return "🇪🇸";
      default:
        return "🇺🇸";
    }
  };

  const handleLanguageToggle = () => {
    const languages = ["en", "pt", "es"] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const handleColorThemeToggle = () => {
    const themes = ["ocean", "nature", "accessibility"] as const;
    const currentIndex = themes.indexOf(colorTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setColorTheme(themes[nextIndex]);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Color Theme Toggle */}
      <button
        onClick={handleColorThemeToggle}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:border-gray-400 transition-colors bg-white/80 hover:bg-white/90 backdrop-blur-sm"
        title={`Current theme: ${colorTheme}`}
      >
        <span className="text-lg">{getColorThemeIcon()}</span>
      </button>

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:border-gray-400 transition-colors bg-white/80 hover:bg-white/90 backdrop-blur-sm"
        title={`Current mode: ${theme}`}
      >
        <span className="text-lg">{getThemeIcon()}</span>
      </button>

      {/* Language Toggle */}
      <button
        onClick={handleLanguageToggle}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:border-gray-400 transition-colors bg-white/80 hover:bg-white/90 backdrop-blur-sm"
        title={`Current language: ${language}`}
      >
        <span className="text-lg">{getLanguageIcon()}</span>
      </button>
    </div>
  );
}
