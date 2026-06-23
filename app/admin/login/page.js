'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Mail, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/site/Logo'
import { toast } from 'sonner'

function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Mock login (faza e mockup-it)
    setTimeout(() => {
      setLoading(false)
      if (email && password) {
        toast.success('Mirëse erdhët!')
        router.push('/admin/dashboard')
      } else {
        toast.error('Plotësoni të dhënat')
      }
    }, 700)
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 konsum-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1642582034088-860e69149ef4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwyfHxzdXBlcm1hcmtldHxlbnwwfHx8cmVkfDE3ODIxNzc4NTF8MA&ixlib=rb-4.1.0&q=85" alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Logo size="lg" white/>
          <div className="space-y-6">
            <ShieldCheck className="h-16 w-16 text-[#FFC72C]"/>
            <h2 className="text-4xl font-black leading-tight">Panel Administrimi i Konsumit</h2>
            <p className="text-white/90 text-lg max-w-md">Menaxho ofertat, lokacionet, përmbajtjen e faqes dhe gjenero materiale marketingu – të gjitha në një vend.</p>
            <div className="flex gap-6 pt-4 text-sm">
              <div><div className="text-3xl font-black text-[#FFC72C]">24</div><div>Oferta aktive</div></div>
              <div><div className="text-3xl font-black text-[#FFC72C]">12</div><div>Lokacione</div></div>
              <div><div className="text-3xl font-black text-[#FFC72C]">156</div><div>Produkte</div></div>
            </div>
          </div>
          <p className="text-xs text-white/60">© {new Date().getFullYear()} Konsum. Të gjitha të drejtat e rezervuara.</p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#E30613]">
            <ArrowLeft className="h-4 w-4"/> Kthehu në faqe
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center"><Logo size="lg"/></div>
            <h1 className="text-3xl font-black mb-2">Hyrje në Admin</h1>
            <p className="text-muted-foreground mb-8">Vendosni kredencialet tuaja për t’u kyqur në panel.</p>

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="admin@konsum.mk" className="pl-10 h-12" required/>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-semibold">Fjalëkalimi</Label>
                  <a href="#" className="text-xs text-[#E30613] hover:underline">Keni harruar?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input id="password" type={show ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••" className="pl-10 pr-10 h-12" required/>
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} size="lg"
                className="w-full bg-[#E30613] hover:bg-[#b8040f] text-white font-bold h-12 text-base">
                {loading ? 'Duke u kyqur...' : 'Kyqu në Panel'}
              </Button>
            </form>

            <div className="mt-8 p-4 rounded-lg bg-neutral-100 text-xs text-muted-foreground">
              <b className="text-foreground">Mockup demo:</b> Përdorni çfarëdo email/password për të parë dashboardin. Autentikimi i vërtetë me Supabase do të shtohet pas miratimit.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
