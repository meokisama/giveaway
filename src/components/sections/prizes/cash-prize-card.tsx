import type { ReactNode } from 'react'
import { HoloCard } from '@/components/ui/holo-card'

type Props = {
  rarity: string
  rank: string
  kanji: string
  /** số tiền (đồng), được đếm lên bằng GSAP qua data-amount */
  amount: number
  /** class nền của thẻ */
  tone: string
  children: ReactNode
  className?: string
}

/** Thẻ giải tiền mặt (giải Nhì / Ba): thẻ hologram với con số đếm lên khi cuộn tới. */
export function CashPrizeCard({ rarity, rank, kanji, amount, tone, children, className = '' }: Props) {
  return (
    <HoloCard
      wrapperClassName={`cash-card ${className}`}
      className={`flex h-full flex-col gap-4 rounded-[1.8rem] border-[3px] border-ink p-[clamp(1.3rem,2.6vw,2.4rem)] text-ink shadow-hard-lg ${tone}`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full border-[3px] border-ink bg-ink px-3.5 py-0.5 font-display text-sm font-black text-white">{rarity}</span>
        <span className="flex items-center gap-2 font-display text-sm font-black uppercase">
          <span className="font-jp text-lg" lang="ja">
            {kanji}
          </span>
          {rank}
        </span>
      </div>
      <p className="font-display text-[clamp(2.4rem,6.4vw,6rem)] leading-none font-black tracking-tight tabular-nums">
        <span className="cash-amount" data-amount={amount}>
          {amount.toLocaleString('vi-VN')}
        </span>
        <sup className="ml-1 align-super text-[0.4em]">đ</sup>
      </p>
      <div className="flex flex-col gap-3 text-base font-medium text-ink/85">{children}</div>
    </HoloCard>
  )
}
