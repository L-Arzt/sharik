import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }  // Изменено: Promise<...>
) {
  try {
    const { slug } = await params;

    // Ищем товар по slug или по id
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug }
        ],
        isActive: true,
      },
      include: {
        categories: {
          include: {
            category: {
              include: {
                parent: true,
              },
            },
          },
        },
        images: {
          orderBy: {
            imageOrder: 'asc',
          },
        },
        categoryPaths: {
          orderBy: { order: 'asc' },
        },
        // УБРАНО: descriptionItems, compositionItems, specifications
        // Теперь это JSON поля, а не отдельные таблицы
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    // Парсим JSON строки обратно в массивы/объекты
    const productWithParsedJson = {
      ...product,
      descriptionItems: product.descriptionItems 
        ? JSON.parse(product.descriptionItems as string) 
        : null,
      compositionItems: product.compositionItems 
        ? JSON.parse(product.compositionItems as string) 
        : null,
      specifications: product.specifications 
        ? JSON.parse(product.specifications as string) 
        : null,
    };

    return NextResponse.json(productWithParsedJson);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
