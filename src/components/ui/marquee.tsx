import type { ReactNode } from 'react'

type Props = {
  items: ReactNode[]
  reverse?: boolean
  className?: string
  itemClassName?: string
  separator?: ReactNode
}

/** Băng chữ chạy vô tận (hai bản sao nối đuôi, dịch -50%). */
export function Marquee({ items, reverse = false, className = '', itemClassName = '', separator = '✦' }: Props) {
  const run = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {[0, 1, 2].map((r) =>
        items.map((item, i) => (
          <span key={`${r}-${i}`} className={`flex items-center whitespace-nowrap ${itemClassName}`}>
            {item}
            <span className="mx-[1.2em] text-[0.6em]">{separator}</span>
          </span>
        )),
      )}
    </div>
  )
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  )
}
