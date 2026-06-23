'use client'

import { useI18n } from '@/lib/i18n-context'
import { LANGUAGES } from '@/lib/i18n'
import { Globe } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function LanguageSwitcher({ variant = 'default' }) {
  const { lang, setLang } = useI18n()
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-1.5 ${
        variant === 'topbar'
          ? 'text-white/90 hover:text-white text-xs'
          : 'px-2 py-1.5 rounded-md hover:bg-muted text-sm font-semibold'
      }`}>
        <Globe className="h-4 w-4"/>
        <span>{current.flag}</span>
        <span className="uppercase">{current.code}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(l => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}
            className={l.code === lang ? 'bg-orange-50 text-[#EF7B22] font-semibold' : ''}>
            <span className="mr-2">{l.flag}</span> {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
