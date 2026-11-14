'use client'

import { useEffect, useRef, useState } from 'react'
import logo from '@/assets/logo.webp'
import { goldPhotos } from '@/data/gold-photos'
import { heroState } from '@/lib/hero-state'

// 9 trang của artbook làm mặt thẻ
const CARD_PICKS = [1, 4, 7, 10, 0, 13, 16, 19, 22]

/** Canvas WebGL của hero. three.js được tải động để không chặn lần vẽ đầu tiên. */
export function HeroStage() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    let scene: import('./pack-scene').PackScene | null = null
    let cancelled = false

    const onMove = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      heroState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // chỉ render khi hero còn trong khung nhìn
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) scene?.start()
      else scene?.stop()
    })

    import('./pack-scene')
      .then(async ({ PackScene }) => {
        if (cancelled) return
        scene = new PackScene(el, { logo: logo.src, cards: CARD_PICKS.map((i) => goldPhotos[i].src) })
        await scene.load()
        if (cancelled) return scene.dispose()
        io.observe(el)
      })
      .catch((err) => {
        console.warn('WebGL không khả dụng, hiển thị logo tĩnh.', err)
        setFailed(true)
      })

    return () => {
      cancelled = true
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene?.dispose()
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      {failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          alt=""
          className="absolute top-1/2 left-1/2 w-[min(62vw,720px)] -translate-x-1/2 -translate-y-1/2 -rotate-3 drop-shadow-[10px_12px_0_rgba(21,19,31,0.9)]"
        />
      ) : (
        <canvas ref={canvas} className="block h-full w-full drop-shadow-[0_28px_30px_rgba(21,19,31,0.3)]" />
      )}
    </div>
  )
}
