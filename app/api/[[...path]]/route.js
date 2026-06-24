import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { verifyPassword, createSession, getSession, SESSION_COOKIE } from '@/lib/auth'
import { ensureSeeded } from '@/lib/seed'
import { translateObject } from '@/lib/translator'
import { v4 as uuid } from 'uuid'

async function readBody(request) {
  try { return await request.json() } catch { return {} }
}

async function requireAuth(request) {
  const session = await getSession(request)
  if (!session) return null
  return session
}

function notFound() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
function badRequest(msg) {
  return NextResponse.json({ error: msg || 'Bad request' }, { status: 400 })
}

async function handler(request, { params }) {
  await ensureSeeded()
  const resolved = await params
  const pathArr = resolved?.path || []
  const path = pathArr.join('/')
  const method = request.method
  const db = await getDb()

  // Health
  if (path === '' || path === 'health') {
    return NextResponse.json({ status: 'ok', service: 'konsum-api', time: new Date().toISOString() })
  }

  // ===== AUTH =====
  if (path === 'auth/login' && method === 'POST') {
    const { email, password } = await readBody(request)
    if (!email || !password) return badRequest('Email dhe fjalëkalimi janë të detyrueshme')
    const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() })
    if (!user) return NextResponse.json({ error: 'Kredencialet janë të pasakta' }, { status: 401 })
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Kredencialet janë të pasakta' }, { status: 401 })
    const token = await createSession({ userId: user.id, email: user.email, role: user.role, name: user.name })
    const res = NextResponse.json({ user: { email: user.email, name: user.name, role: user.role } })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  }

  if (path === 'auth/logout' && method === 'POST') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
    return res
  }

  if (path === 'auth/me' && method === 'GET') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    return NextResponse.json({ user: { email: session.email, name: session.name, role: session.role } })
  }

  // ===== OFFERS =====
  if (path === 'offers' && method === 'GET') {
    const url = new URL(request.url)
    const onlyActive = url.searchParams.get('active') !== 'false'
    const q = { ...(onlyActive ? { active: true } : {}) }
    const offers = await db.collection('offers').find(q).sort({ order: 1, createdAt: -1 }).toArray()
    return NextResponse.json({ offers: offers.map(({ _id, ...o }) => o) })
  }

  if (path === 'offers' && method === 'POST') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const body = await readBody(request)
    if (!body.name || !body.newPrice) return badRequest('Emri dhe çmimi i ri janë të detyrueshme')
    const sourceLang = body.source_lang || 'sq'
    let translations = body.translations
    if (!translations) {
      try { translations = await translateObject({ name: body.name, unit: body.unit || 'copë' }, ['name', 'unit'], sourceLang) }
      catch { translations = { [sourceLang]: { name: body.name, unit: body.unit || 'copë' } } }
    }
    const offer = {
      id: uuid(),
      name: body.name,
      category: body.category || 'te-gjitha',
      image: body.image || '',
      oldPrice: Number(body.oldPrice) || 0,
      newPrice: Number(body.newPrice),
      unit: body.unit || 'copë',
      badge: body.badge || (body.oldPrice ? `-${Math.round(((body.oldPrice - body.newPrice) / body.oldPrice) * 100)}%` : 'OFERTË'),
      active: body.active !== false,
      order: body.order || 0,
      translations,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.collection('offers').insertOne(offer)
    const { _id, ...rest } = offer
    return NextResponse.json({ offer: rest })
  }

  if (path.startsWith('offers/') && method === 'GET') {
    const id = path.split('/')[1]
    const offer = await db.collection('offers').findOne({ id })
    if (!offer) return notFound()
    const { _id, ...rest } = offer
    return NextResponse.json({ offer: rest })
  }

  if (path.startsWith('offers/') && (method === 'PUT' || method === 'PATCH')) {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    const body = await readBody(request)
    const update = { ...body, updatedAt: new Date() }
    delete update.id
    delete update._id
    if (update.oldPrice !== undefined) update.oldPrice = Number(update.oldPrice)
    if (update.newPrice !== undefined) update.newPrice = Number(update.newPrice)
    if (update.oldPrice && update.newPrice && !body.badge) {
      update.badge = `-${Math.round(((update.oldPrice - update.newPrice) / update.oldPrice) * 100)}%`
    }
    // Re-translate if name or unit changed
    if ((update.name || update.unit) && !update.translations) {
      try {
        const existing = await db.collection('offers').findOne({ id })
        const merged = { name: update.name || existing?.name, unit: update.unit || existing?.unit || 'copë' }
        update.translations = await translateObject(merged, ['name', 'unit'], body.source_lang || 'sq')
      } catch {}
    }
    delete update.source_lang
    const r = await db.collection('offers').findOneAndUpdate(
      { id },
      { $set: update },
      { returnDocument: 'after' }
    )
    if (!r) return notFound()
    const { _id, ...rest } = r
    return NextResponse.json({ offer: rest })
  }

  if (path.startsWith('offers/') && method === 'DELETE') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    await db.collection('offers').deleteOne({ id })
    return NextResponse.json({ ok: true })
  }

  // ===== CONTENT (singleton site config) =====
  if (path === 'content' && method === 'GET') {
    const doc = await db.collection('content').findOne({ id: 'site' })
    if (!doc) return NextResponse.json({ content: null })
    const { _id, ...rest } = doc
    return NextResponse.json({ content: rest })
  }

  if (path === 'content' && method === 'PUT') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const body = await readBody(request)
    const update = { ...body, updatedAt: new Date() }
    delete update._id
    await db.collection('content').updateOne({ id: 'site' }, { $set: update }, { upsert: true })
    const doc = await db.collection('content').findOne({ id: 'site' })
    const { _id, ...rest } = doc
    return NextResponse.json({ content: rest })
  }

  // ===== LOCATIONS =====
  if (path === 'locations' && method === 'GET') {
    const locs = await db.collection('locations').find({}).sort({ order: 1 }).toArray()
    return NextResponse.json({ locations: locs.map(({ _id, ...l }) => l) })
  }

  if (path === 'locations' && method === 'POST') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const body = await readBody(request)
    if (!body.name || !body.address) return badRequest('Emri dhe adresa janë të detyrueshme')
    const loc = {
      id: uuid(),
      name: body.name,
      address: body.address,
      phone: body.phone || '',
      hours: body.hours || '',
      order: body.order || 0,
    }
    await db.collection('locations').insertOne(loc)
    const { _id, ...rest } = loc
    return NextResponse.json({ location: rest })
  }

  if (path.startsWith('locations/') && (method === 'PUT' || method === 'PATCH')) {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    const body = await readBody(request)
    const update = { ...body }
    delete update.id
    delete update._id
    const r = await db.collection('locations').findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
    if (!r) return notFound()
    const { _id, ...rest } = r
    return NextResponse.json({ location: rest })
  }

  if (path.startsWith('locations/') && method === 'DELETE') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    await db.collection('locations').deleteOne({ id })
    return NextResponse.json({ ok: true })
  }

  // ===== TRANSLATE-ALL: backfill translations for existing data =====
  if (path === 'translate-all' && method === 'POST') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const sourceLang = 'sq'
    let translatedOffers = 0
    let translatedSlides = 0
    const offers = await db.collection('offers').find({}).toArray()
    for (const o of offers) {
      try {
        const tr = await translateObject({ name: o.name, unit: o.unit || 'copë' }, ['name', 'unit'], sourceLang)
        await db.collection('offers').updateOne({ id: o.id }, { $set: { translations: tr } })
        translatedOffers++
      } catch (e) { console.error('Translate offer error:', e.message) }
    }
    // Content: hero_slides + about
    const doc = await db.collection('content').findOne({ id: 'site' })
    if (doc) {
      const slides = doc.hero_slides || []
      const updatedSlides = []
      for (const s of slides) {
        try {
          const tr = await translateObject(
            { title: s.title, subtitle: s.subtitle, cta: s.cta, badge: s.badge },
            ['title', 'subtitle', 'cta', 'badge'],
            sourceLang
          )
          updatedSlides.push({ ...s, translations: tr })
          translatedSlides++
        } catch { updatedSlides.push(s) }
      }
      // About
      let aboutTr = null
      if (doc.about) {
        try {
          aboutTr = await translateObject(
            { hero_title: doc.about.hero_title, hero_subtitle: doc.about.hero_subtitle, history: doc.about.history, mission: doc.about.mission, vision: doc.about.vision },
            ['hero_title', 'hero_subtitle', 'history', 'mission', 'vision'],
            sourceLang
          )
        } catch {}
      }
      await db.collection('content').updateOne({ id: 'site' }, {
        $set: { hero_slides: updatedSlides, ...(aboutTr ? { 'about.translations': aboutTr } : {}) }
      })
    }
    return NextResponse.json({ ok: true, translatedOffers, translatedSlides })
  }

  // ===== MESSAGES (contact form) =====
  if (path === 'messages' && method === 'POST') {
    const body = await readBody(request)
    if (!body.name || !body.email || !body.message) return badRequest('Name, email and message are required')
    const msg = {
      id: uuid(),
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      message: body.message,
      read: false,
      createdAt: new Date(),
    }
    await db.collection('messages').insertOne(msg)
    const { _id, ...rest } = msg
    return NextResponse.json({ message: rest })
  }

  if (path === 'messages' && method === 'GET') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const msgs = await db.collection('messages').find({}).sort({ createdAt: -1 }).toArray()
    const unread = await db.collection('messages').countDocuments({ read: false })
    return NextResponse.json({ messages: msgs.map(({ _id, ...m }) => m), unread })
  }

  if (path.startsWith('messages/') && (method === 'PUT' || method === 'PATCH')) {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    const body = await readBody(request)
    const update = { ...body }
    delete update.id
    delete update._id
    const r = await db.collection('messages').findOneAndUpdate({ id }, { $set: update }, { returnDocument: 'after' })
    if (!r) return notFound()
    const { _id, ...rest } = r
    return NextResponse.json({ message: rest })
  }

  if (path.startsWith('messages/') && method === 'DELETE') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const id = path.split('/')[1]
    await db.collection('messages').deleteOne({ id })
    return NextResponse.json({ ok: true })
  }

  // ===== STATS =====
  if (path === 'stats' && method === 'GET') {
    const session = await requireAuth(request)
    if (!session) return unauthorized()
    const [active_offers, total_products, total_locations, unread_messages] = await Promise.all([
      db.collection('offers').countDocuments({ active: true }),
      db.collection('offers').countDocuments(),
      db.collection('locations').countDocuments(),
      db.collection('messages').countDocuments({ read: false }),
    ])
    return NextResponse.json({
      stats: {
        active_offers,
        total_products,
        total_locations,
        unread_messages,
        weekly_visits: 12450,
        conversion_rate: 4.2,
      }
    })
  }

  return notFound()
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
