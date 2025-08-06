import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ApolloWrapper } from '@/components/apollo-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Therapy Engage Portal',
  description: 'Mental health platform for therapists and clients',
  keywords: ['therapy', 'mental health', 'psychology', 'teletherapy'],
  authors: [{ name: 'Therapy Engage Platform' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'noindex, nofollow', // Development only
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <ApolloWrapper>
          <div className="min-h-full">
            {children}
          </div>
        </ApolloWrapper>
      </body>
    </html>
  )
}