/** Nền hero: các đốm màu trôi, tia nắng xoay chậm và lớp chấm halftone. */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper" aria-hidden="true">
      <div className="absolute -top-[20%] -left-[10%] h-[70vmax] w-[70vmax] animate-float rounded-full bg-aqua/55 blur-[110px]" />
      <div className="absolute top-[10%] -right-[15%] h-[60vmax] w-[60vmax] animate-float rounded-full bg-bubble/45 blur-[120px] [animation-delay:-2s]" />
      <div className="absolute -bottom-[30%] left-[25%] h-[55vmax] w-[55vmax] animate-float rounded-full bg-sun/60 blur-[110px] [animation-delay:-3.4s]" />
      <div className="absolute top-1/2 left-1/2 h-[220vmax] w-[220vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="h-full w-full animate-spin-slow bg-[repeating-conic-gradient(from_0deg,rgba(124,92,255,0.09)_0_9deg,transparent_9deg_18deg)]" />
      </div>
      <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(circle_at_70%_40%,black,transparent_75%)]" />
    </div>
  )
}
