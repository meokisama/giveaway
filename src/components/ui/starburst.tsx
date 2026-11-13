import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  points?: number
  /** tỉ lệ bán kính trong / ngoài */
  depth?: number
  /** class định vị + kích thước (đặt width, chiều cao tự theo tỉ lệ 1:1) */
  className?: string
  fill?: string
}

/** Huy hiệu hình nổ kiểu truyện tranh (SVG), nội dung đặt ở giữa. */
export function Starburst({ children, points = 14, depth = 0.74, className = '', fill = 'var(--color-sun)' }: Props) {
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? 46 * depth : 46
    const a = (Math.PI * i) / points - Math.PI / 2
    pts.push(`${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`)
  }
  return (
    // lớp ngoài chỉ nhận class của nơi dùng (absolute/relative…), lớp trong lo bố cục
    <div className={className}>
      <div className="relative grid aspect-square w-full place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <polygon points={pts.join(' ')} fill="var(--color-ink)" transform="translate(3 3.5)" />
          <polygon points={pts.join(' ')} fill={fill} stroke="var(--color-ink)" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <div className="relative text-center">{children}</div>
      </div>
    </div>
  )
}
