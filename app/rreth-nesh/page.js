import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import { Badge } from '@/components/ui/badge'
import { Award, Heart, Sparkles, Users, Clock, Truck, Shield, FileText } from 'lucide-react'
import { ABOUT_CONTENT, SITE } from '@/lib/mockData'

const VALUE_ICONS = { 0: Award, 1: Sparkles, 2: Heart, 3: Users }

function RrethNesh() {
  return (
    <div className="min-h-screen bg-white">
      <Header/>

      {/* Hero */}
      <section className="relative h-[360px] md:h-[460px] overflow-hidden">
        <img src="https://images.pexels.com/photos/5498225/pexels-photo-5498225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#E30613]/90 to-[#E30613]/50"/>
        <div className="container relative h-full flex items-center text-white">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-[#FFC72C] text-[#E30613] font-bold">SINCE 1991</Badge>
            <h1 className="text-4xl md:text-6xl font-black">{ABOUT_CONTENT.hero_title}</h1>
            <p className="text-lg md:text-xl text-white/90">{ABOUT_CONTENT.hero_subtitle}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 md:py-20">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <Badge className="bg-red-50 text-[#E30613] hover:bg-red-50">Historia jonë</Badge>
            <h2 className="text-3xl md:text-4xl font-black">Mbi 30 vite duke i shërbyer familjes maqedonase</h2>
            <p className="text-muted-foreground leading-relaxed md:text-lg">{ABOUT_CONTENT.history}</p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div><div className="text-3xl font-black text-[#E30613]">30+</div><div className="text-xs text-muted-foreground">Vite përvojë</div></div>
              <div><div className="text-3xl font-black text-[#E30613]">12</div><div className="text-xs text-muted-foreground">Lokacione</div></div>
              <div><div className="text-3xl font-black text-[#E30613]">500+</div><div className="text-xs text-muted-foreground">Punëtorë</div></div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1594567170531-bb0a139aaba3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxmcmVzaCUyMHByb2R1Y2V8ZW58MHx8fHJlZHwxNzgyMTc3ODY3fDA&ixlib=rb-4.1.0&q=85"
              alt="" className="rounded-2xl shadow-2xl aspect-[4/5] object-cover w-full"/>
            <div className="absolute -bottom-6 -left-6 bg-[#FFC72C] text-[#E30613] p-5 rounded-xl shadow-xl max-w-[200px]">
              <div className="text-3xl font-black">1991</div>
              <div className="text-sm font-semibold">Viti i themelimit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-neutral-50">
        <div className="container grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border-l-4 border-[#E30613] shadow-sm">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2"><Sparkles className="h-6 w-6 text-[#E30613]"/> Misioni Ynë</h3>
            <p className="text-muted-foreground leading-relaxed">{ABOUT_CONTENT.mission}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border-l-4 border-[#FFC72C] shadow-sm">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-2"><Award className="h-6 w-6 text-[#FFC72C]"/> Vizioni Ynë</h3>
            <p className="text-muted-foreground leading-relaxed">{ABOUT_CONTENT.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-red-50 text-[#E30613] hover:bg-red-50 mb-3">Vlerat tona</Badge>
            <h2 className="text-3xl md:text-4xl font-black">Çfarë na përfaqëson</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ABOUT_CONTENT.values.map((v, i) => {
              const Icon = VALUE_ICONS[i] || Heart
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border-2 border-neutral-100 hover:border-[#E30613] hover:shadow-lg transition group">
                  <div className="w-12 h-12 rounded-xl bg-red-50 group-hover:bg-[#E30613] group-hover:text-white transition flex items-center justify-center text-[#E30613] mb-4">
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

      {/* Working hours + Delivery */}
      <section className="py-16 bg-neutral-50">
        <div className="container grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <Clock className="h-10 w-10 text-[#E30613] mb-4"/>
            <h3 className="text-2xl font-black mb-4">Orari i Punës</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b"><span>E Hënë - E Premte</span><b>07:00 - 22:00</b></div>
              <div className="flex justify-between py-2 border-b"><span>E Shtunë</span><b>07:00 - 22:00</b></div>
              <div className="flex justify-between py-2 border-b"><span>E Diel</span><b>08:00 - 21:00</b></div>
              <div className="flex justify-between py-2"><span>Festat zyrtare</span><b>09:00 - 18:00</b></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm" id="derguar">
            <Truck className="h-10 w-10 text-[#E30613] mb-4"/>
            <h3 className="text-2xl font-black mb-4">Dërgesa në Shtëpi</h3>
            <p className="text-muted-foreground leading-relaxed">{ABOUT_CONTENT.delivery}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex gap-2"><span className="text-[#E30613]">✓</span> Falas mbi 2000 MKD</li>
              <li className="flex gap-2"><span className="text-[#E30613]">✓</span> Brenda 2 orësh në Shkup</li>
              <li className="flex gap-2"><span className="text-[#E30613]">✓</span> Pagesa me kesh ose kartë</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-16 md:py-20" id="politika">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-red-50 text-[#E30613] hover:bg-red-50 mb-3">Politikat tona</Badge>
            <h2 className="text-3xl md:text-4xl font-black">Kushtet dhe Politikat</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {ABOUT_CONTENT.policies.map((p, i) => (
              <div key={i} className="p-6 border rounded-2xl bg-white">
                <Shield className="h-8 w-8 text-[#E30613] mb-3"/>
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
