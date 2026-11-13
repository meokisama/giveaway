/** Tách chuỗi thành từng chữ (giữ nguyên từ để xuống dòng đúng) cho GSAP stagger. */
export function SplitText({ text, charClassName = '' }: { text: string; charClassName?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className={`inline-block will-change-transform ${charClassName}`}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  )
}
