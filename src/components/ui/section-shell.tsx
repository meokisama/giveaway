import type { ReactNode } from 'react'

const tones = {
  paper: 'bg-paper text-ink',
  cream: 'bg-cream text-ink',
  aqua: 'bg-aqua text-ink',
  sun: 'bg-sun text-ink',
  bubble: 'bg-bubble text-ink',
  lilac: 'bg-lilac text-ink',
  night: 'bg-night text-white',
} as const

export type Tone = keyof typeof tones

type Props = {
  id?: string
  tone: Tone
  children: ReactNode
  className?: string
  /** bật nền chấm halftone */
  dots?: boolean
}

/** Khung section: mỗi section là một "tấm thẻ" màu bo góc trên, xếp chồng lên section trước. */
export function SectionShell({ id, tone, children, className = '', dots = true }: Props) {
  return (
    <section
      id={id}
      className={`relative z-10 -mt-12 overflow-clip rounded-t-[3rem] border-t-[3px] border-ink px-[clamp(18px,5vw,96px)] pt-[clamp(5rem,13vh,10rem)] pb-[calc(clamp(5rem,13vh,10rem)+3rem)] ${tones[tone]} ${className}`}
    >
      {dots && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_70%)] ${
            tone === 'night' ? '[--dot:rgba(255,255,255,0.09)]' : ''
          }`}
        />
      )}
      <div className="relative">{children}</div>
    </section>
  )
}
