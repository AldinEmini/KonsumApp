'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'
import Logo from './Logo'
import { SITE as DEFAULT_SITE } from '@/lib/mockData'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n-context'

export default function Footer() {
  const { t } = useI18n()
  const [SITE, setSITE] = useState(DEFAULT_SITE)
  const [copyright, setCopyright] = useState('')
  useEffect(() => { fetch('/api/content').then(r=>r.json()).then(d => { if (d.content?.site) setSITE(s => ({...s, ...d.content.site})); if (d.content?.footer_copyright) setCopyright(d.content.footer_copyright) }).catch(()=>{}) }, [])
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="bg-white inline-block p-2 rounded-lg"><Logo size="md" /></div>
          <p className="text-sm text-neutral-400 leading-relaxed">{t('footer_tagline')}</p>
          <div className="flex gap-2">
            <a href={SITE.social.facebook} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Facebook className="h-4 w-4"/></a>
            <a href={SITE.social.instagram} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Instagram className="h-4 w-4"/></a>
            <a href={SITE.social.youtube} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Youtube className="h-4 w-4"/></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">{t('quick_links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/oferta" className="hover:text-white">{t('nav_offers')}</Link></li>
            <li><Link href="/kontakti" className="hover:text-white">{t('locations_label')}</Link></li>
            <li><Link href="/kontakti" className="hover:text-white">{t('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">{t('information')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/kontakti" className="hover:text-white">{t('phone_label')}</Link></li>
            <li><Link href="/kontakti" className="hover:text-white">{t('our_stores')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">{t('contact')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[#20A33A]"/> {SITE.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#20A33A]"/> {SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#20A33A]"/> {SITE.email}</li>
            <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-[#20A33A]"/> {SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>{copyright || `© ${new Date().getFullYear()} Konsum Super Market. ${t('all_rights')}`}</p>
          <p className="mt-2 md:mt-0">{t('designed_with')} ❤️ {t('in_macedonia')}</p>
        </div>
      </div>
    </footer>
  )
}
