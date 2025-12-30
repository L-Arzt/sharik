import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

// Приводим url к относительному пути (если пришёл полный URL)
function normalizeImagePath(input: string): string {
  if (!input) return input;
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const u = new URL(input);
      return u.pathname + (u.search || '');
    }
  } catch {}
  return input;
}

type IncomingImage = { id?: string; url?: string; relativePath?: string; filename?: string };
type IncomingCategory = { id: string };

export async function GET(req: NextRequest) {
  try {
    verifyToken(req);

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const take = parseInt(searchParams.get('take') || '20', 10);
    const search = (searchParams.get('search') || '').trim();

    const where = search
      ? { OR: [{ name: { contains: search } }, { slug: { contains: search } }] }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          images: { orderBy: [{ isPrimary: 'desc' }, { imageOrder: 'asc' }] },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // Для UI удобно сразу отдавать превью
    const productsUi = products.map((p) => ({
      ...p,
      primaryImage:
        p.images?.find((i) => i.isPrimary)?.relativePath ||
        p.images?.[0]?.relativePath ||
        null,
      categoryNames: p.categories?.map((c) => c.category?.name).filter(Boolean) || [],
    }));

    return NextResponse.json({ products: productsUi, total, page: Math.floor(skip / take) + 1 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    verifyToken(req);

    const data = await req.json();

    const categoryIds: string[] = (data.categories || [])
      .map((c: IncomingCategory) => c?.id)
      .filter(Boolean);

    const imagePaths: string[] = (data.images || [])
      .map((img: IncomingImage) => img?.url || img?.relativePath)
      .filter(Boolean)
      .map(normalizeImagePath);

    const product = await prisma.product.create({
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
        isActive: data.isActive ?? true,
        inStock: data.inStock ?? true,

        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        images: {
          create: imagePaths.map((relativePath, idx) => ({
            relativePath,
            imageOrder: idx,
            isPrimary: idx === 0,
          })),
        },
      },
      include: {
        categories: { include: { category: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { imageOrder: 'asc' }] },
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}
