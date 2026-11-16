'use client'

import { useRef } from 'react'
import art from '@/assets/prologue-art.webp'
import signature from '@/assets/signature.png'
import { HoloCard } from '@/components/ui/holo-card'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { event, prologue } from '@/data/event'
import { gsap, useGSAP } from '@/lib/gsap'

const STATS = [
  { value: String(event.questionCount), label: 'câu hỏi', tone: 'bg-aqua' },
  { value: String(event.minutes), label: 'phút', tone: 'bg-bubble' },
  { value: '3', label: 'giải thưởng', tone: 'bg-sun' },
  { value: event.anniversary, label: 'ngày mở trang', tone: 'bg-zest' },
]

/** Khởi Nguyên: lá bài nhân vật hologram bên trái, lời mở đầu và các chỉ số bên phải. */
export function Prologue() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.pro-card', {
        rotate: -22,
        xPercent: -60,
        opacity: 0,
        duration: 1.1,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.pro-card', start: 'top 85%', once: true },
      })
      gsap.from('.pro-text > *', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.pro-text', start: 'top 80%', once: true },
      })
      gsap.from('.pro-stat', {
        scale: 0,
        rotate: () => gsap.utils.random(-25, 25),
        stagger: 0.08,
        duration: 0.7,
        ease: 'back.out(2.4)',
        scrollTrigger: { trigger: '.pro-stats', start: 'top 90%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <SectionShell id="khoi-nguyen" tone="cream">
      <div ref={root}>
        <SectionHeading
          index="00"
          kicker="プロローグ"
          title="Khởi"
          highlight="Nguyên"
          highlightClassName="bg-bubble"
          description="Kính chào quý độc giả! Vài dòng về cuộc thi trước khi rút thẻ."
        />

        <div className="grid items-center gap-[clamp(2.5rem,6vw,7rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <HoloCard
            wrapperClassName="pro-card mx-auto w-full max-w-[26rem] -rotate-3"
            className="overflow-hidden rounded-[1.6rem] border-[3px] border-ink bg-white p-3 shadow-hard-lg"
          >
            <div className="flex items-center justify-between px-2 pb-2.5 font-display text-xs font-black uppercase">
              <span>Độc giả</span>
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-sun">UR</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.src}
              alt="Thiếu nữ ngồi đọc một cuốn light novel"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[1rem] border-[3px] border-ink object-cover object-[50%_10%]"
            />
            <div className="flex items-end justify-between gap-3 px-2 pt-3">
              <p className="text-xs leading-snug font-semibold">
                <span className="mb-0.5 block font-display text-[0.65rem] font-black tracking-wide uppercase">Kỹ năng</span>
                Tìm kiếm & tra cứu thông tin light novel.
              </p>
              <span className="font-jp text-2xl leading-none text-bubble" lang="ja">
                読者
              </span>
            </div>
          </HoloCard>

          <div className="pro-text flex flex-col gap-5">
            {prologue.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-[clamp(1.15rem,1.7vw,1.6rem)] leading-snug font-bold' : 'text-lg font-medium text-ink/85'}>
                {p}
              </p>
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signature.src} alt="naviranobe & themeoki" loading="lazy" className="w-52 self-end mix-blend-multiply" />

            <ul className="pro-stats mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <li
                  key={s.label}
                  className={`pro-stat rounded-2xl border-[3px] border-ink px-4 py-3 shadow-hard-sm transition-transform duration-300 ease-pop hover:-translate-y-1 hover:rotate-2 ${s.tone}`}
                >
                  <span className="block font-display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none font-black">{s.value}</span>
                  <span className="font-mono text-[0.65rem] font-bold tracking-widest uppercase">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
