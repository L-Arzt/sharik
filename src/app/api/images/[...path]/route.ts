import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params; 
    const imagePath = pathArray.join('/');
    
  
    const fullPath = path.join(process.cwd(), '..', 'downloaded_images', imagePath);


    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }


    const resolvedPath = path.resolve(fullPath);
    const allowedPath = path.resolve(path.join(process.cwd(), '..', 'downloaded_images'));
    
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
