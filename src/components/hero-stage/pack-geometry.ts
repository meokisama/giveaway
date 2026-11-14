import * as THREE from 'three'

export const PACK_WIDTH = 2.25
export const PACK_HEIGHT = 3.3

/**
 * Gói thẻ dạng túi: hai mặt (trước/sau) phồng lên ở giữa, dẹt lại ở mép hàn trên và dưới.
 * `aSide` = 1 cho mặt trước, -1 cho mặt sau (để chọn hình in trong shader).
 */
export function createPackGeometry(thickness = 0.27, su = 28, sv = 48) {
  const pos: number[] = []
  const uv: number[] = []
  const side: number[] = []
  const idx: number[] = []

  for (const s of [1, -1]) {
    const base = pos.length / 3
    for (let j = 0; j <= sv; j++) {
      for (let i = 0; i <= su; i++) {
        const u = i / su
        const v = j / sv
        const tv = Math.min(1, Math.max(0, (v - 0.07) / 0.86))
        const puff = Math.pow(Math.sin(Math.PI * tv), 0.5)
        const bulge = puff * Math.pow(Math.sin(Math.PI * u), 0.55) * thickness
        pos.push((u - 0.5) * PACK_WIDTH * (1 - 0.045 * puff), (v - 0.5) * PACK_HEIGHT, s * bulge)
        uv.push(s > 0 ? u : 1 - u, v)
        side.push(s)
      }
    }
    for (let j = 0; j < sv; j++) {
      for (let i = 0; i < su; i++) {
        const a = base + j * (su + 1) + i
        const b = a + 1
        const c = a + su + 1
        const d = c + 1
        if (s > 0) idx.push(a, b, d, a, d, c)
        else idx.push(a, d, b, a, c, d)
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}
