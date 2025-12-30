import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// --- Вспомогательные функции ---

function transliterate(text: string): string {
  const ru: Record<string, string> = {
    'а': 'a','б': 'b','в': 'v','г': 'g','д': 'd','е': 'e','ё': 'yo','ж': 'zh','з': 'z',
    'и': 'i','й': 'y','к': 'k','л': 'l','м': 'm','н': 'n','о': 'o','п': 'p','р': 'r',
    'с': 's','т': 't','у': 'u','ф': 'f','х': 'h','ц': 'ts','ч': 'ch','ш': 'sh','щ': 'sch',
    'ъ': '','ы': 'y','ь': '','э': 'e','ю': 'yu','я': 'ya',
    ' ': '-', '/': '-', '\\': '-', ':': '-', '.': '-', ',': '-', '?': '', '!': '', '(': '', ')': ''
  };

  return (text || '')
    .toLowerCase()
    .split('')
    .map(char => ru[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractPrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const cleaned = String(priceStr)
    .replace(/\s/g, '')
    .replace(/[^\d,.]/g, '')
    .replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function extractTextFromHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseDescriptionItems(html: string | null): string[] {
  if (!html) return [];
  const items: string[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const text = extractTextFromHtml(match[1]);
    if (text) items.push(text);
  }
  return items;
}

function createSearchText(name: string, description: string | null, composition: any): string {
  const parts: string[] = [name.toLowerCase()];
  if (description) {
    const textOnly = extractTextFromHtml(description);
    parts.push(textOnly.toLowerCase());
  }
  if (composition) {
    if (Array.isArray(composition)) {
      parts.push(composition.join(' ').toLowerCase());
    } else if (typeof composition === 'string') {
      parts.push(composition.toLowerCase());
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

async function main() {
  console.log('Импорт ТОЛЬКО новых товаров из Taplink в существующую БД (без изменения цен)...');

  const productsPath = path.join(__dirname, '../../products_data.json');
  if (!fs.existsSync(productsPath)) {
    console.error(`Файл не найден: ${productsPath}`);
    return;
  }

  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  const categoryCache = new Map<string, string>();

  async function getOrCreateCategory(name: string, parentId: string | null = null): Promise<string> {
    const cleanName = name.trim();
    let slug = transliterate(cleanName);
    const cacheKey = parentId ? `${parentId}-${slug}` : slug;

    if (categoryCache.has(cacheKey)) return categoryCache.get(cacheKey)!;

    let existing = await prisma.category.findFirst({
      where: { slug, parentId }
    });

    if (!existing) {
      const orphan = await prisma.category.findFirst({
        where: { slug, parentId: null }
      });

      if (orphan && parentId) {
        existing = await prisma.category.update({
          where: { id: orphan.id },
          data: { parentId }
        });
      } else if (orphan && !parentId) {
        existing = orphan;
      }
    }

    if (existing) {
      categoryCache.set(cacheKey, existing.id);
      return existing.id;
    }

    let finalSlug = slug;
    let counter = 1;
    while (await prisma.category.findUnique({ where: { id: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const created = await prisma.category.create({
      data: {
        id: finalSlug,
        name: cleanName,
        slug: finalSlug,
        parentId,
        description: ''
      }
    });

    categoryCache.set(cacheKey, created.id);
    return created.id;
  }

  console.log(`В файле товаров: ${productsData.length}`);

  let imported = 0;
  let skipped = 0;

  for (const productData of productsData) {
    try {
      const prodName = productData.name || 'Без названия';
      const baseSlug = transliterate(prodName);

      // Если товар с таким slug уже есть — пропускаем
      const existing = await prisma.product.findFirst({
        where: { slug: baseSlug }
      });

      if (existing) {
        skipped++;
        continue;
      }

      let finalProductId = baseSlug;
      let suffix = 1;
      while (await prisma.product.findUnique({ where: { id: finalProductId } })) {
        finalProductId = `${baseSlug}-${suffix++}`;
      }

      // Цена как в JSON
      const priceString: string = productData.price || '0 ₽';
      const priceNumeric: number = extractPrice(productData.price) || 0;

      let compositionArray: string[] = [];
      if (productData.composition) {
        if (Array.isArray(productData.composition)) {
          compositionArray = productData.composition;
        } else if (typeof productData.composition === 'string') {
          compositionArray = [productData.composition];
        }
      }

      const descriptionText =
        productData.description_text || extractTextFromHtml(productData.description_html);
      const descriptionItems = parseDescriptionItems(productData.description_html);

      const product = await prisma.product.create({
        data: {
          id: finalProductId,
          name: prodName,
          slug: finalProductId,
          price: priceString,
          priceNumeric,
          descriptionText,
          descriptionItems:
            descriptionItems.length > 0 ? JSON.stringify(descriptionItems) : null,
          compositionItems:
            compositionArray.length > 0 ? JSON.stringify(compositionArray) : null,
          specifications: null,
          searchText: createSearchText(prodName, descriptionText, compositionArray),
          isActive: true,
          inStock: true
        }
      });

      if (productData.category) {
        const parts = productData.category
          .split('>')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);

        let currentParentId: string | null = null;

        for (let i = 0; i < parts.length; i++) {
          const catName = parts[i];
          if (i > 0 && parts[i] === parts[i - 1]) continue;

          const catId = await getOrCreateCategory(catName, currentParentId);

          await prisma.productCategoryPath.create({
            data: {
              productId: product.id,
              pathPart: catName,
              order: i
            }
          });

          currentParentId = catId;
        }

        if (currentParentId) {
          await prisma.productCategory.create({
            data: {
              productId: product.id,
              categoryId: currentParentId
            }
          }).catch(() => {});
        }
      }

      if (productData.local_images && productData.local_images.length > 0) {
        for (let i = 0; i < productData.local_images.length; i++) {
          const img = productData.local_images[i];
          await prisma.productImage.create({
            data: {
              productId: product.id,
              localPath: img.image_path || null,
              relativePath: img.image_relative_path || null,
              filename: img.image_filename || null,
              imageOrder: img.image_order || i,
              isPrimary: i === 0
            }
          });
        }
      }

      imported++;
      if (imported % 50 === 0) {
        console.log(`Импортировано новых: ${imported}, пропущено (дубликаты): ${skipped}`);
      }
    } catch (error) {
      console.error(`Ошибка товара ${productData.name}:`, error);
      skipped++;
    }
  }

  console.log('\n✅ Импорт завершен (без изменения цен)!');
  console.log(`Новых товаров добавлено: ${imported}`);
  console.log(`Пропущено (уже были): ${skipped}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
