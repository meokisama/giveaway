import * as THREE from 'three'
import { heroState } from '@/lib/hero-state'
import { createBackArt, createFrontArt } from './pack-art'
import { createPackGeometry } from './pack-geometry'
import { cardFrag, cardVert, packFrag, packVert } from './shaders'

const CARD_COUNT = 9
const MID = (CARD_COUNT - 1) / 2
const CUT = 0.882

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const backOut = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2)

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Cảnh 3D của hero: một gói booster ánh kim lơ lửng theo con trỏ.
 * Khi cuộn (heroState.progress 0 → 1): nắp bị xé → thẻ trồi lên, lật mặt, xoè thành hình quạt
 * → thẻ lao về phía ống kính để mở sang phần nội dung.
 */
export class PackScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  private root = new THREE.Group()
  private pack = new THREE.Group()
  private body!: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  private cap!: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
  private cards: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = []
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private disposed = false
  private aspect = 1
  private wide = true
  private px = 0
  private py = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private sources: { logo: string; cards: string[] },
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.camera.position.set(0, 0, 10)
    this.scene.add(this.root)
    this.root.add(this.pack)
    this.resize()
    window.addEventListener('resize', this.resize)
  }

  /** Tải hình in + ảnh thẻ rồi dựng mesh. */
  async load() {
    const [logo, ...photos] = await Promise.all([
      loadImage(this.sources.logo),
      ...this.sources.cards.slice(0, CARD_COUNT).map(loadImage),
      document.fonts.load('900 40px "Unbounded Variable"').catch(() => undefined),
      document.fonts.load('600 24px "JetBrains Mono Variable"').catch(() => undefined),
    ] as Promise<HTMLImageElement>[])
    if (this.disposed) return

    // gói thẻ: cùng một hình học, vẽ hai lần (thân + nắp) với đường cắt đối nhau
    const geo = createPackGeometry()
    const front = createFrontArt(logo)
    const back = createBackArt()
    const makePart = (part: number) =>
      new THREE.Mesh(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: packVert,
          fragmentShader: packFrag,
          side: THREE.DoubleSide,
          uniforms: {
            uFront: { value: front },
            uBack: { value: back },
            uTime: { value: 0 },
            uCut: { value: CUT },
            uPart: { value: part },
            uFade: { value: 1 },
          },
        }),
      )
    this.body = makePart(0)
    this.cap = makePart(1)
    this.body.renderOrder = 2
    this.cap.renderOrder = 2
    this.pack.add(this.body, this.cap)

    const cardGeo = new THREE.PlaneGeometry(1.146, 1.6)
    photos.slice(0, CARD_COUNT).forEach((img, i) => {
      const tex = new THREE.Texture(img)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      tex.needsUpdate = true
      const mesh = new THREE.Mesh(
        cardGeo,
        new THREE.ShaderMaterial({
          vertexShader: cardVert,
          fragmentShader: cardFrag,
          side: THREE.DoubleSide,
          alphaToCoverage: true,
          // các lá bài xếp lớp theo renderOrder (như bài thật chồng lên nhau) chứ không so độ sâu,
          // nếu không những lá đang nghiêng/lật sẽ cắt xuyên qua nhau
          depthTest: false,
          depthWrite: false,
          uniforms: { uMap: { value: tex }, uTime: { value: 0 }, uSeed: { value: i * 0.137 } },
        }),
      )
      mesh.renderOrder = 1
      this.cards.push(mesh)
      this.root.add(mesh)
    })
    this.frame()
  }

  private resize = () => {
    const w = this.canvas.clientWidth || window.innerWidth
    const h = this.canvas.clientHeight || window.innerHeight
    this.aspect = w / h
    this.wide = w >= 1024
    this.renderer.setSize(w, h, false)
    this.camera.aspect = this.aspect
    this.camera.updateProjectionMatrix()
  }

  start() {
    if (this.running || this.disposed) return
    this.running = true
    this.clock.getDelta()
    this.raf = requestAnimationFrame(this.loop)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private loop = () => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.loop)
    this.frame()
  }

  private frame() {
    if (!this.body) return
    const t = this.clock.getElapsedTime()
    const p = heroState.progress
    const intro = heroState.intro
    this.px += (heroState.pointerX - this.px) * 0.07
    this.py += (heroState.pointerY - this.py) * 0.07

    // màn dọc: thu nhỏ cả cụm để quạt thẻ không tràn khung
    const fit = Math.min(1, Math.max(0.5, this.aspect / 1.45))
    this.root.scale.setScalar(0.62 + 0.38 * fit)
    // lúc đầu gói thẻ đứng lệch (phải trên desktop, dưới trên di động) để nhường chỗ tựa đề, rồi về giữa khi xé
    const aside = 1 - smooth(0.06, 0.36, p)
    const halfW = Math.tan((16 * Math.PI) / 180) * 10 * this.aspect
    this.root.position.set(this.wide ? halfW * 0.5 * aside : 0, this.wide ? 0 : -1.25 * aside, 0)

    // ── gói thẻ
    const drop = smooth(0.28, 0.62, p)
    const out = smooth(0.74, 1, p)
    const land = backOut(clamp01(intro))
    this.pack.position.set(0, (1 - land) * 8 + Math.sin(t * 1.1) * 0.07 - drop * 2.75 - out * out * 6, 0)
    this.pack.rotation.set(
      -this.py * 0.28 + Math.sin(t * 0.8) * 0.05 + drop * 0.16,
      this.px * 0.55 + Math.sin(t * 0.6) * 0.22 * (1 - drop) + (1 - clamp01(intro)) * Math.PI * 2,
      Math.sin(t * 0.5) * 0.04 - 0.06,
    )
    this.pack.scale.setScalar(1 - drop * 0.12)

    // ── nắp bị xé bay đi
    const c = smooth(0.05, 0.26, p)
    this.cap.visible = c < 0.999
    this.cap.position.set(c * 1.9, c * 1.5 - c * c * 1.2, c * 0.8)
    this.cap.rotation.set(c * 0.9, c * 0.5, -c * 1.5)
    this.cap.material.uniforms.uFade.value = 1 - smooth(0.7, 1, c)
    this.body.material.uniforms.uTime.value = t
    this.cap.material.uniforms.uTime.value = t

    // ── thẻ
    const fanK = 0.55 + 0.45 * fit
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i]
      const o = i - MID
      const order = Math.abs(o) + (o > 0 ? 0.5 : 0)
      const rise = smooth(0.2 + order * 0.028, 0.44 + order * 0.028, p)
      card.visible = c > 0.3 && out < 0.995
      if (!card.visible) continue

      const theta = o * 0.2
      const fanX = Math.sin(theta) * 5.4 * fanK
      const fanY = 0.75 + (Math.cos(theta) - 1) * 3.2
      // bên trong gói → vị trí quạt
      const baseY = this.pack.position.y + 0.1
      let x = fanX * rise
      let y = baseY + (fanY - baseY) * rise + Math.sin(rise * Math.PI) * 1.1
      let z = -0.02 + rise * (0.5 + i * 0.03)
      let rz = -theta * 0.95 * rise
      let ry = (1 - rise) * Math.PI + this.px * 0.35 + Math.sin(t * 0.9 + i) * 0.1 * rise
      let rx = -this.py * 0.25 + Math.cos(t * 0.7 + i * 1.7) * 0.07 * rise
      let s = 0.82 + rise * 0.5

      // lao về phía ống kính
      if (out > 0) {
        const e = out * out
        x += Math.sin(theta) * e * 9 + o * e * 0.6
        y += (0.4 + Math.cos(i * 2.3) * 1.6) * e * 3
        z += e * (7.5 + (i % 3) * 1.4)
        rz += o * e * 0.9
        ry += e * (i % 2 ? 2.2 : -2.2)
        rx += e * 0.8
        s += e * 0.4
      }
      // trong lúc trồi lên: vẽ trước gói thẻ (gói che phần chưa ra khỏi miệng túi), lá bên phải đè lá bên trái.
      // khi lao về ống kính: vẽ sau gói thẻ, lá nào gần hơn thì đè lên.
      card.renderOrder = out > 0 ? 3 + z * 0.01 : 1 + i * 0.01
      card.position.set(x, y, z)
      card.rotation.set(rx, ry, rz)
      card.scale.setScalar(s)
      card.material.uniforms.uTime.value = t
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    this.stop()
    window.removeEventListener('resize', this.resize)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>
      if (!m.isMesh) return
      m.geometry.dispose()
      for (const u of Object.values(m.material.uniforms)) (u.value as THREE.Texture | null)?.dispose?.()
      m.material.dispose()
    })
    this.renderer.dispose()
  }
}
