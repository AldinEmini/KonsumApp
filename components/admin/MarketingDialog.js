'use client'

import { useEffect, useState, useRef, forwardRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { LOGO } from '@/lib/mockData'

// ============ STORY DESIGN (1080x1920) ============
const StoryDesign = forwardRef(function StoryDesign({ offer }, ref) {
  if (!offer) return null
  return (
    <div ref={ref} style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #EF7B22 0%, #C45F10 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(32,163,58,0.25)' }}/>
      <div style={{ position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: '50%', background: 'rgba(32,163,58,0.2)' }}/>

      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 12 }}>
          <img src={LOGO.mascot} crossOrigin="anonymous" alt="" style={{ height: 100, width: 'auto' }}/>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 240, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#20A33A', color: 'white', fontWeight: 900, fontSize: 36, padding: '14px 32px',
          borderRadius: 999, textTransform: 'uppercase', letterSpacing: 2,
        }}>Oferta e javes</div>
      </div>

      <div style={{ position: 'absolute', top: 360, left: 90, right: 90, height: 760, background: 'white', borderRadius: 32, padding: 30, boxShadow: '0 30px 80px rgba(0,0,0,0.25)' }}>
        {offer.image && (
          <img src={offer.image} crossOrigin="anonymous" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }}/>
        )}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%',
          background: '#EF7B22', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 56, fontWeight: 900, border: '8px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>{offer.badge}</div>
      </div>

      <div style={{ position: 'absolute', top: 1180, left: 80, right: 80, color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05, marginBottom: 40, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {offer.name}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 30, marginTop: 60 }}>
          <div style={{
            fontSize: 56, color: 'rgba(255,255,255,0.65)', textDecoration: 'line-through', textDecorationColor: '#20A33A',
            textDecorationThickness: 6, fontWeight: 700,
          }}>{offer.oldPrice} MKD</div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16 }}>
          <div style={{
            fontSize: 200, fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>{offer.newPrice}</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: '#FFE8D0' }}>MKD/{offer.unit}</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 140,
        background: '#20A33A', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: 'white', fontSize: 42, fontWeight: 900, letterSpacing: 4 }}>
          SUPER MARKET KONSUM
        </div>
      </div>
    </div>
  )
})

// ============ POST DESIGN (1080x1350) ============
const PostDesign = forwardRef(function PostDesign({ offers }, ref) {
  const items = (offers || []).slice(0, 6)
  return (
    <div ref={ref} style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: 'white', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #EF7B22 0%, #20A33A 100%)',
        padding: '30px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 140,
      }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 8 }}>
          <img src={LOGO.mascot} crossOrigin="anonymous" alt="" style={{ height: 80, width: 'auto' }}/>
        </div>
        <div style={{ textAlign: 'right', color: 'white' }}>
          <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>OFERTAT</div>
          <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>JAVORE</div>
        </div>
      </div>

      <div style={{
        padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 16, height: 1090,
      }}>
        {items.map(o => (
          <div key={o.id} style={{
            background: 'white', border: '3px solid #f5f5f5', borderRadius: 20, overflow: 'hidden',
            position: 'relative', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ width: '100%', height: 230, background: '#fafafa', position: 'relative' }}>
              {o.image && (
                <img src={o.image} crossOrigin="anonymous" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              )}
              <div style={{
                position: 'absolute', top: 10, left: 10, background: '#EF7B22', color: 'white',
                padding: '6px 12px', borderRadius: 8, fontSize: 22, fontWeight: 900,
              }}>{o.badge}</div>
            </div>
            <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#222', lineHeight: 1.2, marginBottom: 6, minHeight: 54 }}>{o.name}</div>
              <div>
                <div style={{ fontSize: 18, color: '#999', textDecoration: 'line-through' }}>{o.oldPrice} MKD</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#EF7B22', lineHeight: 1 }}>
                  {o.newPrice} <span style={{ fontSize: 18, fontWeight: 400, color: '#999' }}>MKD/{o.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: '#20A33A', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'white', height: 120,
      }}>
        <div style={{ fontSize: 32, fontWeight: 900 }}>SUPER MARKET KONSUM</div>
        <div style={{ fontSize: 22, fontWeight: 600 }}>www.konsum.mk · Vlefshmëria deri të dielen</div>
      </div>
    </div>
  )
})

// Image loader helper - convert remote image to data URL
async function loadImageDataUrl(url) {
  try {
    const r = await fetch(url, { mode: 'cors' })
    const blob = await r.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export default function MarketingDialog({ open, onOpenChange, type, offers }) {
  const [selectedId, setSelectedId] = useState('')
  const [generating, setGenerating] = useState(false)
  const storyRef = useRef(null)
  const postRef = useRef(null)

  useEffect(() => {
    const active = offers?.filter(o => o.active) || []
    if (active.length && !selectedId) setSelectedId(active[0].id)
  }, [offers, selectedId])

  const activeOffers = offers?.filter(o => o.active) || []
  const selected = activeOffers.find(o => o.id === selectedId) || activeOffers[0]

  const downloadPng = async (ref, filename) => {
    if (!ref.current) return
    setGenerating(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 1,
        skipFonts: true,
      })
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
      toast.success('U shkarkua me sukses!')
    } catch (e) {
      console.error(e)
      toast.error('Dështoi: ' + (e.message || 'gabim'))
    } finally {
      setGenerating(false)
    }
  }

  const downloadPDF = async () => {
    setGenerating(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210, pageH = 297

      // Cover
      pdf.setFillColor(239, 123, 34)
      pdf.rect(0, 0, pageW, pageH, 'F')
      pdf.setFillColor(32, 163, 58)
      pdf.rect(0, 90, pageW, 90, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(60)
      pdf.text('KONSUM', pageW / 2, 60, { align: 'center' })
      pdf.setFontSize(28)
      pdf.text('OFERTAT JAVORE', pageW / 2, 130, { align: 'center' })
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      const today = new Date()
      const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      pdf.text(`${today.toLocaleDateString('sq')} - ${weekEnd.toLocaleDateString('sq')}`, pageW / 2, 155, { align: 'center' })
      pdf.text(`${activeOffers.length} oferta aktive`, pageW / 2, 170, { align: 'center' })
      pdf.setFontSize(10)
      pdf.text('SUPER MARKET KONSUM', pageW / 2, 280, { align: 'center' })

      // Pre-load images
      const images = await Promise.all(activeOffers.map(o => loadImageDataUrl(o.image)))

      const perPage = 6
      const cardW = 85, cardH = 75
      const margin = 15
      const gap = 5

      for (let i = 0; i < activeOffers.length; i += perPage) {
        pdf.addPage()
        pdf.setFillColor(239, 123, 34)
        pdf.rect(0, 0, pageW, 18, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16)
        pdf.text('OFERTAT JAVORE - KONSUM', pageW / 2, 12, { align: 'center' })

        const pageOffers = activeOffers.slice(i, i + perPage)
        for (let j = 0; j < pageOffers.length; j++) {
          const o = pageOffers[j]
          const imgData = images[i + j]
          const col = j % 2, row = Math.floor(j / 2)
          const x = margin + col * (cardW + gap)
          const y = 25 + row * (cardH + gap)

          pdf.setFillColor(255, 255, 255)
          pdf.setDrawColor(220, 220, 220)
          pdf.roundedRect(x, y, cardW, cardH, 3, 3, 'FD')

          if (imgData) {
            try { pdf.addImage(imgData, 'JPEG', x + 4, y + 4, 35, 35) } catch {}
          }

          pdf.setFillColor(239, 123, 34)
          pdf.roundedRect(x + 4, y + 42, 35, 8, 1, 1, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.text(o.badge || 'OFERTE', x + 21.5, y + 47.5, { align: 'center' })

          pdf.setTextColor(30, 30, 30)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          const name = pdf.splitTextToSize(o.name, cardW - 45)
          pdf.text(name.slice(0, 2), x + 42, y + 12)

          pdf.setTextColor(150, 150, 150)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          const oldP = `${o.oldPrice} MKD`
          pdf.text(oldP, x + 42, y + 30)
          pdf.setDrawColor(150, 150, 150)
          pdf.line(x + 42, y + 29, x + 42 + pdf.getTextWidth(oldP), y + 29)

          pdf.setTextColor(239, 123, 34)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(18)
          pdf.text(`${o.newPrice} MKD`, x + 42, y + 44)
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
          pdf.setTextColor(120, 120, 120)
          pdf.text(`/ ${o.unit}`, x + 42, y + 50)

          const savings = o.oldPrice - o.newPrice
          if (savings > 0) {
            pdf.setFillColor(32, 163, 58)
            pdf.roundedRect(x + 42, y + 55, 38, 8, 1, 1, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(9)
            pdf.text(`Kurseni ${savings} MKD`, x + 61, y + 60.5, { align: 'center' })
          }
        }

        pdf.setTextColor(150, 150, 150)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.text('Vlefshmeria deri te dielen | konsum.mk', pageW / 2, 290, { align: 'center' })
      }

      pdf.save(`konsum-katalog-javor.pdf`)
      toast.success('PDF u shkarkua!')
    } catch (e) {
      console.error(e)
      toast.error('Dështoi: ' + (e.message || 'gabim'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#EF7B22]"/>
            {type === 'story' && 'Instagram Story (1080×1920)'}
            {type === 'post' && 'Post Javor (1080×1350)'}
            {type === 'pdf' && 'PDF Katalog Javor'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="bg-neutral-100 p-4 rounded-xl flex justify-center items-start overflow-hidden">
            {type === 'story' && (
              <div style={{ width: 1080 * 0.32, height: 1920 * 0.32, overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left' }}>
                  <StoryDesign ref={storyRef} offer={selected}/>
                </div>
              </div>
            )}
            {type === 'post' && (
              <div style={{ width: 1080 * 0.45, height: 1350 * 0.45, overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left' }}>
                  <PostDesign ref={postRef} offers={activeOffers}/>
                </div>
              </div>
            )}
            {type === 'pdf' && (
              <div className="py-12 text-center">
                <div className="w-32 h-44 mx-auto bg-white border shadow-lg rounded relative overflow-hidden">
                  <div className="absolute inset-0 konsum-gradient"/>
                  <div className="relative h-full flex flex-col items-center justify-center text-white p-3">
                    <div className="text-xl font-black">KONSUM</div>
                    <div className="text-[10px] mt-1">OFERTAT</div>
                    <div className="text-[10px]">JAVORE</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Katalog PDF me <b>{activeOffers.length}</b> oferta aktive</p>
                <p className="text-xs text-muted-foreground mt-1">6 produkte për faqe · A4 · Profesional</p>
              </div>
            )}
          </div>

          <div className="lg:w-72 space-y-4">
            {type === 'story' && (
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Zgjidh produktin</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-white text-sm">
                  {activeOffers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            )}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-xs text-orange-900 space-y-1">
              <p><b>Madhësia:</b> {type === 'story' ? '1080×1920' : type === 'post' ? '1080×1350' : 'A4 (210×297mm)'}</p>
              <p><b>Format:</b> {type === 'pdf' ? 'PDF' : 'PNG'}</p>
              <p><b>Për:</b> {type === 'story' ? 'Instagram/Facebook Story' : type === 'post' ? 'Instagram/Facebook Post' : 'Print, Email, WhatsApp'}</p>
            </div>
            <Button
              onClick={() => {
                if (type === 'story') downloadPng(storyRef, `konsum-story-${selected?.name?.replace(/\s+/g, '-')}.png`)
                else if (type === 'post') downloadPng(postRef, `konsum-post-javor.png`)
                else downloadPDF()
              }}
              disabled={generating || !activeOffers.length}
              className="w-full bg-[#EF7B22] hover:bg-[#C45F10] h-12 font-bold">
              {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Download className="h-4 w-4 mr-2"/>}
              {generating ? 'Duke gjeneruar...' : 'Shkarko'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
