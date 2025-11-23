import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Изменено
) {
  try {
    const { id } = await params;  // Добавлено
    
    // Пытаемся найти по id или slug
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: id },  // Используем распакованный id
          { slug: id },
        ],
      },
      include: {
        parent: true,
        children: {
          orderBy: {
            name: 'asc',
          },
        },
        products: {
          include: {
            product: {
              include: {
                images: {
                  where: {
                    isPrimary: true,
                  },
                  take: 1,
                },
              },
            },
          },
          take: 10, // Ограничиваем количество для предпросмотра
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
