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
    default: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону | Заказать шары',
    template: '%s | ШарикиРостов.рф'
  },
  description: 'Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов. Качественные шары по доступным ценам. Доставка по городу 24/7. Самовывоз в центре.',
  keywords: 'воздушные шары ростов, шарики ростов на дону, купить шары ростов, день рождения ростов, свадьба ростов, корпоратив ростов, доставка шаров ростов, заказать шары ростов',
  authors: [{ name: 'ШарикиРостов.рф' }],
  creator: 'ШарикиРостов.рф',
  publisher: 'ШарикиРостов.рф',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://шарикиростов.рф'),
  alternates: {
    canonical: 'https://шарикиростов.рф',
  },
  openGraph: {
    title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
    description: 'Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов. Качественные шары по доступным ценам. Доставка по городу 24/7.',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://шарикиростов.рф',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Воздушные шары в Ростове-на-Дону - Качественные шары для любого праздника',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
    description: 'Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов.',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'shopping',
  classification: 'Воздушные шары и праздничное оформление',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ШарикиРостов.рф",
    "description": "Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов. Качественные шары по доступным ценам. Доставка по городу 24/7.",
    "url": "https://шарикиростов.рф",
    "telephone": "+7 (995) 135-13-23",
    "email": "sharikirostov61@mail.ru",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ростов-на-Дону",
      "addressRegion": "Ростовская область",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "47.2357",
      "longitude": "39.7015"
    },
    "openingHours": [
      "Mo-Fr 09:00-20:00",
      "Sa-Su 10:00-18:00"
    ],
    "priceRange": "₽₽",
    "currenciesAccepted": "RUB",
    "paymentAccepted": "Cash, Credit Card",
    "areaServed": {
      "@type": "City",
      "name": "Ростов-на-Дону"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Воздушные шары",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Воздушные шары для дня рождения"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Воздушные шары для свадьбы"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Воздушные шары для корпоративов"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Воздушные шары для гендер-пати"
          }
        }
      ]
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
