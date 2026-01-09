import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог воздушных шаров в Ростове-на-Дону и Аксае | Купить шары с доставкой | ШарикиРостов.рф',
  description: 'Каталог воздушных шаров в Ростове-на-Дону и Аксае. Широкий выбор товаров для праздников: день рождения, свадьба, корпоратив. Доставка от 4000₽ бесплатно. Заказ 24/7.',
  keywords: [
    'каталог воздушных шаров',
    'шары ростов',
    'шары ростов-на-дону',
    'шары аксай',
    'каталог шаров',
    'праздничные шары',
    'воздушные шары купить',
    'шары с доставкой',
    'оформление праздников',
    'шары для дня рождения',
    'шары для свадьбы',
  ],
  openGraph: {
    title: 'Каталог воздушных шаров | ШарикиРостов.рф',
    description: 'Каталог качественных воздушных шаров с доставкой в Ростове и Аксае',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://xn--80atjc1ay.xn--p1ai/catalog',
    siteName: 'ШарикиРостов.рф',
    images: [
      {
        url: 'https://xn--80atjc1ay.xn--p1ai/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Каталог воздушных шаров',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Каталог воздушных шаров | ШарикиРостов.рф',
    description: 'Каталог качественных воздушных шаров с доставкой',
    images: ['https://xn--80atjc1ay.xn--p1ai/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://xn--80atjc1ay.xn--p1ai/catalog',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Каталог воздушных шаров в Ростове-на-Дону и Аксае',
    description: 'Каталог качественных воздушных шаров для праздников: день рождения, свадьба, корпоратив. Доставка от 4000₽ бесплатно.',
    url: 'https://xn--80atjc1ay.xn--p1ai/catalog',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://xn--80atjc1ay.xn--p1ai/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Каталог',
          item: 'https://xn--80atjc1ay.xn--p1ai/catalog',
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}

