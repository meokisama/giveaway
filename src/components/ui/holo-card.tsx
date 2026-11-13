'use client'

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** class cho chính tấm thẻ (bo góc, viền, nền…) */
  className?: string
  /** class cho lớp bọc ngoài (giữ phối cảnh 3D) */
  wrapperClassName?: string
  /** góc nghiêng tối đa (độ) */
  tilt?: number
  style?: CSSProperties
}

/**
 * Thẻ hologram: nghiêng 3D theo con trỏ, lớp ánh kim cầu vồng trượt theo vị trí chuột,
 * kèm vệt sáng. Khi không ai chạm, lớp ánh kim tự trôi (holo-idle) nên vẫn lấp lánh trên di động.
 */
export function HoloCard({ children, className = '', wrapperClassName = '', tilt = 12, style }: Props) {
  const card = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--ry', `${(x - 0.5) * tilt}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * tilt}deg`)
    if (!active) setActive(true)
  }
  const onLeave = () => {
    const el = card.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    setActive(false)
  }

  return (
    <div className={`[perspective:1100px] ${wrapperClassName}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={card}
        className={`holo-tilt relative ${className}`}
        style={{ ...style, '--on': active ? 1 : 0 } as CSSProperties}
      >
        {children}
        <span className={`holo-shine ${active ? '' : 'holo-idle'}`} aria-hidden="true" />
        <span className="holo-glare" aria-hidden="true" />
      </div>
    </div>
  )
}
