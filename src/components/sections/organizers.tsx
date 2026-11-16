'use client'

import { useRef } from 'react'
import { HoloCard } from '@/components/ui/holo-card'
import { PillLink } from '@/components/ui/pill-link'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { Starburst } from '@/components/ui/starburst'
import { organizers } from '@/data/organizers'
import { gsap, useGSAP } from '@/lib/gsap'

/** Ban tổ chức: hai "thẻ người chơi" lao vào từ hai phía, va nhau thành dấu ×. */
export function Organizers() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.org-row', start: 'top 78%', once: true } })
      tl.from('.org-card', {
        xPercent: (i) => (i === 0 ? -130 : 130),
        rotate: (i) => (i === 0 ? -28 : 28),
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.3)',
      })
        .from('.org-x', { scale: 0, rotate: -180, duration: 0.7, ease: 'back.out(2.6)' }, 0.55)
        .to('.org-row', { x: 8, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' }, 0.6)
    },
    { scope: root },
  )

  return (
    <SectionShell id="ban-to-chuc" tone="aqua">
      <div ref={root}>
        <SectionHeading
          index="01"
          kicker="主催"
          title="Ban"
          highlight="Tổ Chức"
          highlightClassName="bg-white"
          description="Mọi câu hỏi thắc mắc về cuộc thi đều có thể gửi tin nhắn trực tiếp tới hai trang này!"
        />

        <div className="org-row relative mx-auto grid max-w-[76rem] items-stretch gap-[clamp(2rem,5vw,6rem)] md:grid-cols-2">
          {organizers.map((o, i) => (
            <HoloCard
              key={o.handle}
              wrapperClassName={`org-card ${i === 0 ? 'md:-rotate-2' : 'md:rotate-2'}`}
              className="flex h-full flex-col gap-5 rounded-[1.8rem] border-[3px] border-ink bg-white p-[clamp(1.2rem,2.4vw,2.2rem)] shadow-hard-lg"
            >
              <div className="flex items-center justify-between font-display text-xs font-black uppercase">
                <span className={`rounded-full border-[3px] border-ink px-3 py-0.5 ${o.tone === 'cyan' ? 'bg-aqua' : 'bg-bubble'}`}>
                  Player {i + 1}
                </span>
                <span className="font-jp text-base" lang="ja">
                  {i === 0 ? '知識王' : '返信王'}
                </span>
              </div>
              <div className={`overflow-hidden rounded-[1.2rem] border-[3px] border-ink ${o.tone === 'cyan' ? 'bg-aqua' : 'bg-bubble'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.avatar.src}
                  alt={o.handle}
                  loading="lazy"
                  className="aspect-[16/11] w-full object-cover transition-transform duration-700 ease-expo hover:scale-110"
                />
              </div>
              <h3 className="font-display text-[clamp(1.5rem,3.1vw,3rem)] leading-none font-black break-all">
                <span className="text-grape">@</span>
                {o.handle}
              </h3>
              <p className="text-lg font-semibold text-ink/80">{o.line}</p>
              <PillLink href={o.url} external className={`mt-auto self-start ${o.tone === 'cyan' ? 'bg-aqua' : 'bg-bubble'}`}>
                facebook.com/{o.handle} <span>↗</span>
              </PillLink>
            </HoloCard>
          ))}

          <Starburst
            className="org-x pointer-events-none absolute top-1/2 left-1/2 z-30 w-[clamp(5rem,9vw,9rem)] -translate-x-1/2 -translate-y-1/2"
            points={12}
            depth={0.7}
          >
            <span className="font-display text-[clamp(2rem,4vw,4rem)] leading-none font-black">×</span>
          </Starburst>
        </div>
      </div>
    </SectionShell>
  )
}
