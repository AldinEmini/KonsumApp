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
import { useAuth } from '@/lib/auth-context'

function AdminLogin() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Mirëse erdhët!')
      router.push('/admin/dashboard')
    } catch (err) {
      toast.error(err.message || 'Hyrja dështoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="hidden lg:flex lg:w-1/2 konsum-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/5498225/pexels-photo-5498225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" className="w-full h-full object-cover"/>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="bg-white inline-block p-2 rounded-lg w-fit"><Logo size="md"/></div>
          <div className="space-y-6">
            <ShieldCheck className="h-16 w-16 text-[#20A33A]"/>
            <h2 className="text-4xl font-black leading-tight">Panel Administrimi i Konsumit</h2>
            <p className="text-white/90 text-lg max-w-md">Menaxho ofertat, lokacionet, përmbajtjen e faqes dhe gjenero materiale marketingu – të gjitha në një vend.</p>
          </div>
          <p className="text-xs text-white/60">© {new Date().getFullYear()} Konsum Super Market</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#EF7B22]">
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
                className="w-full bg-[#EF7B22] hover:bg-[#C45F10] text-white font-bold h-12 text-base">
                {loading ? 'Duke u kyqur...' : 'Kyqu në Panel'}
              </Button>
            </form>

            <div className="mt-8 p-4 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-900">
              <b>Demo:</b> Përdorni email-in dhe fjalëkalimin që keni vendosur në cilësimet.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
