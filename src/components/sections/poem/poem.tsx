'use client'

import { useRef } from 'react'
import makein from '@/assets/stickers/makein.webp'
import { gsap, useGSAP } from '@/lib/gsap'
import { FlavorCard, type FlavorCardData } from './flavor-card'

// Bốn câu thơ = bốn lá bài. Màu lá bài chính là chữ trong câu thơ: red → đỏ, blue → lam.
const CARDS: FlavorCardData[] = [
  { suit: '♥', rank: 'A', text: <>Roses are red,</>, face: 'bg-bad text-white' },
  { suit: '♠', rank: 'K', text: <>Violets are blue,</>, face: 'bg-[#3b5bff] text-white' },
  { suit: '♥', rank: 'Q', text: <>I love you but you said,</>, face: 'bg-bubble text-ink' },
  { suit: '★', rank: 'J', text: <>Unless you win this issue!</>, face: 'bg-sun text-ink', holo: true },
]
const TILTS = [-5, 3, -3, 6]

/**
 * Lời đề từ: section được ghim, bốn lá bài úp chồng giữa màn hình rồi lần lượt
 * được chia ra chỗ của mình và lật ngửa theo nhịp cuộn.
 */
export function Poem() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.poem-card')
      const deck = root.current!.querySelector<HTMLElement>('.poem-deck')!

      // khoảng cách từ ô của mỗi lá tới tâm bộ bài
      const toCenter = (el: HTMLElement) => {
        const d = deck.getBoundingClientRect()
        // đo ở trạng thái gốc (bỏ transform hiện tại)
        const x = el.offsetLeft + el.offsetWidth / 2
        const y = el.offsetTop + el.offsetHeight / 2
        return { x: d.width / 2 - x, y: d.height / 2 - y }
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card, i) => {
        const flip = card.querySelector('.poem-flip')
        tl.fromTo(
          card,
          { x: () => toCenter(card).x, y: () => toCenter(card).y - i * 6, rotation: (i - 1.5) * 7, scale: 0.86, zIndex: 10 - i },
          { x: 0, y: 0, rotation: TILTS[i], scale: 1, duration: 1 },
          i * 0.85,
        )
          .fromTo(flip, { rotateY: 180 }, { rotateY: 0, duration: 0.9 }, i * 0.85 + 0.15)
          .to(card, { y: -26, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 }, i * 0.85 + 0.95)
      })
      tl.fromTo('.poem-cite', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '>-0.3')
        .fromTo('.poem-sticker', { yPercent: 100, rotate: 14 }, { yPercent: 0, rotate: -4, duration: 0.8, ease: 'back.out(1.6)' }, '<')
        .to({}, { duration: 0.5 })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="loi-de-tu"
      className="relative z-10 -mt-12 flex h-svh flex-col justify-center overflow-clip rounded-t-[3rem] border-t-[3px] border-ink bg-night px-[clamp(18px,5vw,96px)] text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dots [--dot:rgba(255,255,255,0.08)]" />
      <div className="relative mb-[4svh] flex items-center gap-3">
        <span className="rounded-full border-[3px] border-white bg-white px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-ink">
          #00
        </span>
        <span className="font-display text-sm font-extrabold tracking-wide uppercase">Lời đề từ</span>
        <span className="font-jp text-sun" lang="ja">
          フレーバーテキスト
        </span>
      </div>

      <blockquote className="relative">
        <div className="poem-deck relative mx-auto grid w-full grid-cols-2 gap-[clamp(10px,2vw,32px)] max-lg:max-w-[min(26rem,calc((100svh-15rem)*0.72))] lg:max-w-[min(96rem,calc((100svh-15rem)*2.95))] lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <FlavorCard key={i} card={card} />
          ))}
        </div>
        <cite className="poem-cite mt-[4svh] block text-center font-mono text-sm font-semibold tracking-[0.3em] text-white/70 uppercase not-italic">
          ✦ The Issue ✦
        </cite>
      </blockquote>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={makein.src}
        alt=""
        aria-hidden="true"
        className="poem-sticker pointer-events-none absolute right-[3vw] bottom-0 z-40 w-[clamp(4.5rem,8vw,8.5rem)] sticker max-lg:w-16"
      />
    </section>
  )
}
