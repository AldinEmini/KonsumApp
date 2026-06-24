import { Badge } from '@/components/ui/badge'

export default function OfferCard({ offer, lang = 'en' }) {
  const name = offer.translations?.[lang]?.name || offer.name
  const unit = offer.translations?.[lang]?.unit || offer.unit
  const savings = offer.oldPrice - offer.newPrice
  return (
    <div className="group relative bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-[#EF7B22] text-white font-bold px-2.5 py-1 text-sm shadow-lg hover:bg-[#EF7B22]">{offer.badge}</Badge>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-[#20A33A] text-white text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wide">
          {lang === 'sq' ? 'Ofertë' : lang === 'mk' ? 'Понуда' : 'Offer'}
        </span>
      </div>
      <div className="aspect-square overflow-hidden bg-neutral-50">
        <img src={offer.image} alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2.5rem]">{name}</h3>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-xs text-muted-foreground line-through">{offer.oldPrice} MKD</div>
            <div className="text-2xl font-black text-[#EF7B22] leading-tight">
              {offer.newPrice} <span className="text-xs font-normal text-muted-foreground">MKD/{unit}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase">
              {lang === 'sq' ? 'Kurseni' : lang === 'mk' ? 'Заштедете' : 'Save'}
            </div>
            <div className="text-sm font-bold text-[#20A33A]">{savings} MKD</div>
          </div>
        </div>
      </div>
    </div>
  )
}
