'use client'

import { useRef } from 'react'
import { SplitText } from '@/components/ui/split-text'
import { Starburst } from '@/components/ui/starburst'
import { rules, stickeredRule } from '@/data/rules'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'

const TONES = ['bg-white', 'bg-sun', 'bg-aqua', 'bg-zest', 'bg-white', 'bg-lilac', 'bg-cream']
const NUMBER_TONES = ['text-bubble', 'text-grape', 'text-bubble', 'text-grape', 'text-aqua', 'text-bubble', 'text-tang']

/**
 * Thể lệ: section được ghim, 7 lá bài luật trượt ngang theo nhịp cuộn.
 * Mỗi lá nghiêng theo vận tốc cuộn (skew) nên cuộn nhanh thì cả dãy "ngả" theo.
 */
export function Rules() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = track.current!
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth)
      const skew = gsap.quickTo('.rule-card', 'skewX', { duration: 0.5, ease: 'power3.out' })

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -320)),
          // dừng cuộn thì các lá đứng thẳng lại
          onScrubComplete: () => skew(0),
        },
      })

      const settle = () => skew(0)
      ScrollTrigger.addEventListener('scrollEnd', settle)

      gsap.from('.rule-title-char', {
        yPercent: 120,
        rotate: 16,
        opacity: 0,
        stagger: 0.03,
        duration: 0.7,
        ease: 'back.out(2.2)',
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      })
      // con dấu đập xuống khi lá số 3 vào giữa màn hình
      gsap.from('.rule-sticker', {
        scale: 3,
        opacity: 0,
        rotate: -50,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: '.rule-stickered', containerAnimation: tween, start: 'left 65%', toggleActions: 'play none none reverse' },
      })
      gsap.to('.rule-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.3 },
      })
      return () => ScrollTrigger.removeEventListener('scrollEnd', settle)
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="the-le"
      className="relative z-10 -mt-12 flex h-svh flex-col justify-center overflow-hidden rounded-t-[3rem] border-t-[3px] border-ink bg-bubble"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dots" />
      <div ref={track} className="relative flex w-max items-center gap-[clamp(1.2rem,2.4vw,2.6rem)] px-[clamp(18px,5vw,96px)] will-change-transform">
        {/* tấm mở đầu */}
        <div className="flex w-[min(86vw,36rem)] shrink-0 flex-col items-start gap-5 pr-[2vw]">
          <div className="flex items-center gap-3">
            <span className="rounded-full border-[3px] border-ink bg-ink px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-white">#03</span>
            <span className="font-jp text-lg" lang="ja">
              規則
            </span>
          </div>
          <h2 className="font-display text-[clamp(3rem,9vw,8.4rem)] leading-[1.1] font-black uppercase" aria-label="Thể lệ">
            <SplitText text="Thể" charClassName="rule-title-char" />{' '}
            <span className="inline-block -rotate-2 rounded-[0.2em] border-[3px] border-ink bg-sun px-[0.2em] shadow-hard">
              <SplitText text="Lệ" charClassName="rule-title-char" />
            </span>
          </h2>
          <p className="max-w-[40ch] text-lg font-semibold">
            Quy tắc cơ bản cho cuộc thi. Còn có tuân thủ hay không thì chúng tôi cơ bản không để ý!
          </p>
          <span className="rounded-full border-[3px] border-ink bg-white px-4 py-1.5 font-display text-[0.7rem] font-extrabold uppercase shadow-hard-sm">
            Cuộn tiếp để lật 7 lá →
          </span>
        </div>

        {rules.map((rule, i) => (
          <article
            key={i}
            className={`rule-card relative flex h-[min(64svh,34rem)] w-[min(78vw,24rem)] shrink-0 flex-col justify-between rounded-[1.8rem] border-[3px] border-ink p-[clamp(1.2rem,2vw,2rem)] shadow-hard-lg ${TONES[i]} ${
              i % 2 ? 'rotate-2 translate-y-4' : '-rotate-2 -translate-y-4'
            } ${i === stickeredRule ? 'rule-stickered' : ''}`}
          >
            <div className="flex items-start justify-between">
              <span className={`font-display text-[clamp(4rem,7.5vw,7.5rem)] leading-[0.85] font-black text-stroke ${NUMBER_TONES[i]}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="rounded-full border-[3px] border-ink bg-ink px-3 py-0.5 font-mono text-[0.65rem] font-bold tracking-widest text-white uppercase">
                Điều {i + 1}/{rules.length}
              </span>
            </div>
            <p className="text-[clamp(0.98rem,1.25vw,1.18rem)] leading-relaxed font-semibold">{rule}</p>
            {i === stickeredRule && (
              <Starburst className="rule-sticker absolute -top-10 -right-8 w-36 rotate-12" fill="var(--color-bad)" points={16} depth={0.8}>
                <span className="block font-display text-[0.8rem] leading-tight font-black text-white uppercase text-stroke-thin">
                  Gian lận
                  <br />
                  OK!
                </span>
              </Starburst>
            )}
          </article>
        ))}
        <div className="w-[4vw] shrink-0" aria-hidden="true" />
      </div>

      <div className="absolute inset-x-[clamp(18px,5vw,96px)] bottom-[5svh] h-3 overflow-hidden rounded-full border-[3px] border-ink bg-white">
        <span className="rule-progress block h-full origin-left scale-x-0 bg-ink" />
      </div>
    </section>
  )
}
