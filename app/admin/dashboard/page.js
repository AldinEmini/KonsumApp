'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Tag, ImageIcon, FileText, MapPin, Phone, Settings,
  Bell, Search, LogOut, Plus, TrendingUp, Package, Users, Eye, Sparkles,
  Download, Edit2, Trash2, Check, Loader2, FileDown, Image as ImageIc
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/site/Logo'
import OfferDialog from '@/components/admin/OfferDialog'
import MarketingDialog from '@/components/admin/MarketingDialog'
import HeroEditor from '@/components/admin/HeroEditor'
import MessagesTab from '@/components/admin/MessagesTab'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

const NAV = [
  { key: 'overview', label: 'Pasqyra', icon: LayoutDashboard },
  { key: 'offers', label: 'Ofertat', icon: Tag },
  { key: 'hero', label: 'Hero Banner', icon: ImageIcon },
  { key: 'marketing', label: 'Marketing Gen.', icon: Sparkles },
  { key: 'messages', label: 'Mesazhet', icon: Phone },
  { key: 'locations', label: 'Lokacionet', icon: MapPin },
  { key: 'content', label: 'Përmbajtja', icon: FileText },
  { key: 'settings', label: 'Cilësimet', icon: Settings },
]

function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('overview')
  const [offers, setOffers] = useState([])
  const [stats, setStats] = useState(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [offerDialog, setOfferDialog] = useState({ open: false, offer: null })
  const [marketingDialog, setMarketingDialog] = useState({ open: false, type: 'story' })

  const refresh = async () => {
    setLoading(true)
    try {
      const [oRes, sRes] = await Promise.all([
        fetch('/api/offers?active=false').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ])
      setOffers(oRes.offers || [])
      setStats(sRes.stats || null)
      setUnreadMessages(sRes.stats?.unread_messages || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Të fshihet kjo ofertë?')) return
    const r = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
    if (r.ok) { toast.success('Oferta u fshi'); refresh() }
    else toast.error('Dështoi fshirja')
  }

  const handleToggleActive = async (offer) => {
    const r = await fetch(`/api/offers/${offer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !offer.active })
    })
    if (r.ok) { toast.success('U përditësua'); refresh() }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="hidden lg:flex w-64 bg-white border-r flex-col h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b">
          <Logo size="md"/>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                tab === n.key
                  ? 'bg-[#EF7B22] text-white shadow'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}>
              <span className="flex items-center gap-3"><n.icon className="h-4 w-4"/> {n.label}</span>
              {n.key === 'messages' && unreadMessages > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === n.key ? 'bg-white text-[#EF7B22]' : 'bg-[#EF7B22] text-white'}`}>{unreadMessages}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-100">
            <LogOut className="h-4 w-4"/> Dil nga llogaria
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Kërko..." className="pl-10 h-10 bg-neutral-50 border-0"/>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-[#EF7B22] flex items-center gap-1">
              <Eye className="h-4 w-4"/> Shiko faqen
            </Link>
            <button className="relative p-2 rounded-lg hover:bg-neutral-100">
              <Bell className="h-5 w-5"/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF7B22] rounded-full"/>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-9 h-9 rounded-full konsum-gradient text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-bold leading-tight">{user?.name || 'Admin'}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#EF7B22]"/>
            </div>
          )}
          {!loading && tab === 'overview' && (
            <OverviewTab stats={stats} offers={offers}
              onAddOffer={() => setOfferDialog({ open: true, offer: null })}
              onMarketing={(t) => setMarketingDialog({ open: true, type: t })}
              onGoTab={setTab}/>
          )}
          {!loading && tab === 'offers' && (
            <OffersTab offers={offers}
              onAdd={() => setOfferDialog({ open: true, offer: null })}
              onEdit={(o) => setOfferDialog({ open: true, offer: o })}
              onDelete={handleDelete}
              onToggle={handleToggleActive}/>
          )}
          {!loading && tab === 'marketing' && (
            <MarketingTab offers={offers}
              onOpen={(t) => setMarketingDialog({ open: true, type: t })}/>
          )}
          {!loading && tab === 'hero' && <HeroEditor/>}
          {!loading && tab === 'messages' && <MessagesTab onUnreadChange={setUnreadMessages}/>}
          {!loading && tab === 'locations' && <LocationsTab/>}
          {!loading && tab === 'content' && <ContentTab/>}
          {!loading && tab === 'settings' && <SettingsTab/>}
        </main>
      </div>

      <OfferDialog
        open={offerDialog.open}
        onOpenChange={(o) => setOfferDialog(s => ({ ...s, open: o }))}
        offer={offerDialog.offer}
        onSaved={() => refresh()}
      />
      <MarketingDialog
        open={marketingDialog.open}
        onOpenChange={(o) => setMarketingDialog(s => ({ ...s, open: o }))}
        type={marketingDialog.type}
        offers={offers}
      />
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

function OverviewTab({ stats, offers, onAddOffer, onMarketing, onGoTab }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Mirëse erdhët, Admin 👋</h1>
        <p className="text-muted-foreground mt-1">Ja çfarë po ndodh në Konsum sot.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Tag} label="Oferta aktive" value={stats?.active_offers ?? '-'} change="+12%" color="bg-[#EF7B22]"/>
        <StatCard icon={Package} label="Produkte gjithsej" value={stats?.total_products ?? '-'} change="+5%" color="bg-amber-500"/>
        <StatCard icon={MapPin} label="Lokacione" value={stats?.total_locations ?? '-'} color="bg-blue-500"/>
        <StatCard icon={Users} label="Vizita të javës" value={(stats?.weekly_visits ?? 0).toLocaleString()} change="+24%" color="bg-[#20A33A]"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border">
          <h3 className="font-black text-lg mb-4">Veprime të shpejta</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <button onClick={onAddOffer} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed hover:border-solid hover:border-[#EF7B22] hover:bg-orange-50 transition text-left">
              <div className="w-10 h-10 rounded-lg bg-[#EF7B22] text-white flex items-center justify-center"><Plus className="h-5 w-5"/></div>
              <span className="font-semibold text-sm">Shto Ofertë të Re</span>
            </button>
            <button onClick={() => onMarketing('story')} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed hover:border-solid hover:border-[#EF7B22] hover:bg-orange-50 transition text-left">
              <div className="w-10 h-10 rounded-lg bg-purple-500 text-white flex items-center justify-center"><ImageIc className="h-5 w-5"/></div>
              <span className="font-semibold text-sm">Gjenero Instagram Story</span>
            </button>
            <button onClick={() => onMarketing('post')} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed hover:border-solid hover:border-[#EF7B22] hover:bg-orange-50 transition text-left">
              <div className="w-10 h-10 rounded-lg bg-pink-500 text-white flex items-center justify-center"><Sparkles className="h-5 w-5"/></div>
              <span className="font-semibold text-sm">Gjenero Post Javor</span>
            </button>
            <button onClick={() => onMarketing('pdf')} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed hover:border-solid hover:border-[#EF7B22] hover:bg-orange-50 transition text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center"><FileDown className="h-5 w-5"/></div>
              <span className="font-semibold text-sm">Shkarko PDF Katalog</span>
            </button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <h3 className="font-black text-lg mb-4">Ofertat e fundit</h3>
          <div className="space-y-3">
            {offers.slice(0, 5).map(o => (
              <div key={o.id} className="flex gap-3 pb-3 border-b last:border-0">
                <img src={o.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{o.name}</p>
                  <p className="text-xs text-[#EF7B22] font-bold">{o.newPrice} MKD <span className="text-muted-foreground line-through font-normal">{o.oldPrice}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg">Të gjitha ofertat</h3>
          <Button variant="outline" size="sm" onClick={() => onGoTab('offers')}>Menaxho</Button>
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
              {offers.slice(0, 8).map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={o.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                    <span className="font-semibold">{o.name}</span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground capitalize">{o.category.replace(/-/g, ' & ')}</td>
                  <td className="py-3 px-2 font-bold text-[#EF7B22]">{o.newPrice} MKD</td>
                  <td className="py-3 px-2"><Badge className="bg-orange-100 text-[#EF7B22] hover:bg-orange-100">{o.badge}</Badge></td>
                  <td className="py-3 px-2">
                    {o.active
                      ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Check className="h-3 w-3 mr-1"/> Aktive</Badge>
                      : <Badge variant="secondary">Joaktive</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function OffersTab({ offers, onAdd, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const filtered = offers.filter(o => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'active' && o.active) || (filter === 'inactive' && !o.active)
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Menaxhimi i Ofertave</h1>
          <p className="text-muted-foreground mt-1">Shto, edito ose fshi oferta. Ngarko imazhe dhe vendos çmime.</p>
        </div>
        <Button onClick={onAdd} className="bg-[#EF7B22] hover:bg-[#C45F10]"><Plus className="h-4 w-4 mr-1.5"/> Shto Ofertë</Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Kërko ofertë..." value={search} onChange={e=>setSearch(e.target.value)} className="max-w-sm"/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="h-10 px-3 rounded-md border bg-white text-sm">
          <option value="all">Të gjitha</option>
          <option value="active">Aktive</option>
          <option value="inactive">Joaktive</option>
        </select>
        <span className="ml-auto text-sm text-muted-foreground self-center">U gjetën {filtered.length} oferta</span>
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
            {filtered.map(o => (
              <tr key={o.id} className="border-t hover:bg-neutral-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img src={o.image} alt="" className="w-11 h-11 rounded-lg object-cover"/>
                  <span className="font-semibold">{o.name}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{o.category}</td>
                <td className="py-3 px-4 text-muted-foreground line-through">{o.oldPrice} MKD</td>
                <td className="py-3 px-4 font-bold text-[#EF7B22]">{o.newPrice} MKD</td>
                <td className="py-3 px-4"><Badge className="bg-orange-100 text-[#EF7B22] hover:bg-orange-100">{o.badge}</Badge></td>
                <td className="py-3 px-4">
                  <button onClick={()=>onToggle(o)} className={`inline-flex items-center gap-1 text-xs font-semibold ${o.active ? 'text-green-700' : 'text-neutral-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${o.active ? 'bg-green-500' : 'bg-neutral-400'}`}/> {o.active ? 'Aktive' : 'Joaktive'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button onClick={()=>onEdit(o)} className="p-1.5 rounded hover:bg-neutral-200"><Edit2 className="h-4 w-4 text-blue-600"/></button>
                    <button onClick={()=>onDelete(o.id)} className="p-1.5 rounded hover:bg-neutral-200"><Trash2 className="h-4 w-4 text-red-600"/></button>
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

function MarketingTab({ offers, onOpen }) {
  const active = offers.filter(o => o.active).length
  const items = [
    { type: 'story', icon: '📱', t: 'Instagram Story', size: '1080×1920', desc: 'Një produkt për stori, gati për publikim' },
    { type: 'post', icon: '📊', t: 'Post Javor', size: '1080×1350', desc: 'Përmbledhje e të gjitha ofertave aktive' },
    { type: 'pdf', icon: '📄', t: 'PDF Katalog', size: 'A4', desc: 'Katalog i printueshëm me të gjitha ofertat' },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Marketing Generator</h1>
        <p className="text-muted-foreground mt-1">Gjenero automatikisht materiale promovuese nga {active} ofertat aktive.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((m) => (
          <div key={m.type} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition">
            <div className="text-5xl mb-3">{m.icon}</div>
            <h3 className="font-black text-lg">{m.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
            <p className="text-xs text-muted-foreground mt-2">Madhësia: <b>{m.size}</b></p>
            <Button onClick={() => onOpen(m.type)} className="w-full mt-4 bg-[#EF7B22] hover:bg-[#C45F10]">
              <Sparkles className="h-4 w-4 mr-1.5"/> Gjenero
            </Button>
          </div>
        ))}
      </div>
      <div className="bg-green-50 border border-green-200 p-5 rounded-2xl">
        <p className="text-sm text-green-900"><b>💡 Tip:</b> Shkarkoni materialet dhe ngarkojini direkt në Instagram/Facebook. PDF-ja mund të printohet ose të dërgohet me email klientëve.</p>
      </div>
    </div>
  )
}

function LocationsTab() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const refresh = async () => {
    setLoading(true)
    const r = await fetch('/api/locations').then(r => r.json())
    setLocations(r.locations || [])
    setLoading(false)
  }
  useEffect(() => { refresh() }, [])

  const save = async () => {
    if (!editing.name || !editing.address) { toast.error('Plotësoni emrin dhe adresën'); return }
    const isEdit = !!editing.id
    const url = isEdit ? `/api/locations/${editing.id}` : '/api/locations'
    const method = isEdit ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    if (r.ok) { toast.success('U ruajt'); setEditing(null); refresh() }
    else toast.error('Dështoi')
  }

  const del = async (id) => {
    if (!confirm('Të fshihet ky lokacion?')) return
    const r = await fetch(`/api/locations/${id}`, { method: 'DELETE' })
    if (r.ok) { toast.success('U fshi'); refresh() }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Lokacionet</h1>
          <p className="text-muted-foreground mt-1">Menaxho dyqanet e Konsumit.</p>
        </div>
        <Button onClick={() => setEditing({ name: '', address: '', phone: '', hours: '' })} className="bg-[#EF7B22] hover:bg-[#C45F10]">
          <Plus className="h-4 w-4 mr-1.5"/> Shto Lokacion
        </Button>
      </div>

      {loading ? <Loader2 className="h-6 w-6 animate-spin"/> : (
        <div className="grid md:grid-cols-2 gap-4">
          {locations.map(l => (
            <div key={l.id} className="bg-white p-5 rounded-2xl border">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-black text-lg">{l.name}</h3>
                <div className="flex gap-1">
                  <button onClick={()=>setEditing(l)} className="p-1.5 rounded hover:bg-neutral-100"><Edit2 className="h-4 w-4 text-blue-600"/></button>
                  <button onClick={()=>del(l.id)} className="p-1.5 rounded hover:bg-neutral-100"><Trash2 className="h-4 w-4 text-red-600"/></button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-start gap-1.5"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0"/>{l.address}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Phone className="h-4 w-4"/>{l.phone}</p>
              <p className="text-xs text-muted-foreground mt-2">{l.hours}</p>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-black text-xl">{editing.id ? 'Edito lokacionin' : 'Shto lokacion'}</h3>
            <Input placeholder="Emri (p.sh. Konsum Qendër)" value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})}/>
            <Input placeholder="Adresa" value={editing.address} onChange={e=>setEditing({...editing, address: e.target.value})}/>
            <Input placeholder="Telefoni" value={editing.phone} onChange={e=>setEditing({...editing, phone: e.target.value})}/>
            <Input placeholder="Orari (p.sh. E Hënë - E Diel: 07:00 - 22:00)" value={editing.hours} onChange={e=>setEditing({...editing, hours: e.target.value})}/>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={()=>setEditing(null)}>Anulo</Button>
              <Button onClick={save} className="bg-[#EF7B22] hover:bg-[#C45F10]">Ruaj</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ContentTab() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/content').then(r=>r.json()).then(d => { setContent(d.content); setLoading(false) })
  }, [])

  const updateField = (path, value) => {
    setContent(c => {
      const next = JSON.parse(JSON.stringify(c))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    const r = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) })
    if (r.ok) toast.success('Përmbajtja u ruajt me sukses')
    else toast.error('Dështoi')
    setSaving(false)
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin"/>
  if (!content) return <p>Nuk u ngarkua përmbajtja.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Përmbajtja e Faqes</h1>
          <p className="text-muted-foreground mt-1">Edito informacionet që shfaqen në faqe publike.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-[#EF7B22] hover:bg-[#C45F10]">
          {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">Informacionet e kompanisë</h3>
          <div>
            <label className="text-sm font-semibold">Telefon</label>
            <Input value={content.site?.phone || ''} onChange={e=>updateField('site.phone', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Email</label>
            <Input value={content.site?.email || ''} onChange={e=>updateField('site.email', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Adresa</label>
            <Input value={content.site?.address || ''} onChange={e=>updateField('site.address', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Orari i përgjithshëm</label>
            <Input value={content.site?.hours || ''} onChange={e=>updateField('site.hours', e.target.value)}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">Rrjete sociale</h3>
          <div>
            <label className="text-sm font-semibold">Facebook</label>
            <Input value={content.site?.social?.facebook || ''} onChange={e=>updateField('site.social.facebook', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Instagram</label>
            <Input value={content.site?.social?.instagram || ''} onChange={e=>updateField('site.social.instagram', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">YouTube</label>
            <Input value={content.site?.social?.youtube || ''} onChange={e=>updateField('site.social.youtube', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">TikTok</label>
            <Input value={content.site?.social?.tiktok || ''} onChange={e=>updateField('site.social.tiktok', e.target.value)}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🕒 Orari i Punës</h3>
          <p className="text-xs text-muted-foreground">Këto shfaqen në faqen Kontakti.</p>
          <div>
            <label className="text-sm font-semibold">E Hënë - E Shtunë</label>
            <Input value={content.site?.hours_detailed?.weekdays || ''}
              onChange={e=>updateField('site.hours_detailed.weekdays', e.target.value)}
              placeholder="07:00 - 22:00"/>
          </div>
          <div>
            <label className="text-sm font-semibold">E Diel</label>
            <Input value={content.site?.hours_detailed?.sunday || ''}
              onChange={e=>updateField('site.hours_detailed.sunday', e.target.value)}
              placeholder="08:00 - 14:00"/>
          </div>
          <div>
            <label className="text-sm font-semibold">Festat shtetërore</label>
            <Input value={content.site?.hours_detailed?.holidays || ''}
              onChange={e=>updateField('site.hours_detailed.holidays', e.target.value)}
              placeholder="08:00 - 14:00"/>
          </div>
          <div>
            <label className="text-sm font-semibold">Orari i shkurtër (header/footer)</label>
            <Input value={content.site?.hours || ''} onChange={e=>updateField('site.hours', e.target.value)}
              placeholder="Mon-Sat: 07:00-22:00 | Sun: 08:00-14:00"/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🦶 Header & Footer</h3>
          <div>
            <label className="text-sm font-semibold">Footer Copyright</label>
            <Input value={content.footer_copyright || ''} onChange={e=>updateField('footer_copyright', e.target.value)}
              placeholder="© 2026 Konsum Super Market..."/>
          </div>
          <p className="text-xs text-muted-foreground">Header dhe footer marrin telefon, email, adresë, social dhe orar nga seksionet sipër.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3 md:col-span-2">
          <h3 className="font-black text-lg">ℹ️ Rreth Nesh (opsional, vetëm për SEO)</h3>
          <p className="text-xs text-muted-foreground mb-2">Këto fusha nuk shfaqen më në faqe publike, por mund t'i përdorni në të ardhmen nëse riktheni faqen.</p>
          <div>
            <label className="text-sm font-semibold">Titulli</label>
            <Input value={content.about?.hero_title || ''} onChange={e=>updateField('about.hero_title', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Nëntitulli</label>
            <Input value={content.about?.hero_subtitle || ''} onChange={e=>updateField('about.hero_subtitle', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Historia</label>
            <textarea rows={4} className="w-full px-3 py-2 rounded-md border" value={content.about?.history || ''} onChange={e=>updateField('about.history', e.target.value)}/>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Misioni</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-md border" value={content.about?.mission || ''} onChange={e=>updateField('about.mission', e.target.value)}/>
            </div>
            <div>
              <label className="text-sm font-semibold">Vizioni</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-md border" value={content.about?.vision || ''} onChange={e=>updateField('about.vision', e.target.value)}/>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Dërgesa</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-md border" value={content.about?.delivery || ''} onChange={e=>updateField('about.delivery', e.target.value)}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => { setContent(d.content); setLoading(false) })
  }, [])

  const updateField = (path, value) => {
    setContent(c => {
      const next = JSON.parse(JSON.stringify(c))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    const r = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) })
    if (r.ok) toast.success('Cilësimet u ruajtën')
    else toast.error('Dështoi')
    setSaving(false)
  }

  const translateAll = async () => {
    if (!confirm('Kjo do të rikthejë përkthimet për të gjitha ofertat, hero slides dhe Rreth Nesh. Mund të zgjasë 1-2 minuta. Vazhdojmë?')) return
    setTranslating(true)
    try {
      const r = await fetch('/api/translate-all', { method: 'POST' })
      const d = await r.json()
      if (r.ok) toast.success(`U përkthyen ${d.translatedOffers} oferta dhe ${d.translatedSlides} slides`)
      else toast.error('Dështoi')
    } catch { toast.error('Dështoi') }
    finally { setTranslating(false) }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin"/>
  if (!content) return <p>Nuk u ngarkua.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Cilësimet e Faqes</h1>
          <p className="text-muted-foreground mt-1">SEO, logo, gjuhë dhe konfigurime të përgjithshme.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-[#EF7B22] hover:bg-[#C45F10]">
          {saving ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🌐 SEO & Meta Tags</h3>
          <div>
            <label className="text-sm font-semibold">Titulli i faqes (Title)</label>
            <Input value={content.seo?.title || 'Konsum Super Market - Best weekly offers'} onChange={e=>updateField('seo.title', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Përshkrimi (Meta Description)</label>
            <textarea rows={3} className="w-full px-3 py-2 rounded-md border text-sm"
              value={content.seo?.description || ''} onChange={e=>updateField('seo.description', e.target.value)}/>
          </div>
          <div>
            <label className="text-sm font-semibold">Keywords (ndara me presje)</label>
            <Input value={content.seo?.keywords || ''} onChange={e=>updateField('seo.keywords', e.target.value)}
              placeholder="konsum, supermarket, oferta, Maqedoni"/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🎨 Branding & Logo</h3>
          <div>
            <label className="text-sm font-semibold">URL e logos (mascot/header)</label>
            <Input value={content.branding?.logo_mascot || ''} onChange={e=>updateField('branding.logo_mascot', e.target.value)}
              placeholder="https://..."/>
            {content.branding?.logo_mascot && (
              <img src={content.branding.logo_mascot} alt="" className="mt-2 h-16 object-contain border p-2 rounded"/>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold">URL e logos së plotë (footer, marketing)</label>
            <Input value={content.branding?.logo_full || ''} onChange={e=>updateField('branding.logo_full', e.target.value)}
              placeholder="https://..."/>
          </div>
          <div>
            <label className="text-sm font-semibold">Slogani (Tagline)</label>
            <Input value={content.site?.tagline || ''} onChange={e=>updateField('site.tagline', e.target.value)}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🦶 Footer</h3>
          <div>
            <label className="text-sm font-semibold">Teksti i copyright</label>
            <Input value={content.footer_copyright || ''} onChange={e=>updateField('footer_copyright', e.target.value)}/>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3">
          <h3 className="font-black text-lg">🌍 Multi-Language</h3>
          <p className="text-sm text-muted-foreground">Sapo shtoni ose editoni një ofertë / slide / përmbajtje, ajo përkthehet automatikisht në 3 gjuhë (EN, SQ, MK) duke përdorur AI.</p>
          <Button onClick={translateAll} disabled={translating} variant="outline" className="border-[#EF7B22] text-[#EF7B22] hover:bg-orange-50">
            {translating ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Sparkles className="h-4 w-4 mr-2"/>}
            {translating ? 'Duke përkthyer...' : 'Rikthe përkthimet për të gjitha'}
          </Button>
          <p className="text-xs text-muted-foreground">Përdore këtë nëse ke ndryshuar tekstin direkt në databazë ose dëshiron të rifreskosh të gjitha përkthimet.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-3 md:col-span-2">
          <h3 className="font-black text-lg">🔐 Llogaria Admin</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Email i juaj</label>
              <Input value="aldin@konsum.mk" disabled className="bg-neutral-50"/>
            </div>
            <div>
              <label className="text-sm font-semibold">Roli</label>
              <Input value="Administrator" disabled className="bg-neutral-50"/>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Për ndryshimin e fjalëkalimit, kontakto zhvilluesin.</p>
        </div>
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
        <h3 className="font-bold text-lg">Së shpejti</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">Ky seksion do të aktivizohet në versionin e ardhshëm.</p>
      </div>
    </div>
  )
}

export default AdminDashboard
