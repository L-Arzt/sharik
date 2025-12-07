import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// ✅ Добавьте эту строку в начало!
export const dynamic = 'force-dynamic'
export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://xn--80atjc1ay.xn--p1ai'
  
  try {
    // Получаем все активные товары
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { 
        slug: true, 
        updatedAt: true 
      },
    })
    
    // Получаем все категории
    const categories = await prisma.category.findMany({
      select: { 
        slug: true, 
        updatedAt: true 
      },
    })
    
    // Статические страницы
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/cart`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/favorites`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
    ]
    
    // Динамические страницы товаров
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    // Динамические страницы категорий
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/catalog?category=${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    
    return [...staticPages, ...productPages, ...categoryPages]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Возвращаем минимальный sitemap при ошибке
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
