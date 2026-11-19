import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import '@fontsource-variable/unbounded/wght.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import '@fontsource/dela-gothic-one/japanese-400.css'
import './globals.css'

import { SmoothScroll } from '@/components/layout/smooth-scroll'

const SITE_URL = 'https://ga.ranobe.vn'
const SITE_NAME = 'Ranobe Giveaway Booster'
const title = `${SITE_NAME} | Cuộc thi trắc nghiệm Light Novel có thưởng`
const description =
  'Cuộc thi trắc nghiệm Light Novel có thưởng của TheMeoki × NaviRanobe: 20 câu hỏi, 60 phút, 3 giải thưởng. Thử sức với kiến thức về tác phẩm, tác giả, nhà xuất bản và giải thưởng Light Novel!'
const GA_ID = 'G-ZLCE7RSD0S'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: SITE_NAME,
  keywords: [
    'ranobe giveaway booster',
    'light novel',
    'ranobe',
    'giveaway',
    'trắc nghiệm light novel',
    'cuộc thi light novel',
    'TheMeoki',
    'NaviRanobe',
  ],
  authors: [
    { name: 'TheMeoki', url: 'https://facebook.com/TheMeoki' },
    { name: 'NaviRanobe', url: 'https://facebook.com/NaviRanobe' },
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    title,
    description,
  },
  // ảnh og/twitter lấy tự động từ app/opengraph-image.jpg
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export const viewport: Viewport = {
  themeColor: '#15131f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <SmoothScroll />
        {children}
        {/* Google Analytics: giữ nguyên ID của bản cũ */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  )
}
