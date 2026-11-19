import type { MouseEvent } from 'react'

export type OptionState = 'idle' | 'right' | 'wrong' | 'dim'

const LETTER_TONES = ['bg-aqua', 'bg-bubble', 'bg-sun', 'bg-zest']

const STATE_CLASSES: Record<OptionState, string> = {
  idle: 'bg-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none',
  right: 'bg-ok text-white',
  wrong: 'bg-bad text-white',
  dim: 'bg-white opacity-45',
}

type Props = {
  index: number
  text: string
  state: OptionState
  onPick: (e: MouseEvent<HTMLButtonElement>) => void
}

/** Một đáp án A/B/C/D dạng nút sticker. */
export function QuizOption({ index, text, state, onPick }: Props) {
  return (
    <button
      onClick={onPick}
      disabled={state !== 'idle'}
      className={`flex h-full w-full items-center gap-4 rounded-2xl border-[3px] border-ink px-4 py-3.5 text-left text-base font-semibold shadow-hard-sm transition-[translate,box-shadow,background-color,opacity] duration-200 ease-pop disabled:cursor-default ${STATE_CLASSES[state]}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-ink font-display text-sm font-black text-ink ${LETTER_TONES[index]}`}
      >
        {'ABCD'[index]}
      </span>
      <span className="min-w-0 flex-1">{text}</span>
      <span className="w-5 shrink-0 text-center font-display text-lg font-black" aria-hidden="true">
        {state === 'right' ? '○' : state === 'wrong' ? '✕' : ''}
      </span>
    </button>
  )
}
