import { Preloader } from '@/components/layout/preloader'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteNav } from '@/components/layout/site-nav'
import { Hero } from '@/components/sections/hero/hero'
import { Library } from '@/components/sections/library'
import { Organizers } from '@/components/sections/organizers'
import { Poem } from '@/components/sections/poem/poem'
import { Prizes } from '@/components/sections/prizes/prizes'
import { Prologue } from '@/components/sections/prologue'
import { Quiz } from '@/components/sections/quiz/quiz'
import { Rules } from '@/components/sections/rules'
import { Schedule } from '@/components/sections/schedule/schedule'

export default function HomePage() {
  return (
    <>
      <Preloader />
      <SiteNav />
      <main>
        <Hero />
        <Poem />
        <Prologue />
        <Organizers />
        <Schedule />
        <Rules />
        <Prizes />
        <Library />
        <Quiz />
      </main>
      <SiteFooter />
    </>
  )
}
