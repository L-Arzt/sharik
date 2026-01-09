import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

function normalizeImagePath(input: string): string {
  if (!input) return input;
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const u = new URL(input);
      return u.pathname + (u.search || '');
    }
  } catch {
    // Ignore URL parsing errors
  }
  return input;
}

type IncomingImage = { id?: string; url?: string; relativePath?: string; filename?: string };
type IncomingCategory = { id: string };

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyToken(req);
    const data = await req.json();

    const { id: productId } = await params;

    const categoryIds: string[] = (data.categories || [])
      .map((c: IncomingCategory) => c?.id)
      .filter(Boolean);

    const imagePaths: string[] = (data.images || [])
      .map((img: IncomingImage) => img?.url || img?.relativePath)
      .filter(Boolean)
      .map(normalizeImagePath);

    // Обновляем сам товар
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: String(data.name || '').trim(),
        slug: String(data.slug || '').trim() || null,
        price: String(data.price || '').trim(),
        priceNumeric: typeof data.priceNumeric === 'number' ? data.priceNumeric : null,
        descriptionText: String(data.descriptionText || ''),
        descriptionItems: data.descriptionItems ? JSON.stringify(data.descriptionItems) : null,
        compositionItems: data.compositionItems ? JSON.stringify(data.compositionItems) : null,
        specifications: data.specifications ? JSON.stringify(data.specifications) : null,
        searchText: data.searchText || null,
        isActive: !!data.isActive,
        inStock: !!data.inStock,
      },
    });

    // Синхронизируем категории (просто и надёжно)
    await prisma.productCategory.deleteMany({ where: { productId } });
    if (categoryIds.length > 0) {
      // SQLite не поддерживает skipDuplicates, но мы уже удалили все записи выше
      await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId) => ({ productId, categoryId })),
      });
    }

    // Синхронизируем изображения (упрощённый вариант)
    // Старые удаляются каскадно, но чистим явно для предсказуемости.
    await prisma.productImage.deleteMany({ where: { productId } });
    if (imagePaths.length > 0) {
      await prisma.productImage.createMany({
        data: imagePaths.map((relativePath, idx) => ({
          productId,
          relativePath,
          imageOrder: idx,
          isPrimary: idx === 0,
        })),
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: { include: { category: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { imageOrder: 'asc' }] },
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    verifyToken(req);
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
