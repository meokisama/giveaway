/** Trạng thái dùng chung giữa DOM (GSAP) và cảnh WebGL của hero, đọc mỗi frame, không gây re-render. */
export const heroState = {
  /** tiến độ cuộn trong hero, 0..1 */
  progress: 0,
  /** 0 → 1 khi gói thẻ rơi vào khung hình lúc mở trang */
  intro: 0,
  /** con trỏ theo NDC (-1..1) */
  pointerX: 0,
  pointerY: 0,
}
