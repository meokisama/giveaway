'use client'

import { useRef } from 'react'
import alisa from '@/assets/stickers/alisa.webp'
import { SectionHeading } from '@/components/ui/section-heading'
import { SectionShell } from '@/components/ui/section-shell'
import { goldPhotos } from '@/data/gold-photos'
import { gsap, useGSAP } from '@/lib/gsap'
import { CardFan } from './card-fan'
import { CashPrizeCard } from './cash-prize-card'

const FACTS = [
  { label: 'Khổ sách', value: 'A4' },
  { label: 'Váy cưới', value: '81' },
  { label: 'Tác phẩm', value: '81' },
]

/** Giải thưởng: ba độ hiếm: UR (artbook), SR và R (tiền mặt). */
export function Prizes() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.prize-fan', {
        scale: 0.4,
        rotate: -30,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.prize-gold', start: 'top 75%', once: true },
      })
      gsap.from('.prize-info > *', {
        x: 60,
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.prize-gold', start: 'top 70%', once: true },
      })
      gsap.from('.prize-sticker', {
        yPercent: 40,
        opacity: 0,
        rotate: 12,
        duration: 0.9,
        ease: 'back.out(1.8)',
        scrollTrigger: { trigger: '.prize-gold', start: 'top 55%', once: true },
      })
      gsap.from('.cash-card', {
        y: 140,
        rotate: (i) => (i ? 14 : -14),
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.prize-cash', start: 'top 82%', once: true },
      })
      // đếm số tiền
      gsap.utils.toArray<HTMLElement>('.cash-amount').forEach((el) => {
        const target = Number(el.dataset.amount)
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = (Math.round(counter.v / 1000) * 1000).toLocaleString('vi-VN')
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <SectionShell id="giai-thuong" tone="night">
      <div ref={root}>
        <SectionHeading
          index="04"
          kicker="賞品"
          title="Giải"
          highlight="Thưởng"
          highlightClassName="bg-sun"
          inverted
          description="Phần thưởng dành cho 3 người chiến thắng năm nay! Trượt sang trái/phải ở đống ảnh để xem ảnh tiếp theo!"
        />

        {/* UR: giải nhất */}
        <div className="prize-gold grid items-center gap-[clamp(3rem,6vw,7rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative">
            <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2">
              <div className="h-full w-full animate-spin-slow rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,217,59,0.2)_0_8deg,transparent_8deg_16deg)] [mask-image:radial-gradient(closest-side,black_30%,transparent)]" />
            </div>
            <div className="prize-fan relative">
              <CardFan photos={goldPhotos} label="Dengeki Wedding artbook" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={alisa.src}
              alt=""
              aria-hidden="true"
              className="prize-sticker pointer-events-none absolute bottom-10 -left-2 w-[clamp(6rem,11vw,11rem)] -rotate-6 sticker max-md:hidden"
            />
          </div>

          <div className="prize-info flex flex-col items-start gap-5">
            <p className="flex items-center gap-3 font-display text-sm font-black uppercase">
              <span className="rounded-full border-[3px] border-ink bg-sun px-3.5 py-0.5 text-ink shadow-hard-sm">UR</span>
              <span className="font-jp text-lg text-sun" lang="ja">
                一等
              </span>
              Giải Nhất
            </p>
            <h3 className="font-display text-[clamp(1.8rem,4.2vw,4.2rem)] leading-[1.05] font-black uppercase">
              Dengeki Wedding{' '}
              <span className="bg-linear-to-r from-sun via-bubble to-aqua bg-clip-text text-transparent">30th Anniversary</span> Artbook
            </h3>
            <p className="max-w-[52ch] text-lg text-white/85">
              Cuốn artbook kích cỡ A4 cho bộ ảnh kỉ niệm 30 năm của Dengeki Bunko. Bao gồm{' '}
              <strong className="text-sun">81 tấm ảnh váy cưới</strong> cho <strong className="text-sun">81 tác phẩm</strong> trong tổng số
              các ấn phẩm được xuất bản của họ trong 30 năm qua.
            </p>
            <dl className="flex flex-wrap gap-3">
              {FACTS.map((f) => (
                <div key={f.label} className="rounded-2xl border-[3px] border-white/25 bg-white/8 px-5 py-2.5">
                  <dt className="font-mono text-[0.65rem] font-bold tracking-widest text-white/60 uppercase">{f.label}</dt>
                  <dd className="font-display text-3xl leading-tight font-black text-sun">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="max-w-[46ch] rounded-2xl border-[3px] border-dashed border-white/30 px-5 py-3 text-sm text-white/75">
              <strong className="block font-display text-[0.7rem] font-extrabold tracking-wide text-white uppercase">✦ Thân thiện nhắc nhở ✦</strong>
              Trượt sang trái/phải ở đống ảnh để xem thêm ảnh tiếp theo!
            </p>
          </div>
        </div>

        {/* SR + R: tiền mặt */}
        <div className="prize-cash mt-[clamp(5rem,12vh,9rem)] grid gap-[clamp(1.6rem,3.4vw,3.4rem)] md:grid-cols-2">
          <CashPrizeCard rarity="SR" rank="Giải Nhì" kanji="二等" amount={700000} tone="bg-linear-to-br from-white via-[#dfe6f5] to-[#aab6d3]" className="md:-rotate-1">
            <p>
              Sau khi cân nhắc thì chúng tôi quyết định sẽ chỉ có Giải Nhất được đồ thật vật thật. Hai giải còn lại sẽ là tiền mặt, Giải
              Nhì sẽ là <strong>700.000đ</strong> và chúng tôi đưa ra hai phương án nhận thưởng cho quý độc giả như sau.
            </p>
            <ol className="flex flex-col gap-2">
              <li className="flex gap-3">
                <span className="font-display font-black">01</span> Nhận tiền bằng chuyển khoản trực tiếp.
              </li>
              <li className="flex gap-3">
                <span className="font-display font-black">02</span> Đặt hàng mua sách trực tiếp trên các nền tảng Fahasa/Shopee/Lazada/Tiki
                với tổng giá trị đơn hàng không vượt qua số tiền của giải thưởng.
              </li>
            </ol>
          </CashPrizeCard>

          <CashPrizeCard rarity="R" rank="Giải Ba" kanji="三等" amount={500000} tone="bg-linear-to-br from-[#ffe9d2] via-[#f4b98a] to-[#d98a55]" className="md:rotate-1">
            <p>
              Tương tự Giải Nhì thì Giải Ba cũng sẽ là tiền mặt với số tiền là <strong>500.000đ</strong> và cũng với 2 lựa chọn nhận thưởng
              như vậy. Tất nhiên nếu chọn phương án mua hàng thì chúng tôi khuyến khích là đơn hàng liên quan tới tiểu thuyết hoặc truyện
              tranh.
            </p>
            <p>
              Một mục đích khác của cuộc thi này với những câu hỏi trắc nghiệm và phần thưởng giá trị như vậy chính là để cổ vũ hỗ trợ phát
              triển văn hóa đọc nói chung đặc biệt là light novel nói riêng.
            </p>
          </CashPrizeCard>
        </div>
      </div>
    </SectionShell>
  )
}
