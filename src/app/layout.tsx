import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClientOnly } from '@/components/client-only'

export const metadata: Metadata = {
  title: 'JLPT N2 学習',
  description: 'JLPT N2 読解・文法・語彙 練習アプリ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto min-h-screen bg-white">
          <ClientOnly>{children}</ClientOnly>
        </div>
      </body>
    </html>
  )
}
