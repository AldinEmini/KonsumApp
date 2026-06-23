'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2, Save, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'

const EMPTY_SLIDE = { title: '', subtitle: '', cta: '', href: '/oferta', image: '', badge: '' }

export default function HeroEditor() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => {
      setContent(d.content)
      setSlides(d.content?.hero_slides || [])
      setLoading(false)
    })
  }, [])

  const updateSlide = (i, field, value) => {
    setSlides(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: value } : sl))
  }
  const addSlide = () => setSlides(s => [...s, { ...EMPTY_SLIDE, id: Date.now() }])
  const removeSlide = (i) => setSlides(s => s.filter((_, idx) => idx !== i))
  const moveSlide = (i, dir) => {
    const ni = i + dir
    if (ni < 0 || ni >= slides.length) return
    setSlides(s => {
      const ns = [...s]
      ;[ns[i], ns[ni]] = [ns[ni], ns[i]]
      return ns
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...content, hero_slides: slides })
      })
      if (!r.ok) throw new Error('failed')
      toast.success('Hero banners u ruajtën me sukses')
    } catch {
      toast.error('Dështoi ruajtja')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader2 className="h-6 w-6 animate-spin"/>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Hero Banner / Slider</h1>
          <p className="text-muted-foreground mt-1">Menaxho slide-t e faqes kryesore. {slides.length} slide aktive.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addSlide} variant="outline"><Plus className="h-4 w-4 mr-1.5"/> Shto Slide</Button>
          <Button onClick={save} disabled={saving} className="bg-[#EF7B22] hover:bg-[#C45F10]">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}
            Ruaj të gjitha
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {slides.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border overflow-hidden">
            <div className="flex items-center justify-between bg-neutral-50 border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-[#EF7B22] text-white font-bold rounded-full flex items-center justify-center text-sm">{i + 1}</span>
                <span className="font-semibold">{s.title || 'Slide pa titull'}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveSlide(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-neutral-200 disabled:opacity-30"><ChevronUp className="h-4 w-4"/></button>
                <button onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} className="p-1.5 rounded hover:bg-neutral-200 disabled:opacity-30"><ChevronDown className="h-4 w-4"/></button>
                <button onClick={() => removeSlide(i)} className="p-1.5 rounded hover:bg-red-100"><Trash2 className="h-4 w-4 text-red-600"/></button>
              </div>
            </div>
            <div className="grid lg:grid-cols-[280px_1fr] gap-5 p-5">
              <div className="space-y-2">
                <Label className="font-semibold text-xs">Imazhi (preview)</Label>
                <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden relative">
                  {s.image ? (
                    <>
                      <img src={s.image} alt="" className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"/>
                      <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                        {s.badge && <span className="self-start bg-[#20A33A] text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">{s.badge}</span>}
                        <h3 className="text-sm font-black leading-tight line-clamp-2">{s.title}</h3>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <ImagePlus className="h-8 w-8"/>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Label className="font-semibold text-xs">URL e Imazhit</Label>
                  <Input value={s.image || ''} onChange={e => updateSlide(i, 'image', e.target.value)} placeholder="https://..."/>
                </div>
                <div>
                  <Label className="font-semibold text-xs">Titulli</Label>
                  <Input value={s.title || ''} onChange={e => updateSlide(i, 'title', e.target.value)} placeholder="Ofertat Javore"/>
                </div>
                <div>
                  <Label className="font-semibold text-xs">Badge</Label>
                  <Input value={s.badge || ''} onChange={e => updateSlide(i, 'badge', e.target.value)} placeholder="E RE / PROMO"/>
                </div>
                <div className="sm:col-span-2">
                  <Label className="font-semibold text-xs">Nëntitulli</Label>
                  <Input value={s.subtitle || ''} onChange={e => updateSlide(i, 'subtitle', e.target.value)} placeholder="Përshkrimi i shkurtër..."/>
                </div>
                <div>
                  <Label className="font-semibold text-xs">Teksti i butonit (CTA)</Label>
                  <Input value={s.cta || ''} onChange={e => updateSlide(i, 'cta', e.target.value)} placeholder="Shiko Ofertat"/>
                </div>
                <div>
                  <Label className="font-semibold text-xs">Linku (href)</Label>
                  <Input value={s.href || ''} onChange={e => updateSlide(i, 'href', e.target.value)} placeholder="/oferta"/>
                </div>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground mb-3">Asnjë slide. Shtoni një të re më poshtë.</p>
            <Button onClick={addSlide} className="bg-[#EF7B22] hover:bg-[#C45F10]"><Plus className="h-4 w-4 mr-1.5"/> Shto Slide</Button>
          </div>
        )}
      </div>
    </div>
  )
}
