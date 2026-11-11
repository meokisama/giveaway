'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { appReady } from '@/lib/app-ready'
import { gsap, ScrollTrigger } from '@/lib/gsap'

/** Cuộn mượt bằng Lenis, đồng bộ với ScrollTrigger. Khoá cuộn cho tới khi preloader xong. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    lenis.stop()
    const off = appReady.on(() => lenis.start())

    return () => {
      off()
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}
