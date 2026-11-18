'use client'

import { useRef, useState, type PointerEvent } from 'react'
import type { StaticImageData } from 'next/image'

const REACH = 3 // số lá hiện ra mỗi bên

/** Quạt ảnh: lá giữa là lá đang xem, kéo ngang hoặc bấm nút để xoay quạt. */
export function CardFan({ photos, label }: { photos: StaticImageData[]; label: string }) {
  const n = photos.length
  const [active, setActive] = useState(0)
  const dragX = useRef<number | null>(null)

  const go = (d: number) => setActive((a) => (a + d + n) % n)

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragX.current === null) return
    const dx = e.clientX - dragX.current
    if (Math.abs(dx) > 56) {
      go(dx < 0 ? 1 : -1)
      dragX.current = e.clientX
    }
  }
  const onUp = () => {
    dragX.current = null
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative aspect-[467/675] w-[min(19rem,52vw)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="group"
        aria-label={label}
      >
        {photos.map((photo, i) => {
          // độ lệch vòng tròn so với lá đang xem: -n/2 … n/2
          const o = ((i - active + n + Math.floor(n / 2)) % n) - Math.floor(n / 2)
          const dist = Math.abs(o)
          if (dist > REACH + 1) return null
          const hidden = dist > REACH
          return (
            <div
              key={i}
              className="absolute inset-0 origin-[50%_130%] overflow-hidden rounded-[1.1rem] border-[3px] border-ink bg-white p-1.5 shadow-hard transition-[transform,opacity,filter] duration-500 ease-pop"
              style={{
                transform: `rotate(${o * 9}deg) translateY(${dist * 2}%) scale(${1 - dist * 0.05})`,
                zIndex: 20 - dist,
                opacity: hidden ? 0 : 1,
                filter: dist ? `brightness(${1 - dist * 0.14})` : 'none',
              }}
              aria-hidden={o !== 0}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={`${label}, ảnh ${i + 1}`}
                draggable={false}
                loading="lazy"
                className="pointer-events-none h-full w-full rounded-[0.7rem] object-cover"
              />
              {o === 0 && <span className="holo-shine holo-idle" aria-hidden="true" />}
            </div>
          )
        })}
      </div>

      <div className="relative z-30 mt-[clamp(4.5rem,9vw,8rem)] flex items-center gap-5 font-mono text-sm font-bold tracking-widest">
        <FanButton onClick={() => go(-1)} label="Ảnh trước">
          ←
        </FanButton>
        <span className="tabular-nums">
          <span className="text-sun">{String(active + 1).padStart(2, '0')}</span> / {n}
        </span>
        <FanButton onClick={() => go(1)} label="Ảnh kế tiếp">
          →
        </FanButton>
      </div>
    </div>
  )
}

function FanButton({ onClick, label, children }: { onClick: () => void; label: string; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-ink bg-sun text-lg text-ink shadow-hard-sm transition-[translate,box-shadow] duration-200 ease-pop hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      {children}
    </button>
  )
}
