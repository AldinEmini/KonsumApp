'use client'

import { useEffect, useState, useRef, forwardRef, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, Loader2, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { LOGO } from '@/lib/mockData'

const StoryDesign = forwardRef(function StoryDesign({ offer }, ref) {
  if (!offer) return null
  return (
    <div ref={ref} style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #EF7B22 0%, #C45F10 60%, #20A33A 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 460, height: 460, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}/>
      <div style={{ position: 'absolute', bottom: -180, left: -180, width: 580, height: 580, borderRadius: '50%', background: 'rgba(32,163,58,0.35)' }}/>
      <div style={{ position: 'absolute', top: '40%', left: -80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
      <div style={{ position: 'absolute', top: 800, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}/>

      {/* Sparkles SVG decoration */}
      <svg style={{ position: 'absolute', top: 200, right: 80, opacity: 0.4 }} width="60" height="60" viewBox="0 0 24 24" fill="white">
        <path d="M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z"/>
      </svg>

      {/* Logo card */}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <img src={LOGO.mascot} crossOrigin="anonymous" alt="" style={{ height: 110, width: 'auto' }}/>
        </div>
      </div>

      {/* Badge ribbon */}
      <div style={{ position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'white', color: '#EF7B22', fontWeight: 900, fontSize: 38, padding: '16px 40px',
          borderRadius: 999, textTransform: 'uppercase', letterSpacing: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        }}>★ OFERTA E JAVËS ★</div>
      </div>

      {/* Product card */}
      <div style={{ position: 'absolute', top: 400, left: 90, right: 90, height: 720, background: 'white', borderRadius: 36, padding: 32, boxShadow: '0 40px 100px rgba(0,0,0,0.35)' }}>
        {offer.image && (
          <img src={offer.image} crossOrigin="anonymous" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24 }}/>
        )}
        {/* Discount circle */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%',
          background: 'linear-gradient(135deg, #EF7B22 0%, #C45F10 100%)', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: 64, fontWeight: 900, border: '10px solid white', boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          transform: 'rotate(8deg)',
        }}>
          <span>{offer.badge}</span>
        </div>
      </div>

      {/* Product info */}
      <div style={{ position: 'absolute', top: 1180, left: 80, right: 80, color: 'white', textAlign: 'center' }}>
        <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.05, marginBottom: 30, textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          {offer.name}
        </div>

        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <div style={{
            fontSize: 56, color: 'rgba(255,255,255,0.6)', fontWeight: 700,
            position: 'relative', display: 'inline-block',
          }}>
            <span>{offer.oldPrice} MKD</span>
            <span style={{
              position: 'absolute', top: '50%', left: 0, right: 0, height: 4,
              background: '#20A33A', transform: 'rotate(-8deg)',
            }}/>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 12 }}>
          <div style={{
            fontSize: 220, fontWeight: 900, color: 'white', lineHeight: 1, textShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}>{offer.newPrice}</div>
          <div style={{ fontSize: 56, fontWeight: 700, color: '#FFE8D0' }}>MKD/{offer.unit}</div>
        </div>
      </div>

      {/* Bottom band */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ color: 'white', fontSize: 46, fontWeight: 900, letterSpacing: 5 }}>SUPER MARKET KONSUM</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22, letterSpacing: 2 }}>★ Çdo ditë, çmime të mira ★</div>
      </div>
    </div>
  )
})

const PostDesign = forwardRef(function PostDesign({ offers, title }, ref) {
  const items = (offers || []).slice(0, 6)
  return (
    <div ref={ref} style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#fefae8', fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Decorative confetti dots */}
      <div style={{ position: 'absolute', top: 30, right: 220, width: 14, height: 14, borderRadius: '50%', background: '#EF7B22' }}/>
      <div style={{ position: 'absolute', top: 90, right: 100, width: 8, height: 8, borderRadius: '50%', background: '#20A33A' }}/>
      <div style={{ position: 'absolute', bottom: 200, left: 40, width: 10, height: 10, borderRadius: '50%', background: '#EF7B22' }}/>
      <div style={{ position: 'absolute', bottom: 280, left: 100, width: 16, height: 16, borderRadius: '50%', background: '#20A33A', opacity: 0.5 }}/>
      <div style={{ position: 'absolute', top: '50%', right: 30, width: 12, height: 12, borderRadius: '50%', background: '#20A33A' }}/>

      {/* Header with diagonal */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #EF7B22 0%, #C45F10 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}/>
        <div style={{
          position: 'relative', height: '100%', padding: '30px 40px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ background: 'white', borderRadius: 14, padding: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
            <img src={LOGO.mascot} crossOrigin="anonymous" alt="" style={{ height: 90, width: 'auto' }}/>
          </div>
          <div style={{ textAlign: 'right', color: 'white' }}>
            <div style={{
              fontSize: 24, fontWeight: 800, color: '#FFE8D0', letterSpacing: 4, marginBottom: 4,
            }}>★ JAVA AKTUALE ★</div>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.95, textShadow: '0 3px 10px rgba(0,0,0,0.3)' }}>{title || 'OFERTAT'}</div>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.95, textShadow: '0 3px 10px rgba(0,0,0,0.3)' }}>JAVORE</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: '20px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 16, height: 980,
      }}>
        {items.map((o, idx) => (
          <div key={o.id || idx} style={{
            background: 'white', borderRadius: 22, overflow: 'hidden', position: 'relative',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)', border: '2px solid #ffe8d0',
          }}>
            <div style={{ width: '100%', height: 240, background: '#fafafa', position: 'relative' }}>
              {o.image && (
                <img src={o.image} crossOrigin="anonymous" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              )}
              {/* Discount badge */}
              <div style={{
                position: 'absolute', top: 12, left: 12, background: '#EF7B22', color: 'white',
                padding: '8px 14px', borderRadius: 10, fontSize: 26, fontWeight: 900,
                boxShadow: '0 4px 12px rgba(239,123,34,0.4)', border: '2px solid white',
              }}>{o.badge}</div>
              {/* Offer ribbon */}
              <div style={{
                position: 'absolute', top: 12, right: 12, background: '#20A33A', color: 'white',
                padding: '4px 10px', borderRadius: 6, fontSize: 14, fontWeight: 900, letterSpacing: 1,
              }}>OFERTË</div>
            </div>
            <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#222', lineHeight: 1.2, marginBottom: 6, minHeight: 54 }}>{o.name}</div>
              <div>
                <div style={{ fontSize: 18, color: '#999', textDecoration: 'line-through', textDecorationColor: '#EF7B22', textDecorationThickness: 2 }}>{o.oldPrice} MKD</div>
                <div style={{ fontSize: 46, fontWeight: 900, color: '#EF7B22', lineHeight: 1 }}>
                  {o.newPrice} <span style={{ fontSize: 18, fontWeight: 400, color: '#999' }}>MKD/{o.unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        background: '#20A33A', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'white', height: 110, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>SUPER MARKET KONSUM</div>
          <div style={{ fontSize: 16, color: '#FFE8D0', marginTop: 2 }}>★ Vlefshmëria deri të dielen ★</div>
        </div>
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>www.konsum.mk</div>
          <div style={{ fontSize: 14, color: '#FFE8D0' }}>12 lokacione në Maqedoni</div>
        </div>
      </div>
    </div>
  )
})

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
  } catch { return null }
}

export default function MarketingDialog({ open, onOpenChange, type, offers }) {
  const activeOffers = useMemo(() => offers?.filter(o => o.active) || [], [offers])
  const [selectedId, setSelectedId] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [postTitle, setPostTitle] = useState('OFERTAT')
  const [generating, setGenerating] = useState(false)
  const storyRef = useRef(null)
  const postRef = useRef(null)

  useEffect(() => {
    if (activeOffers.length && !selectedId) setSelectedId(activeOffers[0].id)
    if (activeOffers.length && selectedIds.size === 0) {
      setSelectedIds(new Set(activeOffers.slice(0, 6).map(o => o.id)))
    }
  }, [activeOffers])

  const selected = activeOffers.find(o => o.id === selectedId) || activeOffers[0]
  const selectedOffers = activeOffers.filter(o => selectedIds.has(o.id))

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const ns = new Set(prev)
      if (ns.has(id)) ns.delete(id)
      else if (ns.size < 6) ns.add(id)
      else { toast.info('Maksimumi 6 produkte për post'); return prev }
      return ns
    })
  }

  const downloadPng = async (ref, filename) => {
    if (!ref.current) return
    setGenerating(true)
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 1, skipFonts: true })
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

      // Beautiful cover
      pdf.setFillColor(239, 123, 34); pdf.rect(0, 0, pageW, pageH, 'F')
      // Diagonal green band
      pdf.setFillColor(32, 163, 58); pdf.rect(0, 100, pageW, 70, 'F')
      // White circle accents
      pdf.setFillColor(255, 255, 255); pdf.setGState(new pdf.GState({ opacity: 0.15 }))
      pdf.circle(180, 30, 35, 'F'); pdf.circle(20, 250, 50, 'F')
      pdf.setGState(new pdf.GState({ opacity: 1 }))
      // Title block
      pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(72); pdf.text('KONSUM', pageW / 2, 65, { align: 'center' })
      pdf.setFontSize(18); pdf.setFont('helvetica', 'normal')
      pdf.text('SUPER MARKET', pageW / 2, 78, { align: 'center' })
      pdf.setFontSize(36); pdf.setFont('helvetica', 'bold')
      pdf.text('OFERTAT JAVORE', pageW / 2, 130, { align: 'center' })
      pdf.setFontSize(14); pdf.setFont('helvetica', 'normal')
      const today = new Date()
      const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      pdf.text(`${today.toLocaleDateString('en-GB')} - ${weekEnd.toLocaleDateString('en-GB')}`, pageW / 2, 152, { align: 'center' })
      pdf.text(`★ ${selectedOffers.length} oferta të zgjedhura ★`, pageW / 2, 162, { align: 'center' })
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(pageW/2 - 50, 200, 100, 50, 5, 5, 'F')
      pdf.setTextColor(239, 123, 34); pdf.setFontSize(22); pdf.setFont('helvetica', 'bold')
      pdf.text('ZBRITJE', pageW/2, 222, { align: 'center' })
      pdf.text('DERI 50%', pageW/2, 240, { align: 'center' })
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(11)
      pdf.text('SUPER MARKET KONSUM · konsum.mk', pageW / 2, 285, { align: 'center' })

      // Pre-load all images
      const imgs = await Promise.all(selectedOffers.map(o => loadImageDataUrl(o.image)))
      const perPage = 6
      const cardW = 87, cardH = 78
      const margin = 13
      const gap = 5

      for (let i = 0; i < selectedOffers.length; i += perPage) {
        pdf.addPage()
        // Header strip
        pdf.setFillColor(239, 123, 34); pdf.rect(0, 0, pageW, 22, 'F')
        pdf.setFillColor(32, 163, 58); pdf.rect(0, 22, pageW, 3, 'F')
        pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16); pdf.text('OFERTAT JAVORE - KONSUM', pageW / 2, 14, { align: 'center' })

        const pageOffers = selectedOffers.slice(i, i + perPage)
        for (let j = 0; j < pageOffers.length; j++) {
          const o = pageOffers[j]
          const imgData = imgs[i + j]
          const col = j % 2, row = Math.floor(j / 2)
          const x = margin + col * (cardW + gap)
          const y = 32 + row * (cardH + gap)

          // Card with rounded corners + shadow effect
          pdf.setFillColor(255, 248, 235)
          pdf.roundedRect(x + 1, y + 1, cardW, cardH, 3, 3, 'F')
          pdf.setFillColor(255, 255, 255)
          pdf.setDrawColor(255, 222, 184)
          pdf.setLineWidth(0.5)
          pdf.roundedRect(x, y, cardW, cardH, 3, 3, 'FD')

          if (imgData) {
            try { pdf.addImage(imgData, 'JPEG', x + 4, y + 4, 38, 38) } catch {}
          }

          // Discount badge with shadow
          pdf.setFillColor(239, 123, 34)
          pdf.roundedRect(x + 4, y + 4, 22, 8, 1, 1, 'F')
          pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10); pdf.text(o.badge || 'OFERTE', x + 15, y + 9.5, { align: 'center' })

          // Product name
          pdf.setTextColor(30, 30, 30); pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          const name = pdf.splitTextToSize(o.name, cardW - 48)
          pdf.text(name.slice(0, 2), x + 46, y + 10)

          // Old price with strikethrough
          pdf.setTextColor(150, 150, 150); pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          const oldP = `${o.oldPrice} MKD`
          pdf.text(oldP, x + 46, y + 28)
          pdf.setDrawColor(239, 123, 34); pdf.setLineWidth(0.4)
          pdf.line(x + 46, y + 27, x + 46 + pdf.getTextWidth(oldP), y + 27)

          // New price (big)
          pdf.setTextColor(239, 123, 34); pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(20); pdf.text(`${o.newPrice}`, x + 46, y + 44)
          pdf.setFontSize(10); pdf.setFont('helvetica', 'normal')
          pdf.text(`MKD/${o.unit}`, x + 46 + pdf.getTextWidth(`${o.newPrice}`) + 2, y + 44)

          // Savings green pill
          const savings = o.oldPrice - o.newPrice
          if (savings > 0) {
            pdf.setFillColor(32, 163, 58)
            pdf.roundedRect(x + 46, y + 50, 38, 9, 1.5, 1.5, 'F')
            pdf.setTextColor(255, 255, 255); pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(9.5); pdf.text(`★ Kurseni ${savings} MKD`, x + 65, y + 56, { align: 'center' })
          }
        }

        // Footer
        pdf.setFillColor(32, 163, 58)
        pdf.rect(0, pageH - 12, pageW, 12, 'F')
        pdf.setTextColor(255, 255, 255); pdf.setFontSize(9); pdf.setFont('helvetica', 'bold')
        pdf.text('★ Vlefshmëria deri të dielen | konsum.mk | 12 lokacione në Maqedoni ★', pageW / 2, pageH - 4, { align: 'center' })
      }

      pdf.save(`konsum-katalog-javor.pdf`)
      toast.success('PDF u shkarkua!')
    } catch (e) {
      console.error(e); toast.error('Dështoi: ' + (e.message || 'gabim'))
    } finally { setGenerating(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#EF7B22]"/>
            {type === 'story' && 'Instagram Story (1080×1920)'}
            {type === 'post' && 'Post Javor (1080×1350)'}
            {type === 'pdf' && 'PDF Katalog Javor'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Preview */}
          <div className="bg-neutral-100 p-4 rounded-xl flex justify-center items-start overflow-hidden">
            {type === 'story' && (
              <div style={{ width: 1080 * 0.32, height: 1920 * 0.32, overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left' }}>
                  <StoryDesign ref={storyRef} offer={selected}/>
                </div>
              </div>
            )}
            {type === 'post' && (
              <div style={{ width: 1080 * 0.5, height: 1350 * 0.5, overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                  <PostDesign ref={postRef} offers={selectedOffers} title={postTitle}/>
                </div>
              </div>
            )}
            {type === 'pdf' && (
              <div className="py-12 text-center">
                <div className="w-40 h-56 mx-auto bg-white border shadow-2xl rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EF7B22] to-[#C45F10]"/>
                  <div className="absolute left-0 right-0 top-[40%] h-12 bg-[#20A33A]"/>
                  <div className="relative h-full flex flex-col items-center justify-center text-white p-3">
                    <div className="text-2xl font-black tracking-wider">KONSUM</div>
                    <div className="text-[8px] mt-0.5 tracking-widest">SUPER MARKET</div>
                    <div className="text-xs mt-6 font-bold">OFERTAT</div>
                    <div className="text-xs font-bold">JAVORE</div>
                    <div className="mt-4 bg-white text-[#EF7B22] text-[10px] font-black px-3 py-1 rounded">-50%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Katalog PDF me <b>{selectedOffers.length}</b> oferta të zgjedhura</p>
                <p className="text-xs text-muted-foreground mt-1">Kopertinë + faqe me 6 produkte · A4 · Profesional</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {type === 'story' && (
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Zgjidh produktin</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border bg-white text-sm">
                  {activeOffers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            )}

            {(type === 'post' || type === 'pdf') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">
                    Zgjidh produktet ({selectedIds.size}{type === 'post' ? '/6' : ''})
                  </label>
                  <button onClick={() => setSelectedIds(new Set(activeOffers.map(o => o.id)))}
                    className="text-xs text-[#EF7B22] font-semibold hover:underline">
                    Të gjitha
                  </button>
                </div>
                <div className="border rounded-lg max-h-[380px] overflow-y-auto bg-white divide-y">
                  {activeOffers.map(o => {
                    const checked = selectedIds.has(o.id)
                    return (
                      <button key={o.id} onClick={() => toggleSelect(o.id)}
                        className={`w-full flex items-center gap-3 p-2 hover:bg-orange-50 text-left transition ${checked ? 'bg-orange-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'bg-[#EF7B22] border-[#EF7B22]' : 'border-neutral-300 bg-white'}`}>
                          {checked && <Check className="h-3 w-3 text-white"/>}
                        </div>
                        <img src={o.image} alt="" className="w-9 h-9 rounded object-cover flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{o.name}</div>
                          <div className="text-xs text-[#EF7B22] font-bold">{o.newPrice} MKD</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {type === 'post' && (
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Titulli (opsional)</label>
                <input value={postTitle} onChange={e => setPostTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border text-sm" placeholder="OFERTAT"/>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-xs text-orange-900 space-y-1">
              <p><b>Madhësia:</b> {type === 'story' ? '1080×1920' : type === 'post' ? '1080×1350' : 'A4'}</p>
              <p><b>Format:</b> {type === 'pdf' ? 'PDF' : 'PNG'}</p>
            </div>

            <Button
              onClick={() => {
                if (type === 'story') downloadPng(storyRef, `konsum-story-${selected?.name?.replace(/\s+/g, '-')}.png`)
                else if (type === 'post') downloadPng(postRef, `konsum-post-javor.png`)
                else downloadPDF()
              }}
              disabled={generating || activeOffers.length === 0 || (type !== 'story' && selectedIds.size === 0)}
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
