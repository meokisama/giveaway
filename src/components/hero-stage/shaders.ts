const COMMON_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vN = normalMatrix * normal;
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const NOISE = /* glsl */ `
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), u.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), u.x), u.y);
}
vec3 rainbow(float t){ return .5 + .5 * cos(6.2832 * (t + vec3(0., .33, .67))); }
`

/* ───────── Gói booster: màng nhôm ánh kim, có đường xé răng cưa ───────── */

export const packVert = /* glsl */ `
attribute float aSide;
varying float vSide;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main(){
  vUv = uv; vSide = aSide;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vN = normalMatrix * normal;
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const packFrag = /* glsl */ `
precision highp float;
uniform sampler2D uFront, uBack;
uniform float uTime, uCut, uPart, uFade;
varying float vSide;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
${NOISE}
void main(){
  // đường xé: phần thân (uPart = 0) giữ bên dưới, phần nắp (uPart = 1) giữ bên trên
  float gu = vSide > 0. ? vUv.x : 1. - vUv.x;
  float edge = uCut + .010 * sin(gu * 64.) + .007 * sin(gu * 23. + 1.3);
  if (uPart < .5 ? vUv.y > edge : vUv.y <= edge) discard;
  // mép hàn răng cưa trên / dưới
  float tri = abs(fract(gu * 24.) - .5) * 2.;
  if (vUv.y > 1. - .013 * tri || vUv.y < .013 * tri) discard;
  if (uFade < hash21(gl_FragCoord.xy)) discard;

  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  bool inside = !gl_FrontFacing;
  if (inside) n = -n;

  float seal = step(vUv.y, .07) + step(.93, vUv.y);
  n = normalize(n + vec3(0., seal * sin(vUv.y * 520.) * .5, 0.));
  float cr = vnoise(vUv * vec2(9., 15.)) - .5;
  n = normalize(n + vec3(cr, cr * .8, 0.) * .28 * (1. - seal));

  float ndv = clamp(dot(n, v), 0., 1.);
  vec3 L = normalize(vec3(.35, .8, .7));
  float diff = dot(n, L) * .5 + .5;
  float spec = pow(max(dot(n, normalize(L + v)), 0.), 42.);
  vec3 irid = rainbow(ndv * 1.3 + vUv.y * .9 - gu * .5 + uTime * .07);

  vec3 col;
  if (inside) {
    // mặt trong: nhôm bạc
    col = vec3(.78, .8, .86) * (.5 + .6 * diff) + irid * .12 + spec * .5;
  } else {
    vec3 base = vSide > 0. ? texture2D(uFront, vUv).rgb : texture2D(uBack, vUv).rgb;
    float band = smoothstep(.09, 0., abs(fract(gu * .55 + vUv.y * .45 - uTime * .11) - .5));
    col = base * (.66 + .48 * diff);
    col = mix(col, col * irid * 1.9, .3);
    col += irid * pow(1. - ndv, 2.) * .6 + spec * .75 + band * .16;
    col = mix(col, col * 1.25 + irid * .2, seal);
  }
  gl_FragColor = vec4(col, 1.);
  #include <colorspace_fragment>
}
`

/* ───────── Lá bài: bo góc bằng SDF, viền kem, lớp hologram theo góc nhìn ───────── */

export const cardVert = COMMON_VERT

export const cardFrag = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uTime, uSeed;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
${NOISE}
float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main(){
  vec2 p = (vUv - .5) * vec2(.716, 1.);
  float d = rbox(p, vec2(.358, .5), .05);
  float aa = fwidth(d);
  float alpha = smoothstep(aa, -aa, d);
  if (alpha < .01) discard;

  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  if (!gl_FrontFacing) n = -n;
  float ndv = clamp(dot(n, v), 0., 1.);
  float inner = rbox(p, vec2(.358, .5) - .03, .028);
  vec3 border = vec3(1., .975, .9);
  vec3 col;

  if (gl_FrontFacing) {
    vec3 art = texture2D(uMap, (vUv - .5) / vec2(.916, .94) + .5).rgb;
    col = mix(art, border, smoothstep(-aa, aa, inner));
    // hologram: dải cầu vồng chéo + hạt lấp lánh, mạnh dần khi lá bài nghiêng
    float tilt = 1. - ndv;
    vec3 holo = rainbow(tilt * 2.4 + vUv.y * 1.2 + vUv.x * .8 + uSeed);
    float sparkle = step(.93, hash21(floor(vUv * 70.) + floor(uSeed * 40.))) * (.5 + .5 * sin(uTime * 3. + vUv.x * 40.));
    col += holo * (pow(tilt, 1.6) * .5 + .025) + sparkle * tilt * .8;
  } else {
    // mặt lưng: vòng tròn đồng tâm tím + ngôi sao vàng
    float r = length(p);
    col = mix(vec3(.13, .07, .38), vec3(.5, .34, 1.), .5 + .5 * sin(r * 52. - uTime * 1.6));
    float a = atan(p.y, p.x);
    float star = smoothstep(.02, .0, r - (.13 + .05 * cos(a * 5.)));
    col = mix(col, vec3(1., .84, .22), star);
    col = mix(col, border, smoothstep(-aa, aa, inner));
    col += rainbow((1. - ndv) * 2. + uSeed) * pow(1. - ndv, 1.5) * .5;
  }
  col += pow(max(dot(n, normalize(vec3(.3, .6, .75) + v)), 0.), 70.) * .7;
  col = mix(col, vec3(.08, .07, .12), smoothstep(-.016, -.006, d) * .9);
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
`
