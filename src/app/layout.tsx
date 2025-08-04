import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону",
    template: "%s | ШарикиРостов.рф"
  },
  description: "Воздушные шары в Ростове-на-Дону! Шарики для дня рождения, свадьбы, корпоративов. Качественные шары по доступным ценам. Самовывоз.",
  keywords: "воздушные шары ростов, шарики ростов на дону, купить шары ростов, день рождения ростов, свадьба ростов",
  authors: [{ name: "ШарикиРостов.рф" }],
  creator: "ШарикиРостов.рф",
  publisher: "ШарикиРостов.рф",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://шарикиростов.рф'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://шарикиростов.рф',
    siteName: 'ШарикиРостов.рф',
    title: 'ШарикиРостов.рф - Воздушные шары в Ростове-на-Дону',
    description: 'Воздушные шары в Ростове-на-Дону! Качественные шары по доступным ценам.',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
