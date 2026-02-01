import type { Metadata, Viewport } from 'next'
import { Nunito, Comfortaa } from 'next/font/google'
import Script from 'next/script' // Можно использовать Script для метрики
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const nunito = Nunito({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const comfortaa = Comfortaa({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export const metadata: Metadata = {
  title: {
    default: 'Воздушные шары Ростов и Аксай 🎈 Доставка | ШарикиРостов.рф',
    template: '%s | ШарикиРостов.рф'
  },
  description: 'Воздушные шары в Ростове и Аксае 🎈 День рождения, свадьба, корпоратив. Доставка от 4000₽ бесплатно. Заказ 24/7 ☎️ +7 (995) 135-13-23',
  authors: [{ name: 'ШарикиРостов.рф' }],
  creator: 'ШарикиРостов.рф',
  publisher: 'ШарикиРостов.рф',
  metadataBase: new URL('https://xn--80atjc1ay.xn--p1ai'), 
  alternates: {
    canonical: 'https://xn--80atjc1ay.xn--p1ai/',
    languages: {
      'ru-RU': 'https://xn--80atjc1ay.xn--p1ai/',
    },
  },
  openGraph: {
    title: 'Воздушные шары в Ростове-на-Дону и Аксае 🎈 ШарикиРостов.рф',
    description: '🎉 День рождения, свадьба, корпоратив. Бесплатная доставка от 4000₽. Заказ 24/7',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://xn--80atjc1ay.xn--p1ai/',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: 'https://xn--80atjc1ay.xn--p1ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Воздушные шары - яркое оформление праздников в Ростове-на-Дону и Аксае',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Воздушные шары Ростов 🎈 Доставка от 4000₽',
    description: 'День рождения, свадьба, корпоратив. Заказ 24/7',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicons/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicons/favicon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/favicons/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicons/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicons/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicons/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/favicons/favicon.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'yandex-verification': '780e281315a6c67b',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ШарикиРостов.рф",
    "url": "https://xn--80atjc1ay.xn--p1ai",
    "logo": "https://xn--80atjc1ay.xn--p1ai/og-image.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-995-135-13-23",
      "contactType": "Customer Service",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "sameAs": [
      "https://t.me/cloudless_sky",
      "https://vk.com/cloudlessly_sky",
      "https://www.instagram.com/cloudlessly_sky"
    ]
  };

  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect для оптимизации загрузки */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106052852', 'ym');

            ym(106052852, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: "dataLayer",
                accurateTrackBounce: true,
                trackLinks: true
            });
          `}
        </Script>
      </head>
      <body className={`${nunito.variable} ${comfortaa.variable} font-sans antialiased`}>
        {/* Yandex.Metrika NoScript (в теле, чтобы не ругался Next.js на head) */}
        <noscript>
          <div>
              <img 
      src="https://mc.yandex.ru/watch/106052852" 
      style={{ position: 'absolute', left: '-9999px' }} 
      alt="" 
    />
          </div>
        </noscript>

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
