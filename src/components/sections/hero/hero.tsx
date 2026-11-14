'use client'

import { useRef } from 'react'
import { HeroStage } from '@/components/hero-stage/hero-stage'
import { Starburst } from '@/components/ui/starburst'
import { appReady } from '@/lib/app-ready'
import { gsap, useGSAP } from '@/lib/gsap'
import { heroState } from '@/lib/hero-state'
import { HeroBackdrop } from './hero-backdrop'
import { HeroChrome } from './hero-chrome'
import { HeroTitle } from './hero-title'

/**
 * Hero được ghim suốt 420vh. Tiến độ cuộn điều khiển cả DOM (GSAP) lẫn cảnh 3D (heroState):
 * tựa đề dạt ra → gói thẻ bị xé → thẻ xoè quạt trên nền hình nổ "RÚT THẺ!" → thẻ lao về phía người xem.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // mở màn sau preloader
      const off = appReady.on(() => {
        gsap.to(heroState, { intro: 1, duration: 1.5, ease: 'none', delay: 0.3 })
        gsap.from('.hero-char', {
          yPercent: 130,
          rotate: 12,
          opacity: 0,
          stagger: 0.035,
          duration: 0.9,
          ease: 'back.out(1.9)',
          delay: 0.35,
        })
        gsap.from('.hero-pop', { scale: 0, rotate: -20, stagger: 0.07, duration: 0.7, ease: 'back.out(2.2)', delay: 1.1 })
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            heroState.progress = self.progress
          },
        },
      })
      tl.to('.hero-chrome', { opacity: 0, y: 30, duration: 0.07 }, 0.03)
        .to('.hero-line', { xPercent: (i) => (i % 2 ? 60 : -60), opacity: 0, stagger: 0.02, duration: 0.2, ease: 'power2.in' }, 0.05)
        .fromTo('.hero-burst', { scale: 0, rotate: -70 }, { scale: 1, rotate: 0, duration: 0.3, ease: 'back.out(1.5)' }, 0.26)
        .fromTo('.hero-shout', { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'back.out(2.4)' }, 0.42)
        .to('.hero-shout', { opacity: 0, scale: 1.7, duration: 0.14, ease: 'power2.in' }, 0.74)
        .to('.hero-burst', { scale: 5, opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.76)
        .set({}, {}, 1)

      return off
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative h-[420vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <HeroBackdrop />
        <HeroTitle />

        {/* hình nổ + tiếng hô phía sau quạt thẻ */}
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center" aria-hidden="true">
          <Starburst className="hero-burst w-[min(120vw,120svh)] scale-0" points={22} depth={0.82} />
          <p className="hero-shout absolute top-[62%] font-display text-[clamp(2.4rem,9vw,9rem)] leading-none font-black text-white uppercase opacity-0 text-stroke [text-shadow:0.05em_0.06em_0_var(--color-ink)]">
            Rút thẻ!
          </p>
        </div>

        <HeroStage />
        <HeroChrome />
      </div>
    </section>
  )
}
