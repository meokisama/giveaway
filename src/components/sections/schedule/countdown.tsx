'use client'

import { useEffect, useState } from 'react'

const UNITS = ['ngày', 'giờ', 'phút', 'giây']

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
}

/** Một ô số: đổi `key` theo giá trị để mỗi lần nhảy số chạy lại animation rơi xuống. */
function Tile({ value, unit, dimmed }: { value: number; unit: string; dimmed: boolean }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative grid h-[clamp(4.4rem,13vw,11rem)] w-[clamp(3.8rem,11.5vw,9.6rem)] place-items-center overflow-hidden rounded-[clamp(0.8rem,1.6vw,1.6rem)] border-[3px] border-ink bg-ink shadow-hard ${
          dimmed ? 'text-white/35' : 'text-sun'
        }`}
      >
        <span key={text} className="animate-digit font-display text-[clamp(2rem,6.6vw,5.8rem)] leading-none font-black tabular-nums">
          {text}
        </span>
        <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-paper/15" aria-hidden="true" />
      </div>
      <span className="font-mono text-[0.7rem] font-bold tracking-[0.25em] uppercase">{unit}</span>
    </div>
  )
}

type Props = {
  /** thời điểm đích (ISO) */
  target: string
  onEndedChange?: (ended: boolean) => void
}

/** Bộ đếm ngược. Chỉ bắt đầu tính sau khi mount để tránh lệch giờ giữa server và client. */
export function Countdown({ target, onEndedChange }: Props) {
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    const end = new Date(target).getTime()
    const update = () => setLeft(end - Date.now())
    update()
    if (end - Date.now() <= 0) return
    const id = window.setInterval(update, 1000)
    return () => clearInterval(id)
  }, [target])

  const ended = left !== null && left <= 0
  useEffect(() => {
    if (left !== null) onEndedChange?.(ended)
  }, [ended, left, onEndedChange])

  const parts = split(left ?? 0)

  return (
    <div
      role="timer"
      aria-label={ended ? 'Sự kiện đã diễn ra' : `Còn ${parts[0]} ngày ${parts[1]} giờ ${parts[2]} phút ${parts[3]} giây`}
      className="flex items-start justify-center gap-[clamp(0.5rem,2vw,1.8rem)]"
    >
      {parts.map((v, i) => (
        <Tile key={UNITS[i]} value={v} unit={UNITS[i]} dimmed={ended} />
      ))}
    </div>
  )
}
