import { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'Воздушные шары в Ростове-на-Дону и Аксае | ШарикиРостов.рф',
  description: 'Воздушные шары с доставкой в Ростове-на-Дону и Аксае! Оформление праздников: день рождения, свадьба, корпоратив. Бесплатная доставка. Самовывоз.',
  authors: [{ name: 'ШарикиРостов.рф' }],
  creator: 'ШарикиРостов.рф',
  publisher: 'ШарикиРостов.рф',
  metadataBase: new URL('https://xn--80atjc1ay.xn--p1ai'), 
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Воздушные шары в Ростове-на-Дону и Аксае',
    description: 'Качественные воздушные шары с доставкой в Ростове и Аксае. Бесплатная доставка.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Воздушные шары - ШарикиРостов.рф',
      },
    ],
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
    google: 'замените-на-реальный-код', // ⚠️ Исправьте
    yandex: '780e281315a6c67b',
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ШарикиРостов.рф",
    "description": "Воздушные шары для праздников в Ростове-на-Дону и Аксае",
    "image": "https://xn--80atjc1ay.xn--p1ai/og-image.jpg",
    "url": "https://xn--80atjc1ay.xn--p1ai",
    "telephone": "+7 (995) 135-13-32", 
    "priceRange": "₽₽",
    "areaServed": [
      {
        "@type": "City",
        "name": "Ростов-на-Дону"
      },
      {
        "@type": "City",
        "name": "Аксай"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ростов-на-Дону",
      "addressRegion": "Ростовская область",
      "postalCode": "344000",
      "addressCountry": "RU"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 pt-16">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
    </>
  );
}
