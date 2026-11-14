const LINES = [
  { text: 'Ranobe', color: 'text-aqua' },
  { text: 'Giveaway', color: 'text-sun' },
  { text: 'Booster', color: 'text-bubble' },
]

/** Tựa đề 3 dòng: chữ khối viền mực, bóng cứng, màu lấy từ logo pixel gốc. */
export function HeroTitle() {
  return (
    <h1
      aria-label="Ranobe Giveaway Booster"
      className="absolute inset-x-0 top-[17svh] z-10 flex flex-col items-center px-[clamp(18px,5vw,96px)] font-display text-[13vw] leading-[0.98] font-black tracking-[-0.02em] uppercase lg:top-1/2 lg:-translate-y-[54%] lg:items-start lg:text-[min(8.1vw,21svh)]"
    >
      {LINES.map((line) => (
        <span key={line.text} className={`hero-line block whitespace-nowrap will-change-transform ${line.color}`} aria-hidden="true">
          {Array.from(line.text).map((ch, i) => (
            <span
              key={i}
              className="hero-char inline-block text-stroke [text-shadow:0.055em_0.065em_0_var(--color-ink)] will-change-transform"
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}
