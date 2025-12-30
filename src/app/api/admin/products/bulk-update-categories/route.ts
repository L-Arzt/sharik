import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

// POST - массовое обновление категорий товаров
export async function POST(req: NextRequest) {
  try {
    verifyToken(req);
    const { productIds, categoryIds, action } = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Product IDs are required' }, { status: 400 });
    }

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json({ error: 'Category IDs are required' }, { status: 400 });
    }

    let updated = 0;

    // action: 'add' - добавить категории, 'remove' - удалить категории, 'replace' - заменить все категории
    for (const productId of productIds) {
      if (action === 'replace') {
        // Заменяем все категории
        await prisma.productCategory.deleteMany({ where: { productId } });
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({ productId, categoryId })),
        });
        updated++;
      } else if (action === 'add') {
        // Добавляем категории (если их еще нет)
        for (const categoryId of categoryIds) {
          const existing = await prisma.productCategory.findFirst({
            where: { productId, categoryId },
          });
          if (!existing) {
            await prisma.productCategory.create({
              data: { productId, categoryId },
            });
          }
        }
        updated++;
      } else if (action === 'remove') {
        // Удаляем категории
        await prisma.productCategory.deleteMany({
          where: {
            productId,
            categoryId: { in: categoryIds },
          },
        });
        updated++;
      }
    }

    return NextResponse.json({
      message: `Updated ${updated} products`,
      updated,
      total: productIds.length,
    });
  } catch (error) {
    console.error('Error bulk updating categories:', error);
    return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 });
  }
}

