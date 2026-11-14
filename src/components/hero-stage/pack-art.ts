import * as THREE from 'three'
import { event } from '@/data/event'

const W = 1024
const H = 1504
const DISPLAY = '"Unbounded Variable", "Unbounded", sans-serif'
const MONO = '"JetBrains Mono Variable", monospace'

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  return { canvas, ctx: canvas.getContext('2d')! }
}

function toTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function sunburst(ctx: CanvasRenderingContext2D, cx: number, cy: number, rays: number, color: string) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.fillStyle = color
  for (let i = 0; i < rays; i++) {
    ctx.rotate((Math.PI * 2) / rays)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, 1900, 0, Math.PI / rays)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

function halftone(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color
  for (let y = 0; y < H; y += 22) {
    for (let x = (y / 22) % 2 ? 11 : 0; x < W; x += 22) {
      const r = 5.5 * Math.max(0, 1 - y / (H * 0.75))
      if (r < 0.6) continue
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function pill(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string, font: string, fill: string, ink: string) {
  ctx.font = font
  const w = ctx.measureText(text).width + 64
  const h = 78
  ctx.fillStyle = '#15131f'
  ctx.beginPath()
  ctx.roundRect(cx - w / 2 + 7, cy - h / 2 + 7, w, h, h / 2)
  ctx.fill()
  ctx.fillStyle = fill
  ctx.strokeStyle = '#15131f'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = ink
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, cx, cy + 3)
}

/** Mặt trước gói thẻ: nền gradient + tia nắng + logo pixel của cuộc thi. */
export function createFrontArt(logo: HTMLImageElement) {
  const { canvas, ctx } = makeCanvas()

  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#22d3ff')
  g.addColorStop(0.42, '#7c5cff')
  g.addColorStop(0.72, '#ff4fa8')
  g.addColorStop(1, '#ff9a3c')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  sunburst(ctx, W / 2, H * 0.47, 18, 'rgba(255,255,255,0.16)')
  halftone(ctx, 'rgba(255,255,255,0.22)')

  // dải "xé tại đây" nằm ngay trên đường cắt
  ctx.fillStyle = '#15131f'
  ctx.fillRect(0, H * 0.095, W, 74)
  ctx.fillStyle = '#ffd93b'
  ctx.font = `700 26px ${MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✂ - - - XÉ TẠI ĐÂY - - - TEAR HERE - - - XÉ TẠI ĐÂY - - - ✂', W / 2, H * 0.095 + 38)

  // logo
  const lw = W * 0.9
  const lh = (lw * logo.naturalHeight) / logo.naturalWidth
  ctx.save()
  ctx.translate(W / 2, H * 0.46)
  ctx.rotate(-0.07)
  ctx.shadowColor = 'rgba(21,19,31,0.55)'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 12
  ctx.shadowOffsetY = 14
  ctx.drawImage(logo, -lw / 2, -lh / 2, lw, lh)
  ctx.restore()

  pill(ctx, W / 2, H * 0.215, `BOOSTER PACK · VOL. ${event.year}`, `800 34px ${DISPLAY}`, '#ffd93b', '#15131f')
  pill(ctx, W / 2, H * 0.735, `${event.questionCount} CÂU HỎI · ${event.minutes} PHÚT · 3 GIẢI`, `800 31px ${DISPLAY}`, '#ffffff', '#15131f')

  ctx.fillStyle = '#15131f'
  ctx.fillRect(0, H * 0.82, W, 120)
  ctx.fillStyle = '#ffffff'
  ctx.font = `900 44px ${DISPLAY}`
  ctx.fillText('TheMeoki × NaviRanobe', W / 2, H * 0.82 + 62)

  ctx.fillStyle = 'rgba(21,19,31,0.85)'
  ctx.font = `600 24px ${MONO}`
  ctx.fillText('CUỘC THI TRẮC NGHIỆM LIGHT NOVEL CÓ THƯỞNG', W / 2, H * 0.915)
  return toTexture(canvas)
}

/** Mặt sau: thông tin "sản phẩm" + mã vạch giả. */
export function createBackArt() {
  const { canvas, ctx } = makeCanvas()
  const g = ctx.createLinearGradient(0, H, W, 0)
  g.addColorStop(0, '#1b1436')
  g.addColorStop(1, '#5a3dd6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  sunburst(ctx, W / 2, H / 2, 14, 'rgba(255,255,255,0.05)')

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffd93b'
  ctx.font = `900 70px ${DISPLAY}`
  ctx.fillText('RANOBE', W / 2, H * 0.24)
  ctx.fillText('GIVEAWAY', W / 2, H * 0.3)
  ctx.fillStyle = '#ffffff'
  ctx.fillText('BOOSTER', W / 2, H * 0.36)

  ctx.font = `500 30px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.86)'
  const lines = [
    `KHAI CUỘC  ${event.timeLabel} · ${event.dateLabel}`,
    `NỘI DUNG  ${event.questionCount} CÂU TRẮC NGHIỆM`,
    `THỜI GIAN  ${event.minutes} PHÚT`,
    'GIẢI THƯỞNG  NHẤT · NHÌ · BA',
  ]
  lines.forEach((l, i) => ctx.fillText(l, W / 2, H * 0.47 + i * 58))

  // mã vạch
  let x = W * 0.25
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(W * 0.22, H * 0.7, W * 0.56, 150)
  ctx.fillStyle = '#15131f'
  let k = 7
  while (x < W * 0.75) {
    k = (k * 31 + 11) % 97
    const w = 3 + (k % 4) * 3
    ctx.fillRect(x, H * 0.7 + 16, w, 118)
    x += w + 4 + (k % 3) * 3
  }
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = `600 24px ${MONO}`
  ctx.fillText('HÀNG TẶNG · KHÔNG BÁN', W / 2, H * 0.85)
  return toTexture(canvas)
}
