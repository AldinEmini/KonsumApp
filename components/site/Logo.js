export default function Logo({ size = 'md', white = false }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  }
  return (
    <div className={`inline-flex items-center gap-1 font-black tracking-tight ${sizes[size]}`}>
      <span className={white ? 'text-white' : 'text-[#E30613]'}>KON</span>
      <span className={`px-1.5 py-0.5 rounded ${white ? 'bg-white text-[#E30613]' : 'bg-[#FFC72C] text-[#E30613]'}`}>SUM</span>
    </div>
  )
}
