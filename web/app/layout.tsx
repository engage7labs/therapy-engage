import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeBackgroundWrapper } from "../components/theme/theme-background-wrapper";
import { ColorThemeProvider } from "../hooks/use-color-theme";
import { ThemeProvider } from "../hooks/use-theme";
import { AuthProvider } from "./contexts/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Therapy Engage - Professional Therapy Platform",
  description:
    "Professional therapy platform with session management and patient care tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <ColorThemeProvider>
            <ThemeBackgroundWrapper>
              <AuthProvider>{children}</AuthProvider>
            </ThemeBackgroundWrapper>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
