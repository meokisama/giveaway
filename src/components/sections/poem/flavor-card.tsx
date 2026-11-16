import type { ReactNode } from 'react'

export type FlavorCardData = {
  suit: string
  rank: string
  text: ReactNode
  /** class nền + màu chữ của mặt trước */
  face: string
  holo?: boolean
}

/** Một lá bài hai mặt: mặt lưng tím, mặt trước in một câu thơ. Lật bằng rotateY (GSAP điều khiển). */
export function FlavorCard({ card }: { card: FlavorCardData }) {
  return (
    <div className="poem-card relative aspect-[5/7] w-full will-change-transform [perspective:1400px]">
      <div className="poem-flip relative h-full w-full preserve-3d">
        {/* mặt trước */}
        <div
          className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.4rem] border-[3px] border-ink p-[7%] shadow-hard backface-hidden ${card.face}`}
        >
          <Corner suit={card.suit} rank={card.rank} />
          <p className="relative z-30 font-display text-[clamp(1rem,2.3vw,2.8rem)] leading-[1.12] font-black uppercase">{card.text}</p>
          <Corner suit={card.suit} rank={card.rank} flipped />
          <span aria-hidden="true" className="pointer-events-none absolute -right-[12%] -bottom-[14%] text-[16rem] leading-none opacity-15">
            {card.suit}
          </span>
          {card.holo && <span className="holo-shine holo-idle !opacity-45" aria-hidden="true" />}
        </div>
        {/* mặt lưng */}
        <div className="absolute inset-0 rounded-[1.4rem] border-[3px] border-ink p-[5%] shadow-hard backface-hidden [transform:rotateY(180deg)] bg-white">
          <div className="h-full w-full rounded-[1rem] border-[3px] border-ink card-back" />
        </div>
      </div>
    </div>
  )
}

function Corner({ suit, rank, flipped = false }: { suit: string; rank: string; flipped?: boolean }) {
  return (
    <span className={`relative z-30 flex flex-col items-center self-start font-display text-lg leading-none font-black ${flipped ? 'rotate-180 self-end' : ''}`}>
      <span>{rank}</span>
      <span className="text-2xl">{suit}</span>
    </span>
  )
}
