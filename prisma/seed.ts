// import { PrismaClient } from '@prisma/client';
// import * as fs from 'fs';
// import * as path from 'path';

// const prisma = new PrismaClient();

// // --- Вспомогательные функции ---

// // Функция транслитерации для создания красивых ID (slug)
// function transliterate(text: string): string {
//   const ru: Record<string, string> = {
//     'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
//     'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
//     'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
//     'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 
//     ' ': '-', '/': '-', '\\': '-', ':': '-', '.': '-', ',': '-', '?': '', '!': '', '(': '', ')': ''
//   };
  
//   return (text || '')
//     .toLowerCase()
//     .split('')
//     .map(char => ru[char] || char)
//     .join('')
//     .replace(/[^a-z0-9-]/g, '') // Убираем все, что не буквы, цифры или дефис
//     .replace(/-+/g, '-')        // Убираем двойные дефисы
//     .replace(/^-|-$/g, '');     // Убираем дефисы по краям
// }

// // Функция для создания slug (используем транслитерацию как основу)
// function createSlug(text: string): string {
//   return transliterate(text);
// }

// // Функция для извлечения числового значения из цены
// function extractPrice(priceStr: string): number | null {
//   if (!priceStr) return null;
//   // Убираем пробелы (включая неразрывные), валюту и заменяем запятую на точку
//   const cleaned = String(priceStr).replace(/\s/g, '').replace(/[^\d,.]/g, '').replace(',', '.');
//   const num = parseFloat(cleaned);
//   return isNaN(num) ? null : num;
// }

// // Функция для извлечения текста из HTML (удаление тегов)
// function extractTextFromHtml(html: string | null): string {
//   if (!html) return '';
//   return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
// }

// // Функция для парсинга descriptionHtml и извлечения <li> элементов
// function parseDescriptionItems(html: string | null): string[] {
//   if (!html) return [];
//   const items: string[] = [];
//   const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
//   let match;
//   while ((match = liRegex.exec(html)) !== null) {
//     const text = extractTextFromHtml(match[1]);
//     if (text) items.push(text);
//   }
//   return items;
// }

// // Функция для создания поискового текста
// function createSearchText(name: string, description: string | null, composition: any): string {
//   const parts: string[] = [name.toLowerCase()];
//   if (description) {
//     const textOnly = extractTextFromHtml(description);
//     parts.push(textOnly.toLowerCase());
//   }
//   if (composition) {
//     if (Array.isArray(composition)) {
//       parts.push(composition.join(' ').toLowerCase());
//     } else if (typeof composition === 'string') {
//       parts.push(composition.toLowerCase());
//     }
//   }
//   return parts.join(' ').replace(/\s+/g, ' ').trim();
// }

// // --- Основная логика импорта ---

// async function main() {
//   console.log('Начало очистки и импорта данных...');

//   // 1. Очистка базы данных перед импортом
//   // Удаляем в правильном порядке (сначала зависимости)
//   await prisma.productImage.deleteMany();
//   await prisma.productSpecification.deleteMany();
//   await prisma.productDescriptionItem.deleteMany();
//   await prisma.productCompositionItem.deleteMany();
//   await prisma.productCategoryPath.deleteMany();
//   await prisma.productCategory.deleteMany(); 
//   await prisma.product.deleteMany();
//   await prisma.category.deleteMany();
  
//   console.log('База данных очищена.');

//   // Чтение JSON файлов
//   // Пути скорректированы относительно папки prisma/seed.ts
//   const productsPath = path.join(__dirname, '../../parsing_shar/data/products_data.json'); 

//   // Проверка наличия файлов
//   if (!fs.existsSync(productsPath)) {
//     console.error(`Файл не найден: ${productsPath}`);
//     return;
//   }

//   const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  
//   // Кэш для ID категорий: "slug" -> "category_id"
//   // Мы используем только slug для идентификации, чтобы одни и те же категории
//   // в разных ветках (если такие есть) объединялись, или наоборот, разделялись
//   // Для корректной иерархии лучше использовать "slug" как уникальный ключ
//   const categoryCache = new Map<string, string>();

//   // Функция для получения или создания категории
//   // Теперь она принимает parentId, чтобы правильно выстраивать дерево
//   async function getOrCreateCategory(name: string, parentId: string | null = null): Promise<string> {
//     const cleanName = name.trim();
//     // Создаем slug, который включает в себя slug родителя для уникальности подкатегорий
//     // Например: shary-na-dr-vzroslym
//     // Но для простоты и читаемости URL часто используют просто транслит имени
//     // Если будут дубли имен в разных ветках ("Для девочек" в ДР и в Выписке), 
//     // то лучше делать составной slug или уникальный суффикс.
    
//     let slug = transliterate(cleanName);
    
//     // Если у нас есть родитель, проверим, не совпадает ли имя с родителем (защита от дублей типа "Шары > Шары")
//     if (parentId) {
//          // Получаем слаг родителя из кэша (это сложно без обратного маппинга, пропустим пока)
//     }

//     // Проверяем кэш
//     const cacheKey = parentId ? `${parentId}-${slug}` : slug; // Уникальность в рамках родителя
//     if (categoryCache.has(cacheKey)) {
//       return categoryCache.get(cacheKey)!;
//     }
    
//     // Проверяем БД. Нам нужно найти категорию с таким слагом.
//     // Если она есть, но parentId отличается - это может быть коллизия имен в разных ветках.
//     // Поэтому мы ищем конкретно с нашим parentId (или null)
//     let existing = await prisma.category.findFirst({
//         where: { 
//             slug: slug,
//             parentId: parentId 
//         }
//     });

//     // Если не нашли с таким родителем, попробуем найти просто по слагу
//     // (вдруг она была создана без родителя, а теперь мы узнали родителя)
//     if (!existing) {
//         const orphan = await prisma.category.findFirst({
//             where: { slug: slug, parentId: null }
//         });
        
//         if (orphan && parentId) {
//             // Если нашли сироту и у нас есть родитель - обновляем
//             existing = await prisma.category.update({
//                 where: { id: orphan.id },
//                 data: { parentId: parentId }
//             });
//         } else if (orphan && !parentId) {
//             existing = orphan;
//         }
//     }

//     if (existing) {
//         categoryCache.set(cacheKey, existing.id);
//         return existing.id;
//     }

//     // Если все еще не нашли - создаем
//     // Если slug занят другой категорией (в другой ветке), добавляем суффикс
//     let finalSlug = slug;
//     let counter = 1;
//     while (await prisma.category.findUnique({ where: { id: finalSlug } })) {
//         finalSlug = `${slug}-${counter}`;
//         counter++;
//     }

//     try {
//         const created = await prisma.category.create({
//             data: {
//                 id: finalSlug,
//                 name: cleanName,
//                 slug: finalSlug,
//                 parentId: parentId,
//                 description: '', 
//             }
//         });
//         categoryCache.set(cacheKey, created.id);
//         return created.id;
//     } catch (e) {
//         // Fallback на случай гонки или ошибки
//         console.error(`Ошибка создания категории ${cleanName}:`, e);
//         // Пробуем найти еще раз
//         const fallback = await prisma.category.findFirst({ where: { name: cleanName } });
//         if (fallback) return fallback.id;
//         throw e;
//     }
//   }

//   console.log(`Найдено ${productsData.length} товаров для импорта...`);
  
//   let imported = 0;
//   let skipped = 0;

//   for (const productData of productsData) {
//     try {
//       // 1. Подготовка данных товара
//       const prodName = productData.name || 'Без названия';
//       const prodSlug = transliterate(prodName);
      
//       // Пропускаем дубликаты слагов
//       let finalProductId = prodSlug;
//       const existingProduct = await prisma.product.findUnique({ where: { id: prodSlug } });
      
//       if (existingProduct) {
//           finalProductId = `${prodSlug}-${Math.floor(Math.random() * 10000)}`;
//       }

//       const priceNumeric = extractPrice(productData.price);
      
//       // Состав и описание
//       let compositionArray: string[] = [];
//       if (productData.composition) {
//         if (Array.isArray(productData.composition)) compositionArray = productData.composition;
//         else if (typeof productData.composition === 'string') compositionArray = [productData.composition];
//       }

//       const descriptionText = productData.description_text || extractTextFromHtml(productData.description_html);
//       const descriptionItems = parseDescriptionItems(productData.description_html);
      
//       // 2. Создание товара
//       const product = await prisma.product.create({
//         data: {
//           id: finalProductId,
//           name: prodName,
//           slug: finalProductId,
//           price: productData.price || '0',
//           priceNumeric: priceNumeric || 0,
//           descriptionText: descriptionText,
//           searchText: createSearchText(prodName, descriptionText, compositionArray),
//           isActive: true,
//           inStock: true,
//         }
//       });

//       // 3. Обработка категорий из строки "category"
//       // Пример: "По событиям > Шары на День рождения > Взрослым > На День рождения мужу"
//       if (productData.category) {
//           const parts = productData.category.split('>').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          
//           let currentParentId: string | null = null;
          
//           // Проходим по цепочке:
//           // 1. "По событиям" (parentId: null) -> id: po-sobytiyam
//           // 2. "Шары на День рождения" (parentId: po-sobytiyam) -> id: shary-na-dr
//           // 3. "Взрослым" (parentId: shary-na-dr) -> id: vzroslym
//           // ...
          
//           for (let i = 0; i < parts.length; i++) {
//               const catName = parts[i];
              
//               // Защита от дублей имен (если "Шары" > "Шары")
//               if (i > 0 && parts[i] === parts[i-1]) {
//                   continue;
//               }

//               const catId = await getOrCreateCategory(catName, currentParentId);
              
//               // Сохраняем путь для товара
//               await prisma.productCategoryPath.create({
//                   data: {
//                       productId: product.id,
//                       pathPart: catName,
//                       order: i
//                   }
//               });

//               currentParentId = catId;
//           }

//           // Связываем товар с ПОСЛЕДНЕЙ категорией (самой глубокой)
//           if (currentParentId) {
//               await prisma.productCategory.create({
//                   data: {
//                       productId: product.id,
//                       categoryId: currentParentId
//                   }
//               }).catch(() => {});
//           }
//       }

//       // 4. Доп. данные
//       // Состав
//       for (let i = 0; i < compositionArray.length; i++) {
//           await prisma.productCompositionItem.create({
//               data: { productId: product.id, text: compositionArray[i], order: i }
//           });
//       }

//       // Описание
//       for (let i = 0; i < descriptionItems.length; i++) {
//         await prisma.productDescriptionItem.create({
//             data: { productId: product.id, text: descriptionItems[i], order: i }
//         });
//       }

//       // Картинки
//        if (productData.local_images && productData.local_images.length > 0) {
//         for (let i = 0; i < productData.local_images.length; i++) {
//           const img = productData.local_images[i];
//           await prisma.productImage.create({
//             data: {
//               productId: product.id,
//               localPath: img.image_path || null,
//               relativePath: img.image_relative_path || null,
//               filename: img.image_filename || null,
//               imageOrder: img.image_order || i,
//               isPrimary: i === 0,
//             },
//           });
//         }
//       }

//       imported++;
//       if (imported % 50 === 0) console.log(`Импортировано ${imported}...`);

//     } catch (error) {
//       console.error(`Ошибка товара ${productData.name}:`, error);
//       skipped++;
//     }
//   }

//   console.log(`\n✅ Импорт завершен!`);
//   console.log(`Всего обработано: ${imported}`);
//   console.log(`Ошибок/Пропущено: ${skipped}`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// --- Вспомогательные функции ---

function transliterate(text: string): string {
  const ru: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 
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
  const cleaned = String(priceStr).replace(/\s/g, '').replace(/[^\d,.]/g, '').replace(',', '.');
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

// ИСПРАВЛЕННАЯ функция проверки категории "По форме"
function isShapeCategory(categoryPath: string): boolean {
  if (!categoryPath) return false;
  
  const lowerPath = categoryPath.toLowerCase();
  
  // Проверяем точные совпадения со словами, а не подстроками
  const parts = lowerPath.split('>').map(s => s.trim());
  
  for (const part of parts) {
    // Проверяем точное совпадение "по форме" или если часть содержит эту фразу
    if (part === 'по форме' || part.includes('по форме')) {
      return true;
    }
    
    // Проверяем, является ли слово "форма" отдельным словом (с границами)
    const words = part.split(/\s+/);
    if (words.includes('форма') || words.includes('формы')) {
      return true;
    }
  }
  
  return false;
}

async function main() {
  console.log('Начало очистки и импорта данных...');

  // Очистка базы данных
  await prisma.productImage.deleteMany();
  await prisma.productCategoryPath.deleteMany();
  await prisma.productCategory.deleteMany(); 
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  console.log('База данных очищена.');

  const productsPath = path.join(__dirname, '../../parsing_shar/data/products_data.json'); 

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
    if (categoryCache.has(cacheKey)) {
      return categoryCache.get(cacheKey)!;
    }
    
    let existing = await prisma.category.findFirst({
        where: { 
            slug: slug,
            parentId: parentId 
        }
    });

    if (!existing) {
        const orphan = await prisma.category.findFirst({
            where: { slug: slug, parentId: null }
        });
        
        if (orphan && parentId) {
            existing = await prisma.category.update({
                where: { id: orphan.id },
                data: { parentId: parentId }
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

    try {
        const created = await prisma.category.create({
            data: {
                id: finalSlug,
                name: cleanName,
                slug: finalSlug,
                parentId: parentId,
                description: '', 
            }
        });
        categoryCache.set(cacheKey, created.id);
        return created.id;
    } catch (e) {
        console.error(`Ошибка создания категории ${cleanName}:`, e);
        const fallback = await prisma.category.findFirst({ where: { name: cleanName } });
        if (fallback) return fallback.id;
        throw e;
    }
  }

  console.log(`Найдено ${productsData.length} товаров для импорта...`);
  
  let imported = 0;
  let skipped = 0;
  let priceIncreasedCount = 0;
  let shapeCategryCount = 0;

  for (const productData of productsData) {
    try {
      const prodName = productData.name || 'Без названия';
      const prodSlug = transliterate(prodName);
      
      let finalProductId = prodSlug;
      const existingProduct = await prisma.product.findUnique({ where: { id: prodSlug } });
      
      if (existingProduct) {
          finalProductId = `${prodSlug}-${Math.floor(Math.random() * 10000)}`;
      }

      const categoryPath = productData.category || '';
      const isShape = isShapeCategory(categoryPath);
      
      // Извлекаем оригинальную цену
      let priceNumeric = extractPrice(productData.price);
      let priceString = productData.price || '0 ₽';
      
      // Увеличиваем цену на 20% если это НЕ категория "По форме"
      if (priceNumeric && !isShape) {
        const originalPrice = priceNumeric;
        priceNumeric = Math.round(priceNumeric * 1.2); // +20%
        priceString = `${priceNumeric} ₽`;
        priceIncreasedCount++;
        
        // Логирование для отладки (первые 10 товаров)
        if (priceIncreasedCount <= 10) {
          console.log(`✓ Цена увеличена: "${prodName}" | ${originalPrice}₽ → ${priceNumeric}₽ | Категория: ${categoryPath}`);
        }
      } else if (isShape) {
        shapeCategryCount++;
        // Логирование для отладки (первые 10 товаров "По форме")
        if (shapeCategryCount <= 10) {
          console.log(`○ Цена НЕ изменена (По форме): "${prodName}" | ${priceNumeric}₽ | Категория: ${categoryPath}`);
        }
      }
      
      // Подготовка JSON данных
      let compositionArray: string[] = [];
      if (productData.composition) {
        if (Array.isArray(productData.composition)) {
          compositionArray = productData.composition;
        } else if (typeof productData.composition === 'string') {
          compositionArray = [productData.composition];
        }
      }

      const descriptionText = productData.description_text || extractTextFromHtml(productData.description_html);
      const descriptionItems = parseDescriptionItems(productData.description_html);
      
      // Создание товара
      const product = await prisma.product.create({
        data: {
          id: finalProductId,
          name: prodName,
          slug: finalProductId,
          price: priceString,
          priceNumeric: priceNumeric || 0,
          descriptionText: descriptionText,
          descriptionItems: descriptionItems.length > 0 ? JSON.stringify(descriptionItems) : null,
          compositionItems: compositionArray.length > 0 ? JSON.stringify(compositionArray) : null,
          specifications: null,
          searchText: createSearchText(prodName, descriptionText, compositionArray),
          isActive: true,
          inStock: true,
        }
      });

      // Обработка категорий
      if (productData.category) {
          const parts = productData.category.split('>').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          
          let currentParentId: string | null = null;
          
          for (let i = 0; i < parts.length; i++) {
              const catName = parts[i];
              
              if (i > 0 && parts[i] === parts[i-1]) {
                  continue;
              }

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

      // Картинки
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
              isPrimary: i === 0,
            },
          });
        }
      }

      imported++;
      if (imported % 100 === 0) console.log(`Импортировано ${imported}...`);

    } catch (error) {
      console.error(`Ошибка товара ${productData.name}:`, error);
      skipped++;
    }
  }

  console.log(`\n✅ Импорт завершен!`);
  console.log(`Всего импортировано: ${imported}`);
  console.log(`Ошибок/Пропущено: ${skipped}`);
  console.log(`\n💰 Статистика цен:`);
  console.log(`  - Цены увеличены на 20%: ${priceIncreasedCount} товаров`);
  console.log(`  - Цены оставлены без изменений (категория "По форме"): ${shapeCategryCount} товаров`);
  console.log(`  - Товары без цены или ошибки: ${imported - priceIncreasedCount - shapeCategryCount} товаров`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
