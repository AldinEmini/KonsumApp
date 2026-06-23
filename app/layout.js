import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { I18nProvider } from '@/lib/i18n-context'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Konsum Super Market - Best weekly offers',
  description: 'Konsum supermarket - Discover weekly offers, quality products and the best prices in Macedonia.',
  keywords: 'konsum, supermarket, weekly offers, grocery, Macedonia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          {children}
        </I18nProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
