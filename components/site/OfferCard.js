import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export default function OfferCard({ offer }) {
  const savings = offer.oldPrice - offer.newPrice
  return (
    <div className="group relative bg-white rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-[#EF7B22] text-white font-bold px-2.5 py-1 text-sm shadow-lg hover:bg-[#EF7B22]">{offer.badge}</Badge>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-[#20A33A] text-white text-xs font-bold px-2 py-1 rounded shadow">OFERTË</span>
      </div>
      <div className="aspect-square overflow-hidden bg-neutral-50">
        <img src={offer.image} alt={offer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2.5rem]">{offer.name}</h3>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground line-through">{offer.oldPrice} MKD</div>
            <div className="text-2xl font-black text-[#EF7B22] leading-tight">
              {offer.newPrice} <span className="text-xs font-normal text-muted-foreground">MKD/{offer.unit}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase">Kurseni</div>
            <div className="text-sm font-bold text-[#20A33A]">{savings} MKD</div>
          </div>
        </div>
        <Button className="w-full bg-neutral-900 hover:bg-[#EF7B22] text-white font-semibold text-xs h-9 transition">
          <ShoppingBag className="h-3.5 w-3.5 mr-1.5"/> Shiko Detajet
        </Button>
      </div>
    </div>
  )
}
