import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Konsum - Ofertat më të mira çdo javë',
  description: 'Konsum supermarket - Zbuloni ofertat javore, produktet me cilësi dhe çmimet më të mira në Maqedoni.',
  keywords: 'konsum, supermarket, ofertat javore, produkte ushqimore, Maqedoni',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
