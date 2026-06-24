'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, X, Loader2 } from 'lucide-react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import OfferCard from '@/components/site/OfferCard'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/mockData'
import { useI18n } from '@/lib/i18n-context'

function OfertaPage() {
  const { t, lang } = useI18n()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('te-gjitha')
  const [sort, setSort] = useState('discount')
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/offers').then(r => r.json()).then(d => {
      setOffers(d.offers || [])
      setLoading(false)
    })
  }, [])

  let list = offers.filter(o => (cat === 'te-gjitha' || o.category === cat) && (!search || o.name.toLowerCase().includes(search.toLowerCase())))
  if (sort === 'discount') list = [...list].sort((a,b) => (b.oldPrice-b.newPrice)/b.oldPrice - (a.oldPrice-a.newPrice)/a.oldPrice)
  if (sort === 'price-low') list = [...list].sort((a,b) => a.newPrice - b.newPrice)
  if (sort === 'price-high') list = [...list].sort((a,b) => b.newPrice - a.newPrice)
  if (sort === 'name') list = [...list].sort((a,b) => a.name.localeCompare(b.name))

  const maxDiscount = offers.length ? Math.max(...offers.map(o => Math.round(((o.oldPrice - o.newPrice)/o.oldPrice)*100))) : 0

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header/>

      <section className="konsum-gradient text-white py-12 md:py-16">
        <div className="container">
          <Badge className="bg-[#20A33A] text-white font-bold mb-3 hover:bg-[#20A33A]">{t('current_week')}</Badge>
          <h1 className="text-4xl md:text-6xl font-black">{t('nav_offers')}</h1>
          <p className="text-white/90 mt-3 text-lg max-w-2xl">{t('offers_page_subtitle')}</p>
          <div className="flex flex-wrap gap-6 mt-6 text-white/90 text-sm">
            <span><b className="text-white text-2xl">{offers.length}</b> {t('active_offers')}</span>
            <span><b className="text-white text-2xl">{CATEGORIES.length - 1}</b> {t('categories')}</span>
            <span><b className="text-white text-2xl">-{maxDiscount}%</b> {t('max_discount')}</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-b sticky top-[80px] md:top-[128px] z-30 shadow-sm">
        <div className="container py-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <Input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder={t('search_placeholder')} className="pl-10 h-11"/>
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              className="h-11 px-4 rounded-md border bg-white text-sm font-medium">
              <option value="discount">{t('sort_discount')}</option>
              <option value="price-low">{t('sort_price_low')}</option>
              <option value="price-high">{t('sort_price_high')}</option>
              <option value="name">{t('sort_name')}</option>
            </select>
            {(search || cat !== 'te-gjitha') && (
              <Button variant="outline" onClick={() => {setSearch(''); setCat('te-gjitha')}}>
                <X className="h-4 w-4 mr-1"/> {t('clear')}
              </Button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map(c => (
              <button key={c.slug} onClick={() => setCat(c.slug)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-xs border transition ${
                  cat === c.slug
                    ? 'bg-[#EF7B22] border-[#EF7B22] text-white'
                    : 'bg-white border-neutral-200 hover:border-[#EF7B22]'
                }`}>
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#EF7B22]"/></div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-5">{t('found')} <b>{list.length}</b> {t('offers')}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {list.map(o => <OfferCard key={o.id} offer={o} lang={lang}/>)}
              </div>
              {list.length === 0 && (
                <div className="text-center py-20">
                  <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-3"/>
                  <p className="text-muted-foreground">{t('no_offers_match')}</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default OfertaPage
