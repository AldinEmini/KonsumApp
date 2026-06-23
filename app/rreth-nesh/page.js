'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { Badge } from '@/components/ui/badge'
import { Award, Heart, Sparkles, Users, Clock, Truck, Shield, Loader2 } from 'lucide-react'
import { ABOUT_CONTENT } from '@/lib/mockData'
import { useI18n } from '@/lib/i18n-context'

const VALUE_ICONS = { 0: Award, 1: Sparkles, 2: Heart, 3: Users }

function RrethNesh() {
  const { t } = useI18n()
  const [content, setContent] = useState(ABOUT_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      if (d.content?.about) setContent(d.content.about)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <section className="relative h-[360px] md:h-[460px] overflow-hidden">
        <img src="https://images.pexels.com/photos/26184235/pexels-photo-26184235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#EF7B22]/90 to-[#EF7B22]/50"/>
        <div className="container relative h-full flex items-center text-white">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-[#20A33A] text-white font-bold hover:bg-[#20A33A]">{t('about_badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-black">{content.hero_title}</h1>
            <p className="text-lg md:text-xl text-white/90">{content.hero_subtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50">{t('history_label')}</Badge>
            <h2 className="text-3xl md:text-4xl font-black">{t('history_heading')}</h2>
            <p className="text-muted-foreground leading-relaxed md:text-lg">{content.history}</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div><div className="text-3xl font-black text-[#EF7B22]">30+</div><div className="text-xs text-muted-foreground">{t('years_experience')}</div></div>
              <div><div className="text-3xl font-black text-[#EF7B22]">12</div><div className="text-xs text-muted-foreground">{t('locations_label')}</div></div>
              <div><div className="text-3xl font-black text-[#EF7B22]">500+</div><div className="text-xs text-muted-foreground">{t('employees')}</div></div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.pexels.com/photos/5498233/pexels-photo-5498233.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="" className="rounded-2xl shadow-2xl aspect-[4/5] object-cover w-full"/>
            <div className="absolute -bottom-6 -left-6 bg-[#20A33A] text-white p-5 rounded-xl shadow-xl max-w-[200px]">
              <div className="text-3xl font-black">1991</div>
              <div className="text-sm font-semibold">{t('founded_year')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="container grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border-l-4 border-[#EF7B22] shadow-sm">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2"><Sparkles className="h-6 w-6 text-[#EF7B22]"/> {t('our_mission')}</h3>
            <p className="text-muted-foreground leading-relaxed">{content.mission}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border-l-4 border-[#20A33A] shadow-sm">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2"><Award className="h-6 w-6 text-[#20A33A]"/> {t('our_vision')}</h3>
            <p className="text-muted-foreground leading-relaxed">{content.vision}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50 mb-3">{t('our_values')}</Badge>
            <h2 className="text-3xl md:text-4xl font-black">{t('what_we_stand_for')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(content.values || []).map((v, i) => {
              const Icon = VALUE_ICONS[i] || Heart
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-neutral-100 hover:border-[#EF7B22] hover:shadow-lg transition group">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-[#EF7B22] group-hover:text-white transition flex items-center justify-center text-[#EF7B22] mb-4">
                    <Icon className="h-6 w-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="container grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <Clock className="h-10 w-10 text-[#EF7B22] mb-4"/>
            <h3 className="text-2xl font-black mb-4">{t('working_hours')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b"><span>{t('monday_friday')}</span><b>07:00 - 22:00</b></div>
              <div className="flex justify-between py-2 border-b"><span>{t('saturday')}</span><b>07:00 - 22:00</b></div>
              <div className="flex justify-between py-2 border-b"><span>{t('sunday')}</span><b>08:00 - 21:00</b></div>
              <div className="flex justify-between py-2"><span>{t('holidays')}</span><b>09:00 - 18:00</b></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm" id="derguar">
            <Truck className="h-10 w-10 text-[#EF7B22] mb-4"/>
            <h3 className="text-2xl font-black mb-4">{t('home_delivery')}</h3>
            <p className="text-muted-foreground leading-relaxed">{content.delivery}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-[#20A33A]">✓</span> {t('free_above')}</li>
              <li className="flex gap-2"><span className="text-[#20A33A]">✓</span> {t('within_2h')}</li>
              <li className="flex gap-2"><span className="text-[#20A33A]">✓</span> {t('cash_or_card')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" id="politika">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-orange-50 text-[#EF7B22] hover:bg-orange-50 mb-3">{t('our_policies')}</Badge>
            <h2 className="text-3xl md:text-4xl font-black">{t('terms_policies')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {(content.policies || []).map((p, i) => (
              <div key={i} className="p-6 border rounded-2xl bg-white">
                <Shield className="h-8 w-8 text-[#EF7B22] mb-3"/>
                <h4 className="font-bold mb-2">{p.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default RrethNesh
