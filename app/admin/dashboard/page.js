'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Tag, ImageIcon, FileText, MapPin, Phone, Settings,
  Bell, Search, LogOut, Plus, TrendingUp, Package, Users, Eye, Sparkles,
  Download, Edit2, Trash2, MoreVertical, Check, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/site/Logo'
import { DASHBOARD_STATS, RECENT_ACTIVITY, OFFERS } from '@/lib/mockData'

const NAV = [
  { key: 'overview', label: 'Pasqyra', icon: LayoutDashboard },
  { key: 'offers', label: 'Ofertat', icon: Tag, badge: DASHBOARD_STATS.active_offers },
  { key: 'homepage', label: 'Faqja Kryesore', icon: ImageIcon },
  { key: 'about', label: 'Rreth Nesh', icon: FileText },
  { key: 'locations', label: 'Lokacionet', icon: MapPin, badge: 12 },
  { key: 'contact', label: 'Kontakti', icon: Phone },
  { key: 'marketing', label: 'Marketing Gen.', icon: Sparkles },
  { key: 'settings', label: 'Cilesimet', icon: Settings },
]

function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState('overview')

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r flex-col h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b">
          <Logo size="md"/>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                tab === n.key
                  ? 'bg-[#E30613] text-white shadow'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}>
              <span className="flex items-center gap-3"><n.icon className="h-4 w-4"/> {n.label}</span>
              {n.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${tab === n.key ? 'bg-white text-[#E30613]' : 'bg-neutral-200 text-neutral-700'}`}>{n.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={()=>router.push('/admin/login')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
            <LogOut className="h-4 w-4"/> Dil nga llogaria
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Kërko..." className="pl-10 h-10 bg-neutral-50 border-0"/>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-[#E30613] flex items-center gap-1">
              <Eye className="h-4 w-4"/> Shiko faqen
            </Link>
            <button className="relative p-2 rounded-lg hover:bg-neutral-100">
              <Bell className="h-5 w-5"/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E30613] rounded-full"/>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-9 h-9 rounded-full konsum-gradient text-white flex items-center justify-center font-bold text-sm">AK</div>
              <div className="hidden md:block">
                <div className="text-sm font-bold leading-tight">Admin Konsum</div>
                <div className="text-xs text-muted-foreground">admin@konsum.mk</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {tab === 'overview' && <OverviewTab/>}
          {tab === 'offers' && <OffersTab/>}
          {tab === 'homepage' && <PlaceholderTab title="Menaxhimi i Faqes Kryesore" desc="Edito banner-at, slider-in promocional dhe seksionet e faqes kryesore."/>}
          {tab === 'about' && <PlaceholderTab title="Përmbajtja Rreth Nesh" desc="Edito historinë, misionin, vlerat, orarin dhe politikat."/>}
          {tab === 'locations' && <PlaceholderTab title="Menaxhimi i Lokacioneve" desc="Shto, edito ose fshi dyqane. Vendos orarin për secilin lokacion."/>}
          {tab === 'contact' && <PlaceholderTab title="Informacionet e Kontaktit" desc="Edito numrat, email, rrjete sociale dhe lokacionin në Google Maps."/>}
          {tab === 'marketing' && <MarketingTab/>}
          {tab === 'settings' && <PlaceholderTab title="Cilësimet e Faqes" desc="Logo, ngjyrat, SEO, footer dhe cilësime të përgjithshme."/>}
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5 text-white"/>
        </div>
        {change && (
          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3"/> {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Mirëse erdhët, Admin 👋</h1>
        <p className="text-muted-foreground mt-1">Ja çfarë po ndodh në Konsum sot.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Tag} label="Oferta aktive" value={DASHBOARD_STATS.active_offers} change="+12%" color="bg-[#E30613]"/>
        <StatCard icon={Package} label="Produkte gjithsej" value={DASHBOARD_STATS.total_products} change="+5%" color="bg-amber-500"/>
        <StatCard icon={MapPin} label="Lokacione" value={DASHBOARD_STATS.total_locations} color="bg-blue-500"/>
        <StatCard icon={Users} label="Vizita të javës" value={DASHBOARD_STATS.weekly_visits.toLocaleString()} change="+24%" color="bg-green-500"/>
      </div>

      {/* Quick actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border">
          <h3 className="font-black text-lg mb-4">Veprime të shpejta</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { i: Plus, t: 'Shto Ofertë të Re', c: 'bg-[#E30613]' },
              { i: ImageIcon, t: 'Ngarko Banner', c: 'bg-amber-500' },
              { i: Sparkles, t: 'Gjenero Stori', c: 'bg-purple-500' },
              { i: Download, t: 'Shkarko PDF Katalog', c: 'bg-blue-500' },
            ].map((a, i) => (
              <button key={i} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed hover:border-solid hover:border-[#E30613] hover:bg-red-50 transition text-left">
                <div className={`w-10 h-10 rounded-lg ${a.c} text-white flex items-center justify-center`}><a.i className="h-5 w-5"/></div>
                <span className="font-semibold text-sm">{a.t}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-black text-lg mb-4">Aktiviteti i fundit</h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} className="flex gap-3 pb-3 border-b last:border-0">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30613] flex items-center justify-center text-xs font-bold flex-shrink-0">A</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">{a.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.item}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top offers preview */}
      <div className="bg-white p-6 rounded-2xl border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg">Ofertat më të shikuara</h3>
          <Button variant="outline" size="sm">Shiko të gjitha</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                <th className="py-3 px-2">Produkti</th>
                <th className="py-3 px-2">Kategoria</th>
                <th className="py-3 px-2">Çmimi i ri</th>
                <th className="py-3 px-2">Zbritja</th>
                <th className="py-3 px-2">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {OFFERS.slice(0,5).map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={o.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                    <span className="font-semibold">{o.name}</span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground capitalize">{o.category.replace('-', ' & ')}</td>
                  <td className="py-3 px-2 font-bold text-[#E30613]">{o.newPrice} MKD</td>
                  <td className="py-3 px-2"><Badge className="bg-red-100 text-[#E30613] hover:bg-red-100">{o.badge}</Badge></td>
                  <td className="py-3 px-2"><Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Check className="h-3 w-3 mr-1"/> Aktive</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function OffersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Menaxhimi i Ofertave</h1>
          <p className="text-muted-foreground mt-1">Shto, edito ose fshi oferta. Ngarko imazhe dhe vendos çmime.</p>
        </div>
        <Button className="bg-[#E30613] hover:bg-[#b8040f]"><Plus className="h-4 w-4 mr-1.5"/> Shto Ofertë</Button>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Kërko ofertë..." className="max-w-sm"/>
        <select className="h-10 px-3 rounded-md border bg-white text-sm">
          <option>Të gjitha kategoritë</option>
        </select>
        <select className="h-10 px-3 rounded-md border bg-white text-sm">
          <option>Të gjitha statuset</option>
          <option>Aktive</option>
          <option>Joaktive</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="py-3 px-4">Produkti</th>
              <th className="py-3 px-4">Kategoria</th>
              <th className="py-3 px-4">Çmimi i v.</th>
              <th className="py-3 px-4">Çmimi i ri</th>
              <th className="py-3 px-4">Zbritja</th>
              <th className="py-3 px-4">Statusi</th>
              <th className="py-3 px-4">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {OFFERS.map(o => (
              <tr key={o.id} className="border-t hover:bg-neutral-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img src={o.image} alt="" className="w-11 h-11 rounded-lg object-cover"/>
                  <span className="font-semibold">{o.name}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{o.category}</td>
                <td className="py-3 px-4 text-muted-foreground line-through">{o.oldPrice} MKD</td>
                <td className="py-3 px-4 font-bold text-[#E30613]">{o.newPrice} MKD</td>
                <td className="py-3 px-4"><Badge className="bg-red-100 text-[#E30613] hover:bg-red-100">{o.badge}</Badge></td>
                <td className="py-3 px-4">
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500"/> Aktive
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-neutral-200"><Edit2 className="h-4 w-4 text-blue-600"/></button>
                    <button className="p-1.5 rounded hover:bg-neutral-200"><Trash2 className="h-4 w-4 text-red-600"/></button>
                    <button className="p-1.5 rounded hover:bg-neutral-200"><MoreVertical className="h-4 w-4"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MarketingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Marketing Generator</h1>
        <p className="text-muted-foreground mt-1">Gjenero automatikisht materiale promovuese për rrjete sociale dhe katalog.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { t: 'Instagram Story', size: '1080×1920', desc: 'Një produkt për stori, gati për publikim', icon: '📱' },
          { t: 'Post Javor', size: '1080×1350', desc: 'Përmbledhje e të gjitha ofertave aktive', icon: '📊' },
          { t: 'PDF Katalog', size: 'A4', desc: 'Katalog i printueshem me të gjitha ofertat', icon: '📄' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition">
            <div className="text-5xl mb-3">{m.icon}</div>
            <h3 className="font-black text-lg">{m.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
            <p className="text-xs text-muted-foreground mt-2">Madhësia: <b>{m.size}</b></p>
            <Button className="w-full mt-4 bg-[#E30613] hover:bg-[#b8040f]"><Sparkles className="h-4 w-4 mr-1.5"/> Gjenero</Button>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
        <p className="text-sm text-amber-900"><b>Mockup:</b> Gjeneruesi i marketingut do të funksionojë plotësisht pas miratimit të mockup-eve dhe lidhjes me databazën.</p>
      </div>
    </div>
  )
}

function PlaceholderTab({ title, desc }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-black">{title}</h1>
        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className="bg-white border-2 border-dashed rounded-2xl p-16 text-center">
        <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-3"/>
        <h3 className="font-bold text-lg">Në fëmijëri</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">Këto seksione do të implementohen plotësisht në fazen e dytë pas miratimit të mockup-eve dhe lidhjes me Supabase.</p>
      </div>
    </div>
  )
}

export default AdminDashboard
