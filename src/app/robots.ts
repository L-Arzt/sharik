import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/_next/static/'], // разрешаем статику
      disallow: ['/api/', '/_next/data/', '/admin/', '/cart/', '/checkout/'],
    },
    sitemap: 'https://xn--80atjc1ay.xn--p1ai/sitemap.xml',
    host: 'https://xn--80atjc1ay.xn--p1ai',
  }
}
