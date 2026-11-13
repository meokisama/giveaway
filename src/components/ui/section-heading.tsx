'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { SplitText } from './split-text'

type Props = {
  index: string
  /** chữ Nhật trang trí */
  kicker: string
  title: string
  /** phần tiêu đề được đóng khung như một nhãn dán */
  highlight: string
  description: string
  /** màu nền của nhãn dán */
  highlightClassName?: string
  /** chữ sáng trên nền tối */
  inverted?: boolean
}

/** Tiêu đề chương: từng chữ nảy lên, phần highlight "dập" xuống như dán sticker. */
export function SectionHeading({
  index,
  kicker,
  title,
  highlight,
  description,
  highlightClassName = 'bg-sun',
  inverted = false,
}: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 82%', once: true } })
      tl.from('.sh-tag', { x: -30, opacity: 0, duration: 0.5, ease: 'power3.out' })
        .from('.sh-char', { yPercent: 120, rotate: 16, opacity: 0, stagger: 0.03, duration: 0.7, ease: 'back.out(2.2)' }, 0.05)
        .from('.sh-label', { scale: 0, rotate: -18, duration: 0.7, ease: 'back.out(2.4)' }, 0.3)
        .from('.sh-label-char', { opacity: 0, y: 14, stagger: 0.03, duration: 0.3 }, 0.5)
        .from('.sh-desc', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.55)
    },
    { scope: root },
  )

  return (
    <header ref={root} className="mb-[clamp(3rem,8vh,6rem)] flex flex-col items-start gap-5">
      <div className="sh-tag flex items-center gap-3">
        <span className="rounded-full border-[3px] border-ink bg-ink px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-white">
          #{index}
        </span>
        <span className={`font-jp text-lg ${inverted ? 'text-sun' : 'text-ink'}`} lang="ja">
          {kicker}
        </span>
      </div>
      <h2
        className="font-display text-[clamp(2.3rem,8.2vw,8.4rem)] leading-[1.12] font-black tracking-tight uppercase"
        aria-label={`${title} ${highlight}`}
      >
        <SplitText text={title} charClassName="sh-char" />{' '}
        <span
          className={`sh-label ml-[0.08em] inline-block -rotate-2 rounded-[0.2em] border-[3px] border-ink px-[0.2em] pt-[0.04em] text-ink shadow-hard ${highlightClassName}`}
        >
          <SplitText text={highlight} charClassName="sh-label-char" />
        </span>
      </h2>
      <p className={`sh-desc max-w-[48ch] text-lg font-medium ${inverted ? 'text-white/80' : 'text-ink/80'}`}>{description}</p>
    </header>
  )
}
