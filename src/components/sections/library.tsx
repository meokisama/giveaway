'use client'

import { useRef, type CSSProperties } from 'react'
import { HoloCard } from '@/components/ui/holo-card'
import { PillLink } from '@/components/ui/pill-link'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { konorano } from '@/data/konorano'
import { gsap, useGSAP } from '@/lib/gsap'

/** Tài liệu: bốn số Kono Light Novel ga Sugoi! được "chia bài" ra bàn. */
export function Library() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.lib-card', {
        y: 200,
        x: (i) => (1.5 - i) * 180,
        rotate: (i) => (i - 1.5) * 18,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.lib-grid', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <SectionShell id="tai-lieu" tone="paper">
      <div ref={root}>
        <SectionHeading
          index="05"
          kicker="資料"
          title="Tài"
          highlight="Liệu"
          highlightClassName="bg-zest"
          description="Chia sẻ tài liệu ôn bài. Kono Light Novel ga Sugoi cho 4 năm gần nhất! Cả bản gốc tiếng Nhật (EPUB), và bản Việt từ @NaviRanobe (Sheet)."
        />

        <div className="lib-grid grid grid-cols-2 gap-[clamp(1rem,2.4vw,2.6rem)] lg:grid-cols-4">
          {konorano.map((item, i) => (
            <div key={item.year} className={`lib-card flex flex-col gap-4 ${i % 2 ? 'lg:translate-y-8' : ''}`} style={{ '--accent': item.color } as CSSProperties}>
              <HoloCard tilt={16} className="overflow-hidden rounded-[1.2rem] border-[3px] border-ink bg-white shadow-hard-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.cover.src} alt={`Bìa Kono Light Novel ga Sugoi! ${item.year}`} loading="lazy" className="aspect-[653/927] w-full object-cover" />
              </HoloCard>
              <div>
                <p className="font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-none font-black text-[var(--accent)] text-stroke-thin [text-shadow:0.05em_0.06em_0_var(--color-ink)]">
                  {item.year}
                </p>
                <h3 className="mt-2 text-sm font-bold">Kono Light Novel ga Sugoi! {item.year}</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                <PillLink href={item.epub} external className="bg-[var(--accent)]">
                  <span>
                    Bản Nhật <span className="opacity-70">· EPUB</span>
                  </span>
                  <span>↓</span>
                </PillLink>
                <PillLink href={item.sheet} external>
                  <span>
                    Bản Việt <span className="opacity-70">· Sheet</span>
                  </span>
                  <span>↗</span>
                </PillLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
