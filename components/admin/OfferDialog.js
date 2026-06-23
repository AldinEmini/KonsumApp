'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const CATS = [
  { slug: 'mish-peshk', name: 'Mish & Peshk' },
  { slug: 'qumeshtore', name: 'Qumështore' },
  { slug: 'buke-pasterici', name: 'Bukë & Pastiçeri' },
  { slug: 'pije', name: 'Pije' },
  { slug: 'embelsira', name: 'Ëmbëlsira & Biskota' },
  { slug: 'kafe-caj', name: 'Kafe & Çaj' },
  { slug: 'pastrim-higjene', name: 'Pastrim & Higjenë' },
  { slug: 'te-tjera', name: 'Të tjera' },
]

export default function OfferDialog({ open, onOpenChange, offer, onSaved }) {
  const [form, setForm] = useState(() => offer || {
    name: '', category: 'mish-peshk', image: '', oldPrice: '', newPrice: '', unit: 'copë', badge: '', active: true,
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.name || !form.newPrice) {
      toast.error('Emri dhe çmimi i ri janë të detyrueshme')
      return
    }
    setSaving(true)
    try {
      const isEdit = !!offer?.id
      const url = isEdit ? `/api/offers/${offer.id}` : '/api/offers'
      const method = isEdit ? 'PUT' : 'POST'
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error('Gabim në ruajtje')
      const d = await r.json()
      toast.success(isEdit ? 'Oferta u përditësua' : 'Oferta u shtua')
      onSaved?.(d.offer)
      onOpenChange(false)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer?.id ? 'Edito ofertën' : 'Shto ofertë të re'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className="font-semibold">Emri i produktit *</Label>
              <Input value={form.name} onChange={e=>handleChange('name', e.target.value)} placeholder="P.sh. Coca-Cola 2L"/>
            </div>
            <div>
              <Label className="font-semibold">Kategoria</Label>
              <select value={form.category} onChange={e=>handleChange('category', e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-white text-sm">
                {CATS.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label className="font-semibold">Njesia</Label>
              <select value={form.unit} onChange={e=>handleChange('unit', e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-white text-sm">
                <option value="copë">copë</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">litra</option>
                <option value="pako">pako</option>
              </select>
            </div>
            <div>
              <Label className="font-semibold">Çmimi i vërtetë (MKD)</Label>
              <Input type="number" value={form.oldPrice} onChange={e=>handleChange('oldPrice', e.target.value)} placeholder="599"/>
            </div>
            <div>
              <Label className="font-semibold">Çmimi me zbritje (MKD) *</Label>
              <Input type="number" value={form.newPrice} onChange={e=>handleChange('newPrice', e.target.value)} placeholder="399"/>
            </div>
            <div className="sm:col-span-2">
              <Label className="font-semibold">URL e imazhit</Label>
              <Input value={form.image} onChange={e=>handleChange('image', e.target.value)} placeholder="https://..."/>
              {form.image && (
                <img src={form.image} alt="" className="mt-2 h-32 w-32 object-cover rounded-lg border"/>
              )}
            </div>
            <div>
              <Label className="font-semibold">Badge (opsional)</Label>
              <Input value={form.badge} onChange={e=>handleChange('badge', e.target.value)} placeholder="-33% (auto)"/>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.active} onCheckedChange={v=>handleChange('active', v)} id="active"/>
              <Label htmlFor="active" className="font-semibold cursor-pointer">Aktive</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={()=>onOpenChange(false)} disabled={saving}>Anulo</Button>
          <Button onClick={save} disabled={saving} className="bg-[#EF7B22] hover:bg-[#C45F10]">
            {saving ? 'Duke ruajtur...' : (offer?.id ? 'Përditëso' : 'Shto')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
