import { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Categories from '@/components/Categories';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
  description: 'Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов. Качественные шары по доступным ценам. Самовывоз.',
  keywords: 'воздушные шары ростов, шарики ростов на дону, купить шары ростов, день рождения ростов, свадьба ростов',
  openGraph: {
    title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
    description: 'Воздушные шары в Ростове-на-Дону! Качественные шары по доступным ценам.',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://шарикиростов.рф',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Воздушные шары в Ростове-на-Дону',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
    description: 'Воздушные шары в Ростове-на-Дону!',
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
  alternates: {
    canonical: 'https://шарикиростов.рф',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 pt-16">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <FAQ />
      <ContactSection />
    </main>
  );
}
