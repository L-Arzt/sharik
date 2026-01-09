import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // 1. Дожидаемся параметров (важно для Next.js 15)
    const { path: imagePath } = await params;

    // 2. ИСПРАВЛЕНИЕ: Ищем файл внутри папки 'public', а не в корне проекта
    const fullPath = path.join(process.cwd(), '../downloaded_images', ...imagePath);

    // 3. Проверяем существование файла
    try {
      await fs.access(fullPath);
    } catch {
      console.error(`File not found: ${fullPath}`); // Логируем ошибку для отладки
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 4. Читаем файл
    const imageBuffer = await fs.readFile(fullPath);

    // 5. Определяем тип контента
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    }[ext] || 'application/octet-stream';

    // 6. Отдаем файл как ответ
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('API Image Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}