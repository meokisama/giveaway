import { gsap } from './gsap'

const COLORS = ['#2fd8ff', '#ff5cae', '#ffd93b', '#7c5cff', '#b9f34a', '#ff8a3b']

/** Bắn một chùm pháo giấy từ toạ độ màn hình (x, y). Tự dọn DOM khi xong. */
export function burstConfetti(x: number, y: number, count = 34) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const layer = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:150;overflow:hidden'
  document.body.appendChild(layer)

  for (let i = 0; i < count; i++) {
    const bit = document.createElement('span')
    const size = gsap.utils.random(8, 16)
    const round = Math.random() < 0.35
    bit.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${round ? size : size * 0.5}px;background:${
      COLORS[i % COLORS.length]
    };border:2px solid #15131f;border-radius:${round ? '50%' : '2px'}`
    layer.appendChild(bit)

    const angle = gsap.utils.random(-Math.PI, 0)
    const power = gsap.utils.random(120, 420)
    gsap
      .timeline()
      .to(bit, {
        x: Math.cos(angle) * power,
        y: Math.sin(angle) * power,
        rotation: gsap.utils.random(-540, 540),
        duration: 0.55,
        ease: 'power3.out',
      })
      .to(bit, { y: '+=320', opacity: 0, rotation: '+=220', duration: 0.9, ease: 'power2.in' })
  }
  gsap.delayedCall(1.7, () => layer.remove())
}
