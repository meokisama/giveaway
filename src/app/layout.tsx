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

const description =
  'Đây là cuộc thi trắc nghiệm Light Novel có thưởng được thiết kế để kiểm tra khả năng hiểu và ghi nhớ các yếu tố văn học của Light Novel!'
const GA_ID = 'G-ZLCE7RSD0S'

export const metadata: Metadata = {
  title: 'Ranobe Giveaway Booster | Cuộc thi trắc nghiệm Light Novel',
  description,
  keywords: ['light novel', 'giveaway', 'light novel giveaway booster'],
  openGraph: {
    type: 'website',
    title: 'Light Novel Giveaway Booster',
    description,
    images: ['/meta.jpg'],
  },
  twitter: { card: 'summary_large_image' },
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
