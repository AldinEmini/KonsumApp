import { LOGO } from '@/lib/mockData'

export default function Logo({ size = 'md', variant = 'mascot', className = '' }) {
  const sizes = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-20',
    xl: 'h-32',
  }
  const src = variant === 'full' ? LOGO.full : LOGO.mascot
  return (
    <img
      src={src}
      alt="Konsum Super Market"
      className={`${sizes[size]} w-auto object-contain ${className}`}
      draggable={false}
    />
  )
}
