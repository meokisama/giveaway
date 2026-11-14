import { event } from '@/data/event'
import { Marquee } from '@/components/ui/marquee'
import { Starburst } from '@/components/ui/starburst'

/** Các chi tiết quanh tựa đề: nhãn, huy hiệu, lời dẫn, nút gợi ý cuộn và băng dính chạy chữ. */
export function HeroChrome() {
  return (
    <>
      {/* nhãn phía trên */}
      <div className="hero-chrome absolute top-[11svh] left-[clamp(18px,5vw,96px)] z-20 flex flex-wrap items-center gap-2.5 max-lg:inset-x-0 max-lg:left-0 max-lg:justify-center">
        <span className="hero-pop rounded-full border-[3px] border-ink bg-ink px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-white">
          VOL. {event.year}
        </span>
        <span className="hero-pop rounded-full border-[3px] border-ink bg-white px-3.5 py-1 font-jp text-xs" lang="ja">
          ラノベ・ギブアウェイ・ブースター
        </span>
      </div>

      {/* huy hiệu */}
      <div className="hero-chrome absolute top-[13svh] right-[4vw] z-40 max-lg:top-auto max-lg:right-[3vw] max-lg:bottom-[24svh]">
        <Starburst className="hero-pop w-[clamp(6.5rem,11vw,11rem)] animate-wobble" fill="var(--color-bubble)">
          <span className="block font-display text-[clamp(0.7rem,1.15vw,1.15rem)] leading-tight font-black text-white uppercase text-stroke-thin">
            Có
            <br />
            thưởng!
          </span>
        </Starburst>
      </div>

      {/* lời dẫn + gợi ý cuộn */}
      <div className="hero-chrome absolute bottom-[13svh] left-[clamp(18px,5vw,96px)] z-20 flex max-w-[30rem] flex-col items-start gap-4 max-lg:inset-x-0 max-lg:bottom-[11svh] max-lg:left-0 max-lg:items-center max-lg:px-6 max-lg:text-center">
        <p className="hero-pop text-base font-semibold max-lg:hidden">
          Cuộc thi trắc nghiệm Light Novel có thưởng của <strong>TheMeoki × NaviRanobe</strong>, kỉ niệm ngày mở trang{' '}
          {event.anniversary}.
        </p>
        <div className="flex flex-wrap items-center gap-3 max-lg:justify-center">
          <span className="hero-pop rounded-full border-[3px] border-ink bg-sun px-4 py-1.5 font-display text-[0.7rem] font-extrabold uppercase shadow-hard-sm">
            {event.timeLabel} · {event.dateLabel}
          </span>
          <a
            href="#loi-de-tu"
            className="hero-pop flex items-center gap-2 rounded-full border-[3px] border-ink bg-white px-4 py-1.5 font-display text-[0.7rem] font-extrabold uppercase shadow-hard-sm"
          >
            Cuộn để xé gói <span className="animate-bob">↓</span>
          </a>
        </div>
      </div>

      {/* băng dính */}
      <div className="hero-chrome absolute inset-x-[-4vw] bottom-[3svh] z-40 -rotate-[1.6deg] border-y-[3px] border-ink bg-ink py-2.5 text-sun">
        <Marquee
          itemClassName="font-display text-sm font-extrabold uppercase tracking-wide"
          items={[
            'Ranobe Giveaway Booster',
            `${event.questionCount} câu hỏi`,
            `${event.minutes} phút`,
            '3 giải thưởng',
            'TheMeoki × NaviRanobe',
          ]}
        />
      </div>
    </>
  )
}
