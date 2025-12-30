import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
