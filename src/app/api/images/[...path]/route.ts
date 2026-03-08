import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { stat } from 'fs/promises';
import { Readable } from 'stream';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: imagePath } = await params;
    const fullPath = path.join(process.cwd(), '../downloaded_images', ...imagePath);

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType: string =
      { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[ext] ||
      'application/octet-stream';

    const stats = await stat(fullPath);
    const etag = `"${stats.mtimeMs}-${stats.size}"`;
    if (req.headers.get('if-none-match') === etag) {
      return new NextResponse(null, { status: 304, headers: { ETag: etag } });
    }

    const nodeStream = createReadStream(fullPath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(stats.size),
        ETag: etag,
      },
    });
  } catch (error) {
    console.error('API Image Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}