'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Tag, Truck, Award, Clock, ArrowRight, Search, Flame } from 'lucide-react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import OfferCard from '@/components/site/OfferCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HERO_SLIDES, OFFERS, CATEGORIES } from '@/lib/mockData'

function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedCat, setSelectedCat] = useState('te-gjitha')
  const [search, setSearch] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 5000)
    emblaApi.on('select', () => setActiveSlide(emblaApi.selectedScrollSnap()))
    return () => clearInterval(id)
  }, [emblaApi])

  const filtered = OFFERS.filter(o => {
    const matchCat = selectedCat === 'te-gjitha' || o.category === selectedCat
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const topDeals = [...OFFERS].sort((a,b) => (b.oldPrice-b.newPrice)/b.oldPrice - (a.oldPrice-a.newPrice)/a.oldPrice).slice(0,4)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero slider */}
      <section className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {HERO_SLIDES.map(s => (
              <div key={s.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="relative h-[420px] md:h-[560px]">
                  <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"/>
                  <div className="container relative h-full flex items-center">
                    <div className="max-w-2xl text-white space-y-5">
                      <Badge className="bg-[#20A33A] text-[#EF7B22] font-bold text-sm px-3 py-1">{s.badge}</Badge>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] drop-shadow-lg">{s.title}</h1>
                      <p className="text-lg md:text-2xl text-white/90 max-w-xl">{s.subtitle}</p>
                      <Button asChild size="lg" className="bg-[#EF7B22] hover:bg-[#C45F10] text-white font-bold h-14 px-8 text-base shadow-xl">
                        <Link href={s.href}>{s.cta} <ArrowRight className="ml-2 h-5 w-5"/></Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition"><ChevronLeft className="h-5 w-5"/></button>
        <button onClick={() => emblaApi?.scrollNext()} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition"><ChevronRight className="h-5 w-5"/></button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${activeSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}/>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#20A33A] py-4 border-b-4 border-[#EF7B22]">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          {[
            {i: Tag, t: 'Zbritje deri 50%'},
            {i: Truck, t: 'Dërgesa në shtëpi'},
            {i: Award, t: 'Cilësi e garantuar'},
            {i: Clock, t: 'Hapur çdo ditë 07-22'},
          ].map((b, idx) => (
            <div key={idx} className="flex items-center justify-center gap-2 font-bold text-sm md:text-base">
              <b.i className="h-5 w-5"/> {b.t}
            </div>
          ))}
        </div>
      </section>

      {/* Search + categories */}
      <section className="py-10 md:py-14">
        <div className="container space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50 font-semibold">Ofertat e javes</Badge>
            <h2 className="text-3xl md:text-5xl font-black">Zbuloni çmimet më të mira</h2>
            <p className="text-muted-foreground md:text-lg">Ofertat e përzgjedhura me kujdes vetëm për ju, të vërteta dhe me vlefshmëri të kufizuar.</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
            <Input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Kërkoni për produkte në ofertë..."
              className="pl-12 h-14 text-base shadow-sm border-2 focus-visible:ring-2 focus-visible:ring-[#EF7B22] focus-visible:border-[#EF7B22]"/>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto hide-scrollbar pb-2">
            {CATEGORIES.map(c => (
              <button key={c.slug} onClick={() => setSelectedCat(c.slug)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm border-2 transition ${
                  selectedCat === c.slug
                    ? 'bg-[#EF7B22] border-[#EF7B22] text-white shadow-md'
                    : 'bg-white border-neutral-200 text-foreground hover:border-[#EF7B22]'
                }`}>
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>

          {/* Offers grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filtered.map(o => <OfferCard key={o.id} offer={o}/>)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">Asnjë ofertë nuk u gjet.</div>
          )}

          <div className="text-center pt-4">
            <Button asChild size="lg" variant="outline" className="border-2 border-[#EF7B22] text-[#EF7B22] hover:bg-[#EF7B22] hover:text-white font-bold h-12 px-8">
              <Link href="/oferta">Shiko të gjitha ofertat <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Top deals showcase */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-6 w-6 text-[#EF7B22]"/>
                <Badge className="bg-[#EF7B22] text-white">HOT DEALS</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-black">Zbritjet më të mëdha të javës</h2>
            </div>
            <Link href="/oferta" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#EF7B22] hover:underline">
              Shiko të gjitha <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topDeals.map(o => <OfferCard key={o.id} offer={o}/>)}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="py-12">
        <div className="container">
          <div className="rounded-3xl overflow-hidden relative konsum-gradient p-8 md:p-14 text-white">
            <div className="relative z-10 max-w-2xl space-y-4">
              <Badge className="bg-[#20A33A] text-[#EF7B22] font-bold">KATALOGU JAVOR</Badge>
              <h3 className="text-3xl md:text-5xl font-black leading-tight">Shkarko katalogun e ofertave javore</h3>
              <p className="text-white/90 text-lg">PDF i plotë me të gjitha ofertat aktive. Print dhe sillëni me vete në dyqan.</p>
              <Button size="lg" className="bg-[#20A33A] hover:bg-[#178A30] text-[#EF7B22] font-bold h-12">
                Shkarko PDF (Demo)
              </Button>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 hidden md:block">
              <img src="https://images.pexels.com/photos/5498233/pexels-photo-5498233.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
