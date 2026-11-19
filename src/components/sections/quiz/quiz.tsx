'use client'

import { useRef, useState, type MouseEvent } from 'react'
import haruhi from '@/assets/stickers/haruhi.webp'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { questions } from '@/data/questions'
import { burstConfetti } from '@/lib/confetti'
import { gsap, useGSAP } from '@/lib/gsap'
import { QuizOption, type OptionState } from './quiz-option'

const N = questions.length

/** Đề thi thử: chọn đáp án để biết đúng/sai ngay, đúng thì bắn pháo giấy. */
export function Quiz() {
  const root = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<(number | null)[]>(() => Array(N).fill(null))

  const q = questions[index]
  const choice = picked[index]
  const answered = picked.filter((p) => p !== null).length
  const correct = picked.filter((p, i) => p !== null && p === questions[i].answer).length

  const { contextSafe } = useGSAP(
    () => {
      gsap.from('.quiz-box', {
        y: 120,
        rotate: -6,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.quiz-box', start: 'top 85%', once: true },
      })
      gsap.from('.quiz-sticker', {
        xPercent: 60,
        opacity: 0,
        rotate: 16,
        duration: 0.9,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.quiz-box', start: 'top 60%', once: true },
      })
    },
    { scope: root },
  )

  // đổi câu: tấm câu hỏi trượt ra rồi trượt vào từ phía ngược lại
  const go = contextSafe((to: number) => {
    const next = (to + N) % N
    if (next === index) return
    const dir = to > index ? 1 : -1
    gsap.to(body.current, {
      x: -60 * dir,
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        setIndex(next)
        gsap.fromTo(body.current, { x: 60 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.6)' })
      },
    })
  })

  const pick = contextSafe((i: number, e: MouseEvent<HTMLButtonElement>) => {
    if (choice !== null) return
    setPicked((p) => p.map((v, k) => (k === index ? i : v)))
    if (i === q.answer) {
      burstConfetti(e.clientX, e.clientY)
    } else {
      gsap.fromTo('.quiz-box', { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.25)' })
    }
  })

  const reset = () => {
    setPicked(Array(N).fill(null))
    go(0)
  }

  const stateOf = (i: number): OptionState =>
    choice === null ? 'idle' : i === q.answer ? 'right' : i === choice ? 'wrong' : 'dim'

  return (
    <SectionShell id="cau-hoi" tone="lilac">
      <div ref={root}>
        <SectionHeading
          index="06"
          kicker="問題"
          title="Mẫu"
          highlight="Câu Hỏi"
          highlightClassName="bg-bubble"
          description="Đây là các câu hỏi của sự kiện năm ngoái, các mẫu câu hỏi đều sẽ tương tự như thế này!"
        />

        <div className="relative mx-auto max-w-[62rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={haruhi.src}
            alt=""
            aria-hidden="true"
            className="quiz-sticker pointer-events-none absolute -right-[clamp(5rem,11vw,11rem)] bottom-0 z-20 w-[clamp(6rem,11vw,10rem)] sticker max-xl:hidden"
          />

          <div className="quiz-box rounded-[2rem] border-[3px] border-ink bg-paper p-[clamp(1.1rem,3vw,2.6rem)] shadow-hard-lg">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink pb-4">
              <p className="flex items-baseline gap-2 font-display font-black uppercase">
                <span className="text-sm">Câu</span>
                <span className="text-[clamp(2.4rem,5vw,4.4rem)] leading-none text-grape tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm text-ink/60">/ {N}</span>
              </p>
              <div className="flex items-center gap-3" aria-live="polite">
                <span className="rounded-full border-[3px] border-ink bg-sun px-4 py-1 font-display text-xs font-black uppercase shadow-hard-sm tabular-nums">
                  Đúng {correct}/{answered}
                </span>
                {answered > 0 && (
                  <button
                    onClick={reset}
                    className="rounded-full border-[3px] border-ink bg-white px-3.5 py-1 font-display text-xs font-black uppercase transition-colors hover:bg-ink hover:text-white"
                  >
                    Làm lại
                  </button>
                )}
              </div>
            </header>

            <div ref={body} className="py-[clamp(1.2rem,3vw,2.2rem)]">
              <h3 className="min-h-[5.2em] text-[clamp(1.1rem,1.9vw,1.6rem)] leading-snug font-bold">{q.q}</h3>
              <ul className="mt-5 grid gap-3.5 md:grid-cols-2">
                {q.options.map((opt, i) => (
                  <li key={`${index}-${i}`}>
                    <QuizOption index={i} text={opt} state={stateOf(i)} onPick={(e) => pick(i, e)} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-xs font-bold tracking-widest uppercase" aria-live="polite">
                {choice === null
                  ? 'Chọn một đáp án để xem kết quả.'
                  : choice === q.answer
                    ? '★ Chính xác!'
                    : `✕ Chưa đúng, đáp án là ${'ABCD'[q.answer]}.`}
              </p>
            </div>

            <footer className="flex items-center justify-between gap-4 border-t-[3px] border-ink pt-4">
              <NavButton label="Câu trước" onClick={() => go(index - 1)}>
                ←
              </NavButton>
              <div className="flex flex-wrap justify-center gap-1.5">
                {questions.map((qq, i) => {
                  const p = picked[i]
                  const tone = p === null ? 'bg-white' : p === qq.answer ? 'bg-ok' : 'bg-bad'
                  return (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-label={`Tới câu ${i + 1}`}
                      className={`h-3.5 w-3.5 rounded-full border-2 border-ink transition-transform duration-300 ease-pop hover:scale-125 ${tone} ${
                        i === index ? 'scale-150 !bg-ink' : ''
                      }`}
                    />
                  )
                })}
              </div>
              <NavButton label="Câu kế tiếp" onClick={() => go(index + 1)}>
                →
              </NavButton>
            </footer>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

function NavButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-sun text-lg shadow-hard-sm transition-[translate,box-shadow] duration-200 ease-pop hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      {children}
    </button>
  )
}
