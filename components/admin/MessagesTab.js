'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MailOpen, Trash2, Loader2, Phone, Calendar, X, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function MessagesTab({ onUnreadChange }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const refresh = async () => {
    setLoading(true)
    const r = await fetch('/api/messages').then(r => r.json())
    setMessages(r.messages || [])
    onUnreadChange?.(r.unread || 0)
    setLoading(false)
  }
  useEffect(() => { refresh() }, [])

  const markRead = async (id, read = true) => {
    await fetch(`/api/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read }) })
    refresh()
  }

  const del = async (id) => {
    if (!confirm('Të fshihet ky mesazh?')) return
    const r = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    if (r.ok) { toast.success('U fshi'); setSelected(null); refresh() }
  }

  const view = async (m) => {
    setSelected(m)
    if (!m.read) await markRead(m.id, true)
  }

  const filtered = messages.filter(m => filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read))
  const unreadCount = messages.filter(m => !m.read).length

  const formatDate = (d) => {
    const dt = new Date(d)
    return dt.toLocaleDateString('en-GB') + ' ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Mesazhet nga Klientët</h1>
          <p className="text-muted-foreground mt-1">{messages.length} mesazhe gjithsej • <b className="text-[#EF7B22]">{unreadCount} të palexuara</b></p>
        </div>
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold ${filter === f ? 'bg-[#EF7B22] text-white' : 'bg-white border hover:bg-neutral-50'}`}>
              {f === 'all' && `Të gjitha (${messages.length})`}
              {f === 'unread' && `Të palexuara (${unreadCount})`}
              {f === 'read' && `Të lexuara (${messages.length - unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader2 className="h-6 w-6 animate-spin"/> : (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          {/* List */}
          <div className="bg-white rounded-2xl border max-h-[70vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50"/>
                <p>Nuk ka mesazhe.</p>
              </div>
            ) : (
              filtered.map(m => (
                <button key={m.id} onClick={() => view(m)}
                  className={`w-full text-left p-4 border-b transition hover:bg-orange-50/50 ${selected?.id === m.id ? 'bg-orange-50' : ''} ${!m.read ? 'bg-orange-50/30' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!m.read ? 'bg-[#EF7B22] text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                      {!m.read ? <Mail className="h-4 w-4"/> : <MailOpen className="h-4 w-4"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-${!m.read ? 'black' : 'semibold'} truncate`}>{m.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{formatDate(m.createdAt)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate mb-1">{m.email}</div>
                      <div className="text-sm text-neutral-700 line-clamp-2">{m.message}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="bg-white rounded-2xl border p-6 max-h-[70vh] overflow-y-auto">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground">{formatDate(selected.createdAt)}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-neutral-100"><X className="h-5 w-5"/></button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-50 rounded-lg text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">Email</div>
                    <a href={`mailto:${selected.email}`} className="font-semibold text-[#EF7B22] hover:underline">{selected.email}</a>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">Telefoni</div>
                    {selected.phone
                      ? <a href={`tel:${selected.phone}`} className="font-semibold text-[#EF7B22] hover:underline">{selected.phone}</a>
                      : <span className="text-muted-foreground">-</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mb-2">Mesazhi</div>
                  <div className="bg-orange-50/50 border border-orange-200 p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">{selected.message}</div>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button asChild className="bg-[#EF7B22] hover:bg-[#C45F10]">
                    <a href={`mailto:${selected.email}?subject=Re: Mesazhi juaj për Konsum`}><Mail className="h-4 w-4 mr-1.5"/> Përgjigju me Email</a>
                  </Button>
                  <Button variant="outline" onClick={() => markRead(selected.id, !selected.read)}>
                    {selected.read ? <Mail className="h-4 w-4 mr-1.5"/> : <MailOpen className="h-4 w-4 mr-1.5"/>}
                    {selected.read ? 'Shëno si të palexuar' : 'Shëno si të lexuar'}
                  </Button>
                  <Button variant="outline" onClick={() => del(selected.id)} className="text-red-600 hover:bg-red-50 ml-auto">
                    <Trash2 className="h-4 w-4 mr-1.5"/> Fshi
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                <Eye className="h-12 w-12 mb-3 opacity-50"/>
                <p>Zgjidh një mesazh për ta lexuar</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
