import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans, Noto_Sans_Arabic } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const notoSans = Noto_Sans({ 
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap'
})

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-noto-sans-arabic',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Therapy Engage Platform',
  description: 'Secure therapy platform with video calling, session recording, and comprehensive patient management for mental health professionals.',
  keywords: ['therapy', 'mental health', 'video calling', 'patient management', 'secure platform'],
  authors: [{ name: 'Rodrigo Marques Teixeira', url: 'https://github.com/TherapyEngageOrg' }],
  creator: 'Therapy Engage Platform',
  publisher: 'National College of Ireland - MSc Project',
  robots: 'noindex, nofollow', // Development environment
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.variable} ${notoSans.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={300}>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}