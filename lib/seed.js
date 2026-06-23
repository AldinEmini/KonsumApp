import { getDb } from './db'
import { hashPassword } from './auth'
import { v4 as uuid } from 'uuid'

let seeded = false

export async function ensureSeeded() {
  if (seeded) return
  const db = await getDb()

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || 'aldin@konsum.mk'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Aldin2008'
  const existingAdmin = await db.collection('users').findOne({ email: adminEmail })
  if (!existingAdmin) {
    await db.collection('users').insertOne({
      id: uuid(),
      email: adminEmail,
      name: 'Admin Konsum',
      role: 'admin',
      passwordHash: await hashPassword(adminPassword),
      createdAt: new Date(),
    })
  }

  // Seed offers if none
  const offerCount = await db.collection('offers').countDocuments()
  if (offerCount === 0) {
    const seedOffers = [
      { name: 'Mish Viçi i Freskët', category: 'mish-peshk', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&q=80', oldPrice: 599, newPrice: 399, unit: 'kg', badge: '-33%', active: true },
      { name: 'Sallam Çajni 500g', category: 'mish-peshk', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80', oldPrice: 220, newPrice: 149, unit: 'copë', badge: '-32%', active: true },
      { name: 'Qumësht i Plotë 1L', category: 'qumeshtore', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', oldPrice: 75, newPrice: 59, unit: 'copë', badge: '-21%', active: true },
      { name: 'Djathë i Bardhë 500g', category: 'qumeshtore', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80', oldPrice: 299, newPrice: 199, unit: 'copë', badge: '-33%', active: true },
      { name: 'Bukë e Bardhë 500g', category: 'buke-pasterici', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', oldPrice: 45, newPrice: 29, unit: 'copë', badge: '-35%', active: true },
      { name: 'Coca-Cola 2L', category: 'pije', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80', oldPrice: 149, newPrice: 99, unit: 'copë', badge: '-34%', active: true },
      { name: 'Ujë Mineral 1.5L', category: 'pije', image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&q=80', oldPrice: 35, newPrice: 25, unit: 'copë', badge: '-29%', active: true },
      { name: 'Çokollatë Milka 100g', category: 'embelsira', image: 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?w=600&q=80', oldPrice: 99, newPrice: 69, unit: 'copë', badge: '-30%', active: true },
      { name: 'Biskota Plazma 300g', category: 'embelsira', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80', oldPrice: 120, newPrice: 89, unit: 'copë', badge: '-26%', active: true },
      { name: 'Kafe Nescafé 200g', category: 'kafe-caj', image: 'https://images.unsplash.com/photo-1559525839-d9acfd1ea1ea?w=600&q=80', oldPrice: 449, newPrice: 329, unit: 'copë', badge: '-27%', active: true },
      { name: 'Detergjent Ariel 3L', category: 'pastrim-higjene', image: 'https://images.unsplash.com/photo-1583947581924-860bda3c4f31?w=600&q=80', oldPrice: 599, newPrice: 399, unit: 'copë', badge: '-33%', active: true },
      { name: 'Letër Higjenike 8/1', category: 'pastrim-higjene', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&q=80', oldPrice: 249, newPrice: 179, unit: 'copë', badge: '-28%', active: true },
    ]
    const now = new Date()
    await db.collection('offers').insertMany(
      seedOffers.map((o, i) => ({ ...o, id: uuid(), order: i, createdAt: now, updatedAt: now }))
    )
  }

  // Seed locations
  const locCount = await db.collection('locations').countDocuments()
  if (locCount === 0) {
    const locs = [
      { name: 'Konsum Qendër', address: 'Bul. Partizanski Odredi 12, 1000 Shkup', phone: '+389 2 312 3456', hours: 'E Hënë - E Diel: 07:00 - 22:00' },
      { name: 'Konsum Çair', address: 'Rr. Çair 45, 1000 Shkup', phone: '+389 2 322 4567', hours: 'E Hënë - E Diel: 07:00 - 23:00' },
      { name: 'Konsum Tetovë', address: 'Bul. Ilinden 78, 1200 Tetovë', phone: '+389 44 333 678', hours: 'E Hënë - E Shtunë: 07:00 - 22:00, E Diel: 08:00 - 20:00' },
      { name: 'Konsum Gostivar', address: 'Rr. Beliçica 23, 1230 Gostivar', phone: '+389 42 444 789', hours: 'E Hënë - E Diel: 07:30 - 21:30' },
    ]
    await db.collection('locations').insertMany(locs.map((l, i) => ({ ...l, id: uuid(), order: i })))
  }

  // Seed singleton content document
  const content = await db.collection('content').findOne({ id: 'site' })
  if (!content) {
    await db.collection('content').insertOne({
      id: 'site',
      site: {
        brand: 'KONSUM',
        tagline: 'Çdo ditë, çmime të mira',
        phone: '+389 2 312 3456',
        email: 'info@konsum.mk',
        address: 'Bul. Partizanski Odredi 12, 1000 Shkup, Maqedoni',
        hours: 'E Hënë - E Diel: 07:00 - 22:00',
        social: {
          facebook: 'https://facebook.com/konsum',
          instagram: 'https://instagram.com/konsum',
          youtube: 'https://youtube.com/konsum',
          tiktok: 'https://tiktok.com/@konsum',
        },
      },
      hero_slides: [
        { title: 'Ofertat Javore', subtitle: 'Zbritje deri në 50% në qindra produkte', cta: 'Shiko Ofertat', href: '/oferta', image: 'https://images.pexels.com/photos/3985077/pexels-photo-3985077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', badge: 'E RE' },
        { title: 'Familja jonë, Familja juaj', subtitle: 'Bleni më shumë, kurseni më shumë çdo ditë', cta: 'Shiko Produktet', href: '/oferta', image: 'https://images.unsplash.com/photo-1661193302766-300b3713aabd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxncm9jZXJ5fGVufDB8fHxyZWR8MTc4MjE3Nzg1MXww&ixlib=rb-4.1.0&q=85', badge: 'KONSUM' },
        { title: 'Cilësi që e besoni', subtitle: 'Mish, qumësht, bukë dhe gjithçka për shtëpinë tuaj', cta: 'Mëso më shumë', href: '/rreth-nesh', image: 'https://images.pexels.com/photos/5498233/pexels-photo-5498233.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', badge: 'PROMO' },
      ],
      about: {
        hero_title: 'Rreth Konsum',
        hero_subtitle: 'Tregtari juaj i besueshëm që nga viti 1991',
        history: 'Konsum filloi rrugëtimin e tij në vitin 1991 si një shitore e vogël familjare. Sot, ne jemi një nga rrjetet më të njohura të shitoreve në Maqedoni, me dhjetëra lokacione dhe mijëra klientë të kënaqur çdo ditë. Misioni ynë mbetet i njëjtë: të ofrojmë produkte cilësore me çmime të arsyeshme për çdo familje.',
        mission: 'Të jemi zgjedhja e parë e familjeve maqedonase për blerjet ditore, duke ofruar produkte cilësore dhe me çmime konkurruese.',
        vision: 'Të bëhemi rrjeti më i besueshëm i shitoreve në rajon, i njohur për cilësinë, shërbimin dhe ofertat e mrekullueshme.',
        values: [
          { title: 'Cilësia', desc: 'Vetëm produktet më të mira për familjen tuaj.' },
          { title: 'Besueshmëria', desc: 'Mijëra klientë na besojnë çdo ditë.' },
          { title: 'Çmimi i drejtë', desc: 'Çmime të arsyeshme dhe oferta të vërteta.' },
          { title: 'Shërbimi', desc: 'Stafi ynë i përkushtuar është gjithmonë në shërbimin tuaj.' },
        ],
        policies: [
          { title: 'Politika e Kthimit', desc: 'Mund të ktheni produktet brenda 14 ditësh me kushtin që të jenë në gjendje origjinale dhe me faturë.' },
          { title: 'Garanci Cilësie', desc: 'Të gjitha produktet tona janë të garantuara në afatin e tyre dhe me cilësi të lartë.' },
          { title: 'Privatësia', desc: 'Të dhënat tuaja personale janë të mbrojtura sipas ligjeve maqedonase dhe direktivave të BE-së.' },
        ],
        delivery: 'Konsum ofron dërgesë në shtëpi për porositë mbi 1000 MKD brenda zonës urbane të Shkupit. Dërgesa kryhet brenda 2 orësh nga konfirmimi i porosisë.',
      },
      footer_copyright: '© ' + new Date().getFullYear() + ' Konsum Super Market. Të gjitha të drejtat e rezervuara.',
      updatedAt: new Date(),
    })
  }

  seeded = true
}
