'use client'

import { useRef, useState } from 'react'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { event, timeNotes } from '@/data/event'
import { gsap, useGSAP } from '@/lib/gsap'
import { Countdown } from './countdown'

/** Thời gian: một tấm vé khổng lồ in giờ khai cuộc, bên dưới là bộ đếm ngược. */
export function Schedule() {
  const root = useRef<HTMLDivElement>(null)
  const [ended, setEnded] = useState(false)

  useGSAP(
    () => {
      gsap.from('.sch-ticket', {
        y: 120,
        rotate: 8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.sch-ticket', start: 'top 88%', once: true },
      })
      gsap.from('.sch-note', {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.sch-notes', start: 'top 88%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <SectionShell id="thoi-gian" tone="sun">
      <div ref={root}>
        <SectionHeading
          index="02"
          kicker="開催日時"
          title="Thời"
          highlight="Gian"
          highlightClassName="bg-aqua"
          description="Chi tiết thời gian diễn ra sự kiện năm nay!"
        />

        <div className="sch-ticket relative mx-auto max-w-[70rem] rounded-[2rem] border-[3px] border-ink bg-white shadow-hard-lg">
          {/* phần trên của vé */}
          <div className="flex flex-col items-center gap-2 px-6 pt-[clamp(2rem,5vw,4rem)] pb-[clamp(1.6rem,4vw,3rem)] text-center">
            <p className="font-mono text-xs font-bold tracking-[0.3em] uppercase">✦ Thời gian dự kiến ✦</p>
            <p className="font-display text-[clamp(2.2rem,8.6vw,8rem)] leading-[1.02] font-black tracking-tight tabular-nums">
              <span className="text-bubble text-stroke-thin [text-shadow:0.05em_0.06em_0_var(--color-ink)]">{event.timeLabel}</span>
              <span className="mx-[0.25em] inline-block h-[0.1em] w-[0.5em] rounded-full bg-ink align-middle" />
              <span>{event.dateLabel}</span>
            </p>
          </div>

          {/* đường xé răng cưa */}
          <div className="relative border-t-[3px] border-dashed border-ink">
            <span className="absolute top-0 -left-[3px] h-9 w-[1.15rem] -translate-y-1/2 rounded-r-full border-[3px] border-l-0 border-ink bg-sun" />
            <span className="absolute top-0 -right-[3px] h-9 w-[1.15rem] -translate-y-1/2 rounded-l-full border-[3px] border-r-0 border-ink bg-sun" />
          </div>

          <div className="relative px-4 pt-[clamp(2rem,4.5vw,3.6rem)] pb-[clamp(2rem,4.5vw,3.6rem)]">
            <Countdown target={event.startsAt} onEndedChange={setEnded} />
            {ended && (
              <span className="absolute top-3 right-[4%] rotate-[8deg] animate-wobble rounded-xl border-[3px] border-ink bg-bubble px-4 py-1.5 font-display text-[clamp(0.7rem,1.4vw,1.2rem)] font-black text-white uppercase shadow-hard-sm text-stroke-thin">
                Đã khép lại
              </span>
            )}
            <p className="mx-auto mt-6 max-w-[46ch] text-center text-base font-semibold">
              {ended
                ? `Bộ đếm đã về không, mùa giải ${event.year} đã khép lại. Hẹn gặp quý độc giả ở mùa sau!`
                : 'Còn sau đây là thời gian đếm ngược cho đến lúc đó!'}
            </p>
          </div>
        </div>

        <div className="sch-notes mx-auto mt-[clamp(2.5rem,6vw,5rem)] grid max-w-[70rem] gap-6 md:grid-cols-2">
          {timeNotes.map((note, i) => (
            <p
              key={i}
              className={`sch-note relative rounded-[1.4rem] border-[3px] border-ink bg-cream px-6 py-5 text-base font-medium shadow-hard-sm ${
                i ? 'md:rotate-1' : 'md:-rotate-1'
              }`}
            >
              <span className="absolute -top-4 -left-3 grid h-9 w-9 -rotate-12 place-items-center rounded-full border-[3px] border-ink bg-bubble font-display text-xs font-black text-white">
                ※{i + 1}
              </span>
              {note}
            </p>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
