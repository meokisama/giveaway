import logo from '@/assets/logo.webp'
import { event } from '@/data/event'
import { organizers } from '@/data/organizers'
import { Marquee } from '@/components/ui/marquee'
import { PillLink } from '@/components/ui/pill-link'

export function SiteFooter() {
  return (
    <footer className="relative z-10 -mt-12 overflow-clip rounded-t-[3rem] border-t-[3px] border-ink bg-ink pt-16 text-white">
      <Marquee
        className="border-y-[3px] border-white/15 py-4"
        itemClassName="font-display text-[clamp(2.4rem,7vw,7rem)] font-black uppercase leading-none text-transparent [-webkit-text-stroke:2px_var(--color-sun)]"
        items={['Ranobe Giveaway Booster', 'TheMeoki × NaviRanobe']}
      />
      <div className="flex flex-col items-center gap-8 px-[clamp(18px,5vw,96px)] py-[clamp(4rem,10vh,8rem)] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt="Ranobe Giveaway Booster" className="w-[min(34rem,82vw)] animate-float" />
        <p className="font-display text-[clamp(1.4rem,3.4vw,3rem)] leading-tight font-black uppercase">
          Hẹn gặp lại <span className="text-sun">ở mùa sau!</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {organizers.map((o) => (
            <PillLink key={o.handle} href={o.url} external className={o.tone === 'cyan' ? 'bg-aqua' : 'bg-bubble'}>
              @{o.handle} <span>↗</span>
            </PillLink>
          ))}
          <PillLink href="#top">
            Về đầu trang <span>↑</span>
          </PillLink>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-white/15 px-[clamp(18px,5vw,96px)] py-5 font-mono text-[0.65rem] tracking-widest text-white/60 uppercase">
        <span>© Ranobe Giveaway Booster {event.year}</span>
        <span>TheMeoki × NaviRanobe</span>
      </div>
    </footer>
  )
}
