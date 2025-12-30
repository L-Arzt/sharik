import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-prod';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, JWT_SECRET) as { adminId: string };
}

export async function POST(req: NextRequest) {
  try {
    verifyToken(req);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Оптимизируем изображение sharp
    const optimized = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.split('.')[0]}.webp`;
    // Сохраняем в downloaded_images/uploads/products для единообразия
    const uploadDir = join(process.cwd(), '..', 'downloaded_images', 'uploads', 'products');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), optimized);

    // Возвращаем относительный путь от downloaded_images
    return NextResponse.json({
      url: `/uploads/products/${filename}`,
      relativePath: `uploads/products/${filename}`,
      filename,
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
