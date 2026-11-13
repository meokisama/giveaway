import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  external?: boolean
  className?: string
}

/** Nút dạng viên thuốc: viền mực, bóng cứng, nhấn là "lún" xuống. */
export function PillLink({ href, children, external = false, className = 'bg-white' }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`inline-flex items-center justify-between gap-3 rounded-full border-[3px] border-ink px-5 py-2.5 font-display text-[0.7rem] font-extrabold tracking-wide text-ink uppercase shadow-hard-sm transition-[translate,box-shadow,background-color] duration-200 ease-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none ${className}`}
    >
      {children}
    </a>
  )
}
