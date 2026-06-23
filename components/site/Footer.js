import Link from 'next/link'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react'
import Logo from './Logo'
import { SITE } from '@/lib/mockData'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="bg-white inline-block p-2 rounded-lg"><Logo size="md" /></div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Tregtari juaj i besueshëm që nga 1991. Produkte cilësore, çmime të arsyeshme.
          </p>
          <div className="flex gap-2">
            <a href={SITE.social.facebook} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Facebook className="h-4 w-4"/></a>
            <a href={SITE.social.instagram} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Instagram className="h-4 w-4"/></a>
            <a href={SITE.social.youtube} className="p-2 rounded-full bg-neutral-800 hover:bg-[#EF7B22] transition"><Youtube className="h-4 w-4"/></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Lidhje të Shpejta</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/oferta" className="hover:text-white">Ofertat Javore</Link></li>
            <li><Link href="/rreth-nesh" className="hover:text-white">Rreth Nesh</Link></li>
            <li><Link href="/kontakti" className="hover:text-white">Lokacionet</Link></li>
            <li><Link href="/kontakti" className="hover:text-white">Kontakti</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Informacione</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/rreth-nesh#politika" className="hover:text-white">Politika e Kthimit</Link></li>
            <li><Link href="/rreth-nesh#privatesia" className="hover:text-white">Privatësia</Link></li>
            <li><Link href="/rreth-nesh#derguar" className="hover:text-white">Dërgesa</Link></li>
            <li><Link href="/rreth-nesh#kushtet" className="hover:text-white">Kushtet e përdorimit</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Kontakt</h4>
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
          <p>© {new Date().getFullYear()} Konsum Super Market. Të gjitha të drejtat e rezervuara.</p>
          <p className="mt-2 md:mt-0">Dizajnuar me ❤️ në Maqedoni</p>
        </div>
      </div>
    </footer>
  )
}
