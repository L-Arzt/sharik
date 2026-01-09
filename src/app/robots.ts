import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/_next/data/', '/admin/', '/cart/', '/favorites/', '/checkout/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/cart/', '/favorites/', '/checkout/'],
      },
      {
        userAgent: 'Yandex',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/cart/', '/favorites/', '/checkout/'],
      },
      {
        userAgent: 'YandexImages',
        allow: ['/api/images/'],
        disallow: ['/api/', '/admin/', '/cart/', '/favorites/', '/checkout/'],
      },
    ],
    sitemap: 'https://xn--80atjc1ay.xn--p1ai/sitemap.xml',
    host: 'https://xn--80atjc1ay.xn--p1ai',
  }
}
