/** Cờ "trang đã sẵn sàng": preloader bật, các animation mở màn và Lenis lắng nghe. */
let ready = false
const subscribers = new Set<() => void>()

export const appReady = {
  get done() {
    return ready
  },
  mark() {
    if (ready) return
    ready = true
    subscribers.forEach((fn) => fn())
    subscribers.clear()
  },
  /** Gọi `fn` ngay nếu đã sẵn sàng, không thì chờ. Trả về hàm huỷ đăng ký. */
  on(fn: () => void) {
    if (ready) {
      fn()
      return () => {}
    }
    subscribers.add(fn)
    return () => {
      subscribers.delete(fn)
    }
  },
}
