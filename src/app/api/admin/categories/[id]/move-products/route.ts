import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

// POST - переместить все товары из одной категории в другую
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyToken(req);
    const { id } = await params;
    const { targetCategoryId } = await req.json();

    if (!targetCategoryId) {
      return NextResponse.json({ error: 'Target category ID is required' }, { status: 400 });
    }

    // Находим все товары в исходной категории
    const productsInCategory = await prisma.productCategory.findMany({
      where: { categoryId: id },
      select: { productId: true },
    });

    const productIds = productsInCategory.map(pc => pc.productId);

    if (productIds.length === 0) {
      return NextResponse.json({ 
        message: 'No products found in this category',
        moved: 0 
      });
    }

    // Для каждого товара:
    // 1. Удаляем связь с исходной категорией
    // 2. Добавляем связь с целевой категорией (если её еще нет)
    let moved = 0;
    
    for (const productId of productIds) {
      // Удаляем связь с исходной категорией
      await prisma.productCategory.deleteMany({
        where: {
          productId,
          categoryId: id,
        },
      });

      // Проверяем, есть ли уже связь с целевой категорией
      const existing = await prisma.productCategory.findFirst({
        where: {
          productId,
          categoryId: targetCategoryId,
        },
      });

      // Добавляем связь с целевой категорией, если её нет
      if (!existing) {
        await prisma.productCategory.create({
          data: {
            productId,
            categoryId: targetCategoryId,
          },
        });
        moved++;
      } else {
        // Если связь уже есть, просто удаляем из исходной
        moved++;
      }
    }

    return NextResponse.json({
      message: `Moved ${moved} products`,
      moved,
      total: productIds.length,
    });
  } catch (error) {
    console.error('Error moving products:', error);
    return NextResponse.json({ error: 'Move failed' }, { status: 500 });
  }
}
