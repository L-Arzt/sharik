import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

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
    canonical: '/',
  },
  openGraph: {
    title: 'Воздушные шары в Ростове-на-Дону и Аксае 🎈 ШарикиРостов.рф',
    description: '🎉 День рождения, свадьба, корпоратив. Бесплатная доставка от 4000₽. Заказ 24/7',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Воздушные шары - яркое оформление праздников',
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
  // ✅ Правильная конфигурация для всех ваших фавиконок
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
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' }, // SVG для современных браузеров
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
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1',
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
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
