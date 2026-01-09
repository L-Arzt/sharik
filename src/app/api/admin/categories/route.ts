import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

// GET все категории (дерево)
export async function GET(req: NextRequest) {
  try {
    verifyToken(req);

    const categories = await prisma.category.findMany({
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// POST создать категорию
export async function POST(req: NextRequest) {
  try {
    verifyToken(req);
    // Receive data from the client
    const { name, slug, parentId, description } = await req.json();

    // Create the category using slug as the id
    const category = await prisma.category.create({
      data: { 
        id: slug,            // <--- HERE: Using slug as ID
        name, 
        slug, 
        parentId: parentId || null, 
        description 
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create category error:", error); // Helpful for debugging
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}