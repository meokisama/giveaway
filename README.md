# Ranobe Giveaway Booster

Trang giới thiệu cuộc thi trắc nghiệm Light Novel của **TheMeoki × NaviRanobe** (bản dựng lại v3).

**Ý tưởng:** tên cuộc thi là "Booster", nên cả trang là một _gói thẻ bài booster_. Ở hero có một gói thẻ 3D
ánh kim (WebGL); cuộn xuống thì gói bị xé, thẻ trồi lên, lật mặt, xoè quạt rồi lao về phía người xem.
Mọi nội dung phía sau đều là "thẻ": bài thơ là 4 lá bài lật theo nhịp cuộn, thể lệ là 7 lá trượt ngang,
giải thưởng chia theo độ hiếm UR / SR / R, câu hỏi mẫu là đề thi thử chơi được.

## Công nghệ

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS v4**: token và utility riêng nằm trong `src/app/globals.css`
- **three.js**: gói thẻ + lá bài hologram bằng shader tự viết (`src/components/hero-stage`)
- **GSAP + ScrollTrigger** cho toàn bộ chuyển động theo cuộn, **Lenis** cho cuộn mượt
- Font tự host qua fontsource: Unbounded, Be Vietnam Pro, JetBrains Mono, Dela Gothic One

## Chạy

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build production
npm run start      # chạy bản đã build
```

## Cấu trúc

```
src/
  app/                  layout, page, globals.css (Tailwind @theme + utility)
  components/
    hero-stage/         cảnh WebGL: pack-scene, pack-geometry, pack-art, shaders
    layout/             preloader, site-nav, site-footer, smooth-scroll
    sections/           hero/, poem/, prologue, organizers, schedule/, rules, prizes/, library, quiz/
    ui/                 holo-card, section-heading, section-shell, marquee, starburst, pill-link, split-text
  data/                 nội dung: event, rules, organizers, konorano, questions, gold-photos
  lib/                  gsap (đăng ký plugin), hero-state, app-ready, confetti
```

Tên file dùng kebab-case. Muốn đổi ngày giờ sự kiện: sửa `src/data/event.ts`.

## Deploy

Dự án không gắn cứng domain hay đường dẫn con nào. Import repo vào Vercel là chạy, domain gán trong phần cài đặt của Vercel.
