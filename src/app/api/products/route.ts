import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const inStock = searchParams.get('inStock');
    const tags = searchParams.get('tags');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');


    // Строим условия фильтрации
    const where: Prisma.ProductWhereInput = {
      ...(includeInactive ? {} : { isActive: true }),
    };


    // Фильтр по наличию
    if (inStock === 'true') {
      where.inStock = true;
    } else if (inStock === 'false') {
      where.inStock = false;
    }


    // Фильтр по категории (с включением всех подкатегорий)
    if (categoryId) {
      const getAllSubcategoryIds = async (catId: string): Promise<string[]> => {
        const children = await prisma.category.findMany({
          where: { parentId: catId },
          select: { id: true }
        });
        
        const childIds = children.map(c => c.id);
        const allIds = [catId, ...childIds];
        
        for (const child of children) {
          const subIds = await getAllSubcategoryIds(child.id);
          allIds.push(...subIds);
        }
        
        return allIds;
      };
      
      const categoryIds = await getAllSubcategoryIds(categoryId);
      
      where.categories = {
        some: {
          categoryId: { in: categoryIds },
        },
      };
    }
    
    // Фильтр по цене
    if (minPrice || maxPrice) {
      where.priceNumeric = {};
      if (minPrice) {
        where.priceNumeric.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.priceNumeric.lte = parseFloat(maxPrice);
      }
    }


    // Улучшенный поиск
    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: search } },
        { descriptionText: { contains: search } },
        { searchText: { contains: searchLower } },
        { productCode: { contains: search } },
        { tags: { contains: search } },
      ];
    }


    // Фильтр по тегам
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.OR = [
        ...(where.OR || []),
        ...tagArray.map(tag => ({
          tags: { contains: tag, mode: 'insensitive' as const },
        })),
      ];
    }


    // Строим параметры сортировки
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.priceNumeric = sortOrder as 'asc' | 'desc';
    } else if (sortBy === 'created') {
      orderBy.createdAt = sortOrder as 'asc' | 'desc';
    } else if (sortBy === 'popular') {
      orderBy.views = sortOrder as 'asc' | 'desc';
    } else if (sortBy === 'order') {
      orderBy.displayOrder = sortOrder as 'asc' | 'desc';
    } else {
      orderBy[sortBy as keyof Prisma.ProductOrderByWithRelationInput] = sortOrder as 'asc' | 'desc';
    }


    // Получаем товары - УБРАНЫ несуществующие include
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
          // УБРАНО: descriptionItems, compositionItems, specifications, categoryPaths
          // Эти поля теперь JSON в самой таблице Product
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);


    // Для каталога не нужно парсить JSON - отдаём как есть
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
