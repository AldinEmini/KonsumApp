'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, MapPin, Phone, Menu, X, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { SITE } from '@/lib/mockData'
import { useI18n } from '@/lib/i18n-context'

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  const NAV = [
    { href: '/', label: t('nav_home') },
    { href: '/oferta', label: t('nav_offers') },
    { href: '/rreth-nesh', label: t('nav_about') },
    { href: '/kontakti', label: t('nav_contact') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="bg-[#EF7B22] text-white text-xs">
        <div className="container flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3"/> {SITE.phone}</span>
            <span className="hidden sm:flex items-center gap-1.5"><MapPin className="h-3 w-3"/> 12 {t('locations_count')}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">{SITE.hours}</span>
            <LanguageSwitcher variant="topbar"/>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between h-20 gap-6">
        <Link href="/" className="flex-shrink-0">
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('search_placeholder')} className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-[#EF7B22]" />
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex bg-[#20A33A] hover:bg-[#178A30] text-white font-bold">
            <Link href="/oferta"><ShoppingBag className="h-4 w-4 mr-2"/> {t('offers_button')}</Link>
          </Button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </div>
      </div>

      <nav className="hidden md:block border-t bg-white">
        <div className="container flex items-center gap-1 h-12">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
                pathname === n.href
                  ? 'text-[#EF7B22] bg-orange-50'
                  : 'text-foreground hover:text-[#EF7B22] hover:bg-muted'
              }`}>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-3 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('search_placeholder')} className="pl-10" />
            </div>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-semibold ${
                  pathname === n.href ? 'text-[#EF7B22] bg-orange-50' : 'text-foreground hover:bg-muted'
                }`}>
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
