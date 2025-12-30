import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string | null;
  parentId: string | null;
  description: string | null;
  _count: {
    products: number;
  };
}

export async function GET() {
  try {
    // Получаем все категории с подсчетом товаров
    const categories: CategoryWithCount[] = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true, // Количество товаров в категории
          },
        },
      },
    });

    // Возвращаем категории с подсчетом товаров
    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      description: cat.description,
      productCount: cat._count.products,
    }));

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}












