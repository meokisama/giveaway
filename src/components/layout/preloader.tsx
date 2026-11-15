'use client'

import { useEffect, useRef, useState } from 'react'
import { appReady } from '@/lib/app-ready'

const MIN_MS = 1400

/** Màn chờ: gói thẻ rung lắc + thanh nạp, rồi mở ra bằng một vòng tròn thu nhỏ. */
export function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading')
  const num = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let leaveTimer = 0
    let fontsReady = false
    const start = performance.now()
    document.fonts.ready.then(() => (fontsReady = true))
    const failSafe = window.setTimeout(() => (fontsReady = true), 4000)

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_MS)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = fontsReady ? eased : Math.min(eased, 0.9)
      if (num.current) num.current.textContent = String(Math.round(v * 100)).padStart(3, '0')
      if (bar.current) bar.current.style.transform = `scaleX(${v})`
      if (v >= 1) {
        setPhase('leaving')
        appReady.mark()
        leaveTimer = window.setTimeout(() => setPhase('gone'), 1100)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failSafe)
      clearTimeout(leaveTimer)
    }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-sun bg-dots transition-[clip-path] duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === 'leaving' ? 'pointer-events-none [clip-path:circle(0%_at_50%_50%)]' : '[clip-path:circle(150%_at_50%_50%)]'
      }`}
    >
      <div className="relative grid h-40 w-28 animate-shake place-items-center rounded-lg border-[3px] border-ink bg-linear-to-br from-aqua via-grape to-bubble shadow-hard">
        <span className="absolute inset-x-0 top-0 h-4 border-b-2 border-dashed border-ink/60 bg-ink/15" />
        <span className="-rotate-6 font-display text-3xl font-black text-white text-stroke-thin">RGB</span>
      </div>
      <p className="font-display text-sm font-extrabold tracking-wide uppercase tabular-nums">
        Đang nạp gói thẻ <span ref={num}>000</span>%
      </p>
      <span className="block h-4 w-[min(18rem,70vw)] overflow-hidden rounded-full border-[3px] border-ink bg-white shadow-hard-sm">
        <span
          ref={bar}
          className="block h-full origin-left scale-x-0 bg-[repeating-linear-gradient(-45deg,var(--color-bubble)_0_10px,var(--color-grape)_10px_20px)]"
        />
      </span>
    </div>
  )
}
