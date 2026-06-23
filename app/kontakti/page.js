'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, Loader2 } from 'lucide-react'
import { SITE } from '@/lib/mockData'
import { toast } from 'sonner'

function KontaktiPage() {
  const [locations, setLocations] = useState([])
  const [site, setSite] = useState(SITE)
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/locations').then(r => r.json()),
      fetch('/api/content').then(r => r.json()),
    ]).then(([l, c]) => {
      const locs = l.locations || []
      setLocations(locs)
      setActive(locs[0])
      if (c.content?.site) setSite(c.content.site)
      setLoading(false)
    })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    toast.success('Mesazhi u dërgua me sukses! Do t’ju kontaktojmë sëshpejti.')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <section className="konsum-gradient text-white py-12 md:py-16">
        <div className="container">
          <Badge className="bg-[#20A33A] text-white font-bold mb-3 hover:bg-[#20A33A]">NË SHËRBIMIN TUAJ</Badge>
          <h1 className="text-4xl md:text-6xl font-black">Kontakti & Lokacionet</h1>
          <p className="text-white/90 mt-3 text-lg max-w-2xl">Na vizitoni në njërin nga {locations.length || 12} dyqanet tona ose na kontaktoni çdo ditë.</p>
        </div>
      </section>

      <section className="py-12 -mt-6">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Phone, t: 'Telefon', v: site.phone, link: `tel:${site.phone}` },
            { i: Mail, t: 'Email', v: site.email, link: `mailto:${site.email}` },
            { i: MapPin, t: 'Adresa', v: site.address },
            { i: Clock, t: 'Orari', v: site.hours },
          ].map((c, i) => (
            <div key={i} className="bg-white border shadow-sm rounded-2xl p-5 hover:shadow-lg transition">
              <div className="w-11 h-11 rounded-xl konsum-gradient text-white flex items-center justify-center mb-3">
                <c.i className="h-5 w-5"/>
              </div>
              <div className="text-xs text-muted-foreground uppercase font-semibold">{c.t}</div>
              {c.link ? <a href={c.link} className="font-bold hover:text-[#EF7B22]">{c.v}</a> : <div className="font-bold text-sm">{c.v}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50 mb-2">{locations.length} lokacione</Badge>
              <h2 className="text-3xl md:text-4xl font-black">Dyqanet tona</h2>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#EF7B22]"/></div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-3 max-h-[520px] overflow-y-auto pr-2">
                {locations.map(loc => (
                  <button key={loc.id} onClick={() => setActive(loc)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition ${
                      active?.id === loc.id ? 'border-[#EF7B22] bg-orange-50' : 'border-neutral-200 bg-white hover:border-[#EF7B22]/40'
                    }`}>
                    <h3 className="font-black text-lg">{loc.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-start gap-1.5 mt-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0"/>{loc.address}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Phone className="h-4 w-4"/>{loc.phone}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1"><Clock className="h-3.5 w-3.5"/>{loc.hours}</p>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-3 bg-neutral-100 rounded-2xl overflow-hidden h-[520px] relative">
                {active && (
                  <iframe
                    title={active.name}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(active.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="container grid lg:grid-cols-2 gap-10">
          <div>
            <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50 mb-2">Na shkruani</Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Keni pyetje? Na kontaktoni</h2>
            <p className="text-muted-foreground mb-6">Ekipi ynë i shërbimit ndaj klientit do t’iu përgjigjet brenda 24 orësh.</p>
            <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl border">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Emri i plotë</label>
                  <Input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Filan Fisteku"/>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Telefoni</label>
                  <Input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="+389 70 000 000"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Email</label>
                <Input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="juaj@email.com"/>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Mesazhi</label>
                <Textarea required rows={5} value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Shkruani mesazhin tuaj..."/>
              </div>
              <Button type="submit" size="lg" className="w-full bg-[#EF7B22] hover:bg-[#C45F10] text-white font-bold">
                <Send className="h-4 w-4 mr-2"/> Dërgo mesazhin
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border">
              <h3 className="font-black text-xl mb-4">Na ndiqni në rrjete sociale</h3>
              <div className="grid grid-cols-3 gap-3">
                <a href={site.social?.facebook} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-[#EF7B22] hover:bg-orange-50 transition">
                  <Facebook className="h-6 w-6 text-[#EF7B22]"/><span className="text-xs font-semibold">Facebook</span>
                </a>
                <a href={site.social?.instagram} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-[#EF7B22] hover:bg-orange-50 transition">
                  <Instagram className="h-6 w-6 text-[#EF7B22]"/><span className="text-xs font-semibold">Instagram</span>
                </a>
                <a href={site.social?.youtube} className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-[#EF7B22] hover:bg-orange-50 transition">
                  <Youtube className="h-6 w-6 text-[#EF7B22]"/><span className="text-xs font-semibold">YouTube</span>
                </a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border">
              <h3 className="font-black text-xl mb-3">FAQ - Pyetjet më të shpeshta</h3>
              <details className="py-3 border-b">
                <summary className="cursor-pointer font-semibold">A bëni dërgesa në shtëpi?</summary>
                <p className="text-sm text-muted-foreground mt-2">Po, ne bëjmë dërgesa në shtëpi për porositë mbi 1000 MKD brenda Shkupit.</p>
              </details>
              <details className="py-3 border-b">
                <summary className="cursor-pointer font-semibold">Si t’i përdor ofertat?</summary>
                <p className="text-sm text-muted-foreground mt-2">Mjafton t’i shihni ofertat dhe t’i merrni produktet në dyqan, çmimet aplikohen automatikisht në arka.</p>
              </details>
              <details className="py-3">
                <summary className="cursor-pointer font-semibold">A kam mundësi për kthim?</summary>
                <p className="text-sm text-muted-foreground mt-2">Po, brenda 14 ditësh me faturën origjinale.</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default KontaktiPage
