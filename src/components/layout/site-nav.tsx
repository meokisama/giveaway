'use client'

import { useRef } from 'react'
import logo from '@/assets/logo.webp'
import { navigation } from '@/data/navigation'
import { appReady } from '@/lib/app-ready'
import { gsap, useGSAP } from '@/lib/gsap'

/** Thanh điều hướng nổi: logo, mục lục dạng viên thuốc và thanh tiến độ cuộn. */
export function SiteNav() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.set(root.current, { yPercent: -160 })
      const off = appReady.on(() => gsap.to(root.current, { yPercent: 0, duration: 0.9, ease: 'back.out(1.6)', delay: 1.2 }))
      gsap.to('.nav-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      })
      return off
    },
    { scope: root },
  )

  return (
    <header
      ref={root}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-center justify-between gap-4 px-[clamp(12px,3vw,48px)] py-3"
    >
      <a href="#top" className="pointer-events-auto shrink-0 transition-transform duration-300 ease-pop hover:scale-110 hover:-rotate-3" aria-label="Về đầu trang">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt="Ranobe Giveaway Booster" className="h-11 w-auto drop-shadow-[3px_3px_0_rgba(21,19,31,0.85)]" />
      </a>

      <nav
        aria-label="Mục lục"
        className="pointer-events-auto relative hidden items-center gap-1 overflow-hidden rounded-full border-[3px] border-ink bg-white px-2 py-1.5 shadow-hard-sm lg:flex"
      >
        {navigation.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full px-3 py-1 font-display text-[0.62rem] font-bold tracking-wide whitespace-nowrap uppercase transition-colors duration-200 hover:bg-ink hover:text-sun"
          >
            {item.label}
          </a>
        ))}
        <span className="nav-progress absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-bubble" aria-hidden="true" />
      </nav>

      <a
        href="#cau-hoi"
        className="pointer-events-auto shrink-0 rounded-full border-[3px] border-ink bg-sun px-4 py-2 font-display text-[0.65rem] font-extrabold tracking-wide uppercase shadow-hard-sm transition-[translate,box-shadow] duration-200 ease-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        Làm thử đề →
      </a>
    </header>
  )
}
