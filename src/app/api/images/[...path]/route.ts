import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }  // Изменено: Promise<...>
) {
  try {
    const imagePath = params.path.join('/');
    // Путь к изображениям (на уровень выше проекта sharik)
    const fullPath = path.join(process.cwd(), '..', 'parsing_shar', 'downloaded_images', imagePath);

    // Проверяем, что файл существует и находится в разрешенной директории
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Проверяем, что путь не выходит за пределы разрешенной директории
    const resolvedPath = path.resolve(fullPath);
    const allowedPath = path.resolve(path.join(process.cwd(), '..', 'parsing_shar', 'downloaded_images'));
    
    if (!resolvedPath.startsWith(allowedPath)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}

