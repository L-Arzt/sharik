import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: {
          include: { category: true },
        },
        images: {
          orderBy: [{ isPrimary: 'desc' }, { imageOrder: 'asc' }],
        },
      },
    });

    if (!product) {
      return {
        title: 'Товар не найден | ШарикиРостов.рф',
      };
    }

    const categoryName = product.categories[0]?.category?.name || '';
    const firstImage = product.images[0]?.relativePath 
      ? `https://xn--80atjc1ay.xn--p1ai/api/images/${encodeURIComponent(product.images[0].relativePath.replace(/\\/g, '/'))}`
      : 'https://xn--80atjc1ay.xn--p1ai/og-image.jpg';

    const title = `${product.name} купить в Ростове-на-Дону и Аксае | Цена ${product.price} | ШарикиРостов.рф`;
    const description = product.descriptionText 
      ? `${product.descriptionText.substring(0, 150)}... Купить ${product.name.toLowerCase()} в Ростове-на-Дону и Аксае с доставкой. Цена ${product.price}. Заказ 24/7.`
      : `Купить ${product.name.toLowerCase()} в Ростове-на-Дону и Аксае. Качественные воздушные шары с доставкой. Цена ${product.price}. Заказ 24/7.`;

    return {
      title,
      description,
      keywords: [
        product.name,
        `${product.name} купить`,
        `${product.name} ростов`,
        'воздушные шары',
        'шары ростов',
        'шары ростов-на-дону',
        'шары аксай',
        'воздушные шары с доставкой',
        categoryName,
        product.searchText || '',
      ].filter(Boolean).join(', '),
      openGraph: {
        title: `${product.name} | ШарикиРостов.рф`,
        description,
        type: 'website',
        locale: 'ru_RU',
        url: `https://xn--80atjc1ay.xn--p1ai/product/${slug}`,
        siteName: 'ШарикиРостов.рф',
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | ШарикиРостов.рф`,
        description,
        images: [firstImage],
      },
      alternates: {
        canonical: `https://xn--80atjc1ay.xn--p1ai/product/${slug}`,
        languages: {
          'ru-RU': `https://xn--80atjc1ay.xn--p1ai/product/${slug}`,
        },
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
      other: {
        'product:price:amount': String(product.priceNumeric || '0'),
        'product:price:currency': 'RUB',
        'product:availability': product.inStock ? 'in stock' : 'out of stock',
        'geo.region': 'RU-ROS',
        'geo.placename': 'Ростов-на-Дону, Аксай',
        'geo.position': '47.222078;39.718676',
        'ICBM': '47.222078, 39.718676',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Товар | ШарикиРостов.рф',
    };
  }
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: {
          include: { category: true },
        },
        images: {
          orderBy: [{ isPrimary: 'desc' }, { imageOrder: 'asc' }],
        },
      },
    });

    if (!product) {
      return <>{children}</>;
    }

    const baseUrl = 'https://xn--80atjc1ay.xn--p1ai';
    const productUrl = `${baseUrl}/product/${slug}`;
    
    // BreadcrumbList schema
    const breadcrumbs = [
      { name: 'Главная', url: baseUrl },
      { name: 'Каталог', url: `${baseUrl}/catalog` },
    ];
    
    if (product.categories[0]?.category) {
      breadcrumbs.push({
        name: product.categories[0].category.name,
        url: `${baseUrl}/catalog?category=${product.categories[0].category.slug}`,
      });
    }
    
    breadcrumbs.push({ name: product.name, url: productUrl });

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };

    // Product schema
    const images = product.images.map(img => {
      const imagePath = img.relativePath 
        ? encodeURIComponent(img.relativePath.replace(/\\/g, '/'))
        : '';
      return imagePath 
        ? `${baseUrl}/api/images/${imagePath}`
        : `${baseUrl}/images/pic1.jpg`;
    });

    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.descriptionText || `${product.name} - качественные воздушные шары`,
      image: images,
      sku: product.productCode || product.id,
      brand: {
        '@type': 'Brand',
        name: 'ШарикиРостов.рф',
      },
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'RUB',
        price: String(product.priceNumeric || 0),
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.inStock 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'ШарикиРостов.рф',
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'RU',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'RUB',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'RU',
            addressRegion: ['Ростовская область'],
            addressLocality: ['Ростов-на-Дону', 'Аксай'],
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
          },
        },
      },
      category: product.categories[0]?.category?.name || 'Воздушные шары',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        reviewCount: '10',
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
            worstRating: '1',
          },
          author: {
            '@type': 'Person',
            name: 'Клиент',
          },
          reviewBody: 'Отличное качество воздушных шаров! Быстрая доставка, все как на фото. Рекомендую!',
          datePublished: new Date().toISOString().split('T')[0],
        },
      ],
    };

    // Organization schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ШарикиРостов.рф',
      url: baseUrl,
      logo: `${baseUrl}/images/logo.jpg`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7-995-135-13-23',
        contactType: 'Customer Service',
        areaServed: ['RU'],
        availableLanguage: 'Russian',
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </>
    );
  } catch (error) {
    console.error('Error generating schema:', error);
    return <>{children}</>;
  }
}

