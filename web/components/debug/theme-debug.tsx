"use client";

import { useColorTheme } from "@/hooks/use-color-theme";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const { colorTheme } = useColorTheme();
  const [bodyClasses, setBodyClasses] = useState<string>("");

  useEffect(() => {
    const updateBodyClasses = () => {
      setBodyClasses(document.body.className);
    };

    updateBodyClasses();

    // Observer para mudanças nas classes do body
    const observer = new MutationObserver(updateBodyClasses);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
      <div>
        <strong>Color Theme:</strong> {colorTheme}
      </div>
      <div>
        <strong>Body Classes:</strong> {bodyClasses}
      </div>
      <div>
        <strong>Expected:</strong> theme-bg-{colorTheme}
      </div>
    </div>
  );
}
